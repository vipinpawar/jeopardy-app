"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import ReCAPTCHA from "react-google-recaptcha";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;

const SignInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export default function SignInForm() {
  const [formData, setFormData] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const router = useRouter();

  // React Query Mutation for CAPTCHA Verification
  const captchaMutation = useMutation({
    mutationFn: async (token: string) => {
      const { data } = await axios.post("/api/verify-captcha", { captchaToken: token });
      return data;
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const fieldSchema = SignInSchema.shape[name as keyof typeof SignInSchema.shape];
    try {
      fieldSchema.parse(value);
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (error) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: (error as z.ZodError).errors?.[0]?.message || "Invalid input",
      }));
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = SignInSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA.");
      return;
    }

    try {
      // CAPTCHA Verification with React Query
      await captchaMutation.mutateAsync(captchaToken);

      // Sign In via NextAuth
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Signed in successfully!");
        router.push("/");
      }
    } catch (error) {
      toast.error("An error occurred. Try again later.");
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Sign In</h2>
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-800 py-3 rounded-lg shadow-sm hover:bg-gray-100 transition cursor-pointer"
        >
          <FcGoogle className="text-2xl mr-2" />
          Sign in with Google
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full p-3 border ${formErrors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring focus:ring-blue-300`}
            />
            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full p-3 border ${formErrors.password ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring focus:ring-blue-300`}
            />
            <div className="flex justify-between items-center mt-1">
              {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
              <a href="/auth/forget-password" className="text-blue-600 text-sm hover:underline ml-auto">Forget Password?</a>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <ReCAPTCHA sitekey={siteKey} onChange={handleCaptchaChange} theme="light" />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold cursor-pointer ${captchaToken ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
            disabled={!captchaToken}
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don&apos;t have an account? <a href="/auth/signup" className="text-blue-600 font-medium hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
}