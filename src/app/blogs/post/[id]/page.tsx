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

export default function SingleBlogPage() {
  const params = useParams<{ id: string }>();
  const blogId = params?.id;

  // Fetch function for blog data
  const fetchBlogs = async () => {
    const response = await axios.get<Blog[]>('/api/blogs');
    return response.data;
  };

  // Use React Query to fetch data
  const { data: blogs, isLoading, isError } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  });

  // Find the specific blog
  const blog = blogs?.find((b) => b.id === blogId);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !blog) return <div>Error loading blog</div>;

  return (
    <div className="min-h-screen bg-indigo-50 py-10 px-6">
      <Link href={`/blogs/category/${blog.categoryId}`}>
        <button className="mb-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 cursor-pointer">
          ← Back to Blogs
        </button>
      </Link>

      <h1 className="text-4xl font-bold text-center mb-10 text-indigo-700">{blog.title}</h1>

      <div className="max-w-4xl mx-auto">
        <img src={blog.image} alt={blog.title} className="w-full h-96 object-cover rounded-lg mb-8" />

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">{blog.content}</p>
        </div>
      </div>
    </div>
  );
}
