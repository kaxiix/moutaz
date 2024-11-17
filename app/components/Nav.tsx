"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Nav = () => {
  const router = useRouter();

  const isActive = (pathname: string) => router.pathname === pathname;

  return (
    <div className="w-full z-40 fixed bottom-0 bg-gray-900">
      <div className="w-full h-20 flex items-center justify-center space-x-6 text-2xl">
        <Link href="/" passHref>
          <a
            className={`${
              isActive("/") ? "text-blue-400" : "text-white"
            } hover:text-gray-300 transition`}
          >
            Scan
          </a>
        </Link>
        <span className="text-white">|</span>
        <Link href="/track" passHref>
          <a
            className={`${
              isActive("/track") ? "text-blue-400" : "text-white"
            } hover:text-gray-300 transition`}
          >
            Track
          </a>
        </Link>
        <span className="text-white">|</span>
        <Link href="/plan" passHref>
          <a
            className={`${
              isActive("/plan") ? "text-blue-400" : "text-white"
            } hover:text-gray-300 transition`}
          >
            Plan
          </a>
        </Link>
        <span className="text-white">|</span>
        <Link href="/forum" passHref>
          <a
            className={`${
              isActive("/forum") ? "text-blue-400" : "text-white"
            } hover:text-gray-300 transition`}
          >
            Forum
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Nav;
