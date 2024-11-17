import React from "react";
import Link from "next/link";

const Nav = () => {
  return (
    <div className="w-full z-40 fixed bottom-0 bg-gray-900">
      <div className="w-full h-20 flex items-center justify-center space-x-6 text-2xl">
        <Link href="/" className="text-white hover:text-gray-300 transition">
          Scan
        </Link>
        <span className="text-white">|</span>
        <Link
          href="/track"
          className="text-white hover:text-gray-300 transition"
        >
          Track
        </Link>
        <span className="text-white">|</span>
        <Link
          href="/plan"
          className="text-white hover:text-gray-300 transition"
        >
          Plan
        </Link>
        <span className="text-white">|</span>
        <Link
          href="/forum"
          className="text-white hover:text-gray-300 transition"
        >
          Forum
        </Link>
      </div>
    </div>
  );
};

export default Nav;
