'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Define TypeScript interface for category data
interface Category {
  id: string;
  name: string;
}

export default function CategoriesPage() {
  // Fetch categories using React Query
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories');
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center text-indigo-700">Loading categories...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load categories.</p>;

  return (
    <div className="min-h-screen bg-indigo-50 py-10 px-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-indigo-700">Blog Categories</h1>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {categories?.map((category) => (
          <Link key={category.id} href={`/blogs/category/${category.id}`}>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition hover:scale-105 cursor-pointer text-center">
              <h2 className="text-xl font-semibold text-indigo-700">{category.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
