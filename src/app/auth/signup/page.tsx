"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { z } from "zod";

const SignUpSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

type SignUpData = z.infer<typeof SignUpSchema>;

type FormErrors = Partial<Record<keyof SignUpData, string>>;

export default function SignUpForm() {
  const [formData, setFormData] = useState<SignUpData>({
    username: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // React Query Mutation for API Request
  const mutation = useMutation({
    mutationFn: async (data: SignUpData) => {
      const response = await axios.post("/api/signup", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`Welcome ${formData.username}, You signed up!`);
      setFormData({ username: "", email: "", password: "" });
      setFormErrors({});
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Error signing up. Please try again.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const fieldSchema = SignUpSchema.shape[name as keyof SignUpData];
    try {
      fieldSchema.parse(value);
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (error) {
      setFormErrors((prev) => ({ ...prev, [name]: (error as any).errors?.[0]?.message || "Invalid value" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = SignUpSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: FormErrors = {};
      validation.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as keyof SignUpData] = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Register Now</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(["username", "email", "password"] as (keyof SignUpData)[]).map((field) => (
            <div key={field}>
              <label className="block text-gray-700 font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter your ${field}`}
                className={`w-full p-3 border ${formErrors[field] ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring focus:ring-blue-300`}
              />
              {formErrors[field] && <p className="text-red-500 text-sm mt-1">{formErrors[field]}</p>}
            </div>
          ))}
          <button type="submit" className="w-full py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer">
            {mutation.isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account? <a href="/auth/signin" className="text-blue-600 font-medium hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  );
}