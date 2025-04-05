"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useMutation } from "@tanstack/react-query";

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string[];
  email?: string[];
  message?: string[];
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCaptchaChange = (token: string | null) => {
    console.log("Captcha Token:", token);
    setCaptchaToken(token);
  };

  const verifyCaptchaMutation = useMutation({
    mutationFn: async () => {
      if (!captchaToken) throw new Error("Please complete the CAPTCHA!");
      const response = await axios.post("/api/verify-captcha", { captchaToken });
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "CAPTCHA verification failed.");
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/contact", formData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong!");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      setFormErrors(validation.error.flatten().fieldErrors);
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      await verifyCaptchaMutation.mutateAsync();
      await sendMessageMutation.mutateAsync();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className={`w-full p-3 border ${formErrors.name ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring focus:ring-blue-300`}
            />
            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className={`w-full p-3 border ${formErrors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring focus:ring-blue-300`}
            />
            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows={4}
              className={`w-full p-3 border ${formErrors.message ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring focus:ring-blue-300`}
            ></textarea>
            {formErrors.message && <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>}
          </div>
          <div className="flex justify-center mt-4">
            <ReCAPTCHA sitekey={siteKey} onChange={handleCaptchaChange} theme="light" />
          </div>
          <button
            type="submit"
            disabled={verifyCaptchaMutation.isPending || sendMessageMutation.isPending}
            className={`w-full flex justify-center items-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer ${
              verifyCaptchaMutation.isPending || sendMessageMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {verifyCaptchaMutation.isPending || sendMessageMutation.isPending ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" /> Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
