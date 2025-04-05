'use client';

import { useState } from 'react';
import axios from "axios";
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';

export default function CreateCategoryForm() {
  const [categoryName, setCategoryName] = useState<string>('');

  // Mutation function to create a category
  const createCategory = async (name: string) => {
    const response = await axios.post('/api/categories', { name });
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success('Category created successfully!');
      setCategoryName('');
    },
    onError: (error: any) => {
      console.error(error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to create category. Please try again.');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(categoryName);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create Blog Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Category Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50 cursor-pointer"
        >
          {mutation.isPending ? 'Creating...' : 'Create Category'}
        </button>
      </form>
    </div>
  );
}
