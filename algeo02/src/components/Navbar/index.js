import { Orbitron } from "next/font/google";
import Link from "next/link";
import React from "react";

const orbitron = Orbitron({
  weight: ["400", "500", "800"],
  subsets: ["latin"],
});

function Navbar() {
  return (
    <div className={`fixed z-50 w-full backdrop-blur-sm ${orbitron.className}`}>
      <div className="flex flex-wrap justify-between items-center py-4 px-24 shadow-xl bg-transparent">
        <h1 className="text-5xl text-white font-semibold">
          <span className="text-secondary">Bukan</span>Lens
        </h1>
        <div className="flex gap-16 text-xl font-bold">
          <Link
            href="/"
            className="hover:text-secondary hover:scale-105 hover:opacity-90"
          >
            Home
          </Link>
          <Link
            href="/search"
            className="hover:text-secondary hover:scale-105 hover:opacity-90"
          >
            Search
          </Link>
          <Link
            href="/aboutus"
            className="hover:text-secondary hover:scale-105 hover:opacity-90"
          >
            About
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
