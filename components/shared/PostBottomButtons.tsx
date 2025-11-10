"use client"; // ⚠️ Important for client-side interactivity
import Link from "next/link";
import React from "react";

interface Props {
  postTitle: string;
}

const PostBottomButtons: React.FC<Props> = ({ postTitle }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: postTitle,
        url: window.location.href,
      });
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  return (
    <div className="mt-12 flex justify-between">
      <Link
        href="/blog"
        className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white font-semibold rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        All Posts
      </Link>
      <button
        onClick={handleShare}
        className="px-6 py-2 bg-blue-500 text-white font-semibold cursor-pointer rounded hover:bg-blue-600 transition"
      >
        Share
      </button>
    </div>
  );
};

export default PostBottomButtons;
