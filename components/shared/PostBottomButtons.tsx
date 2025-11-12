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
        className="rounded border border-[color:var(--color-primary)] px-6 py-2 font-semibold text-[color:var(--color-primary)] transition hover:bg-[color:var(--color-primary)] hover:text-white"
      >
        All Posts
      </Link>
      <button
        onClick={handleShare}
        className="cursor-pointer rounded bg-[color:var(--color-primary)] px-6 py-2 font-semibold text-white transition hover:bg-[#0042d1]"
      >
        Share
      </button>
    </div>
  );
};

export default PostBottomButtons;
