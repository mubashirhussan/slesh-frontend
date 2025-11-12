"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  useEffect(() => {
    gsap.from(".hero-text", {
      y: 40,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".hero-text",
        start: "top 80%",
      },
    });
  }, []);

  return (
    <section className="relative py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
		  <div className="hero-container">
        <div className="messages-img w-full md:w-1/2 h-64 bg-gray-200 rounded-lg"></div>

        <div className="hero-content w-full md:w-1/2 flex flex-col gap-6">
          <div className="hero-text text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold">Browse. Ask. Done.</h1>
          </div>
          <div className="flex gap-4 justify-center md:justify-start">
            <button className="btn bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
              Explore <span className="font-serif">Slesh</span>
            </button>
         
              <button className="btn flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-700 transition">
			   <Image
				 src="/chrome-icon.svg"
				 alt="Chrome Icon"
				 width={20} // Tailwind w-5 = 20px
				 height={20} // Tailwind h-5 = 20px
			   />
			   Add to Chrome
			 </button>
           
          </div>
        </div>
      </div>
	  </div>
    </section>
  );
}
