"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

// Define Category type
interface Category {
  id: string;
  name: string;
}

const CreateBlogForm: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");

  // Fetch categories using React Query
  const { data: categories = [], isLoading: isCategoriesLoading, error: categoryError } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get("/api/categories");
      return res.data;
    },
  });

  // Create blog mutation
  const { mutate: createBlog, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/blogs", {
        title,
        image,
        content,
        categoryId,
      });

      return res.data;
    },
    onSuccess: () => {
      toast.success("Blog post created successfully!");
      setTitle("");
      setImage("");
      setContent("");
      setCategoryId("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to create blog post.");
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !image || !content || !categoryId) {
      toast.error("Please fill in all fields!");
      return;
    }
    createBlog();
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create Blog Post</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Blog Title */}
        <div>
          <label className="block font-medium mb-1">Blog Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter blog title"
          />
        </div>

        {/* Blog Image */}
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Paste Image URL"
        />

        {/* Content */}
        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded"
            rows={5}
            placeholder="Write blog content here"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-1">Category</label>
          {isCategoriesLoading ? (
            <p>Loading categories...</p>
          ) : categoryError ? (
            <p className="text-red-500">Failed to load categories</p>
          ) : (
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center justify-center bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition cursor-pointer${
            isSubmitting ? " opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <PlusCircle className="inline mr-2" />
          {isSubmitting ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlogForm;
