import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-8 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <p>© {new Date().getFullYear()} Slesh by Interphase Labs, Inc.</p>

        <div className="flex gap-4 flex-wrap justify-center">
          {/* External links */}
          <a href="https://x.com/getslesh" target="_blank" className="hover:underline">
            X
          </a>
          <a href="https://discord.gg/7JG597AfWd" target="_blank" className="hover:underline">
            Discord
          </a>
          <a href="https://docs.slesh.ai/" target="_blank" className="hover:underline">
            Docs
          </a>

          {/* Internal links using Next.js Link */}
          <Link href="/slsh" className="hover:underline">
            SLSH
          </Link>
          <Link href="/careers" className="hover:underline">
            Careers
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms & Conditions
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>

        <button className="btn flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-700 transition">
  <Image
    src="/assets/chrome-icon.svg"
    alt="Chrome Icon"
    width={20} // Tailwind w-5 = 20px
    height={20} // Tailwind h-5 = 20px
  />
  Add to Chrome
</button>
      </div>
    </footer>
  );
}
