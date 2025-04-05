'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Blog {
  id: string;
  title: string;
  image: string;
  content: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
}

export default function CategoryBlogsPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const { data: categories, isLoading: categoryLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories');
      return res.data;
    }
  });

  const { data: blogs, isLoading: blogsLoading } = useQuery<Blog[]>({
    queryKey: ['blogs', categoryId],
    queryFn: async () => {
      const res = await axios.get('/api/blogs');
      return res.data.filter((blog: Blog) => blog.categoryId === categoryId);
    },
    enabled: !!categoryId
  });

  const category = categories?.find(cat => cat.id === categoryId);

  if (categoryLoading || blogsLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-indigo-50 py-10 px-6">
      <Link href="/blogs">
        <button className="mb-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 cursor-pointer">
          ← Back to Categories
        </button>
      </Link>

      <h1 className="text-3xl font-bold text-center mb-10 text-indigo-700">
        {category?.name} Blogs
      </h1>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {blogs?.map(blog => (
          <Link key={blog.id} href={`/blogs/post/${blog.id}`}>
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition hover:scale-105 cursor-pointer overflow-hidden">
              <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-indigo-700">{blog.title}</h2>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{blog.content}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}