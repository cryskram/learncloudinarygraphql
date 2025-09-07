"use client";

import { useMutation } from "@apollo/client/react";
import gql from "graphql-tag";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { useState } from "react";

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $imageUrl: String) {
    createPost(title: $title, content: $content, imageUrl: $imageUrl) {
      id
      title
      content
    }
  }
`;

const CreatePost = () => {
  const [createPost] = useMutation(CREATE_POST);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();

    if (data) {
      setImageUrl(data.secure_url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPost({ variables: { title, content, imageUrl } });
    setContent("");
    setImageUrl("");
    setTitle("");
    redirect("/");
  };
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="w-full p-2 rounded outline-none bg-white shadow"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 rounded outline-none bg-white shadow"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input type="file" onChange={handleUpload} />
        {imageUrl && (
          <Image src={imageUrl} width={200} height={200} alt="image" />
        )}
        <button type="submit" className="bg-orange-500 px-4 py-2 rounded-2xl">
          Publish
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
