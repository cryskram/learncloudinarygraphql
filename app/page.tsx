"use client";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Post } from "./generated/prisma";
import Image from "next/image";
import Link from "next/link";

const POST_QUERY = gql`
  query GetAllPosts {
    posts {
      id
      title
      content
      imageUrl
      createdAt
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(POST_QUERY);
  console.log(data);
  if (loading) return <p className="text-center">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Something went wrong</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">No Name Blog</h1>
        <Link
          className="bg-slate-900 text-white rounded-xl px-4 py-2"
          href="/create"
        >
          Create
        </Link>
      </div>
      <div className="space-y-4 mt-4">
        {data.posts.map((post: Post) => (
          <div key={post.id} className="p-4 rounded-xl bg-white shadow">
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                width={200}
                height={200}
                alt="post image"
                className="rounded-lg mb-2"
              />
            )}
            <h1 className="text-xl font-semibold">{post.title}</h1>
            <p className="text-gray-600">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
