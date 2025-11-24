// "use client";

// import { useEffect } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
// import Image from "next/image";

// gsap.registerPlugin(ScrollTrigger);

// export default function HeroSection() {
//   useEffect(() => {
//     gsap.from(".hero-text", {
//       y: 40,
//       opacity: 0,
//       duration: 1.5,
//       ease: "power3.out",
//       scrollTrigger: {
//         trigger: ".hero-text",
//         start: "top 80%",
//       },
//     });
//   }, []);

//   return (
//     <section className="relative py-16 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
//         <div className="hero-container">
//           <div className="messages-img w-full md:w-1/2 h-64 bg-gray-200 rounded-lg">
//             <div className="hero-content w-full md:w-1/2 flex flex-col gap-6">
//               <div className="hero-text text-center md:text-left">
//                 <h1 className="text-4xl md:text-6xl font-bold">
//                   Browse. Ask. Done.
//                 </h1>
//               </div>
//               <div className="flex gap-4 justify-center md:justify-start">
//                 <button className="btn bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
//                   Explore <span className="font-serif">Slesh</span>
//                 </button>

//                 <button className="btn flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-700 transition">
//                   <Image
//                     src="/chrome-icon.svg"
//                     alt="Chrome Icon"
//                     width={20} // Tailwind w-5 = 20px
//                     height={20} // Tailwind h-5 = 20px
//                   />
//                   Add to Chrome
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

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
    <section className="relative md:px-[30px]  h-screen bg-gray-50 flex items-center justify-center">
      <div
        className="hero-container w-[90%] md:w-[85%] h-[90%]  overflow-hidden relative flex items-center justify-center"
        style={{
          backgroundImage: "url('/Hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/messages-1920.png')",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center gap-8 px-6">
       <h1
  className="font-spectral text-white font-medium italic text-[72px] leading-[88%] tracking-[0px] text-center translate-y-[-25%]"
>
  Browse. Ask. Done.
</h1>

          <div className="flex gap-6 justify-center flex-wrap">
            {/* Explore Button */}

            <Link href="/#features" scroll={true}>
             <button className="group relative cursor-pointer bg-white hover:text-white text-black px-8 py-3 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_15px_rgba(0,100,255,0.4)]">
  <span className="relative z-10 font-medium text-[18.12px] leading-[100%]">
    Explore{" "}
    <span className="font-semibold italic font-spectral text-[20.06px] leading-[100%]">
      Slesh
    </span>
  </span>
  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#0042d1] to-[#0064ff] group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
</button>

            </Link>

            {/* Add to Chrome Button */}
            <Link
              href="https://chromewebstore.google.com/detail/slesh-ask-search-automate/ikfopgggdcafagjeflhomdpolhdcfenp?utm_source=Homepage&utm_medium=homepage-cta&utm_campaign=web-conversion-funnel"
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
              className="relative   items-center  overflow-hidden rounded-2xl bg-black px-4 py-2 text-sm text-white transition-all duration-500 group md:flex"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#0042d1] to-[#0064ff] transition-transform duration-500 ease-out group-hover:translate-x-0"></span>
              <span className="relative z-10  text-lg font-semibold flex items-center gap-1">
                <Image
                  src="/chrome-icon.svg"
                  alt="Chrome"
                  width={22}
                  height={22}
                  className="object-contain mr-1"
                />
                 <span className="relative z-10 font-medium text-[18.12px] leading-[100%]">
                 Add to  {" "}
                 <span className="font-semibold  font-spectral text-[20.06px] leading-[100%]">
                 Chrome
                 </span> 
                 </span>
                {/* Add to  {" "}
                <span className="font-semibold italic text-[20.06px] leading-[100%] font-spectral ">
                Chrome
                </span> */}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
