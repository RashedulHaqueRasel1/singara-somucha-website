"use client";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative w-full text-white py-12 overflow-hidden">
      {/* Bottom Copyright */}
      <div className="relative mt-12 border-t container mx-auto border-gray-600 pt-6 text-center text-gray-300 text-sm">
        © {new Date().getFullYear()}{" "}
        <Link href="https://rashedul-haque-rasel.vercel.app/">
          Rashedul Haque
        </Link>
        . All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
