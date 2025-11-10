"use client";
import { useEffect, useState } from "react";

export default function TableOfContents({ headings }: { headings: { id: string; text: string }[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

 useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveId(entry.target.id);
      });
    },
    { rootMargin: "0px 0px -40% 0px", threshold: 0.1 }
  );

  headings.forEach((h) => {
    const el = document.getElementById(h.id);
    if (el) observer.observe(el);
  });

  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const docHeight = document.body.scrollHeight;

    if (scrollPosition >= docHeight - 10) {
      setActiveId(headings[headings.length - 1].id);
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    observer.disconnect();
    window.removeEventListener("scroll", handleScroll);
  };
}, [headings]);


  return (
    <nav className="sticky top-24 h-fit text-sm space-y-2">
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`block transition-colors ${
            activeId === h.id
              ? "text-black dark:text-white-400 font-semibold"
              : "text-gray-500 dark:text-gray-400"
          } hover:text-black dark:hover:text-white`}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
