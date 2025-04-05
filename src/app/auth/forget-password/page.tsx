"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

export default function ForgetPasswordForm() {
  const [email, setEmail] = useState<string>("");

  const mutation: UseMutationResult<{ message: string }, Error, void> = useMutation({
    mutationFn: async () => {
      const response = await axios.post<{ message: string }>("/api/auth/forget-password", { email });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Reset link sent! Check your email.");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred. Try again.");
    },
  });

  const handleForgetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Forget Password</h2>
        <form onSubmit={handleForgetPassword} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold transition cursor-pointer ${mutation.isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Back to {" "}
          <a href="/auth/signin" className="text-blue-600 font-medium hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
