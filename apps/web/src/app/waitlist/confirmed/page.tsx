"use client";

import Image from "next/image";
import Link from "next/link";

export default function WaitlistConfirmedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4 text-center text-white">
      <main className="flex w-full max-w-2xl flex-col items-center justify-center">
        <Image
          src="/logos/dark_flat.png" // Assuming the same logo is appropriate here
          alt="Koru Logo"
          width={150} // Slightly smaller logo for this page
          height={150}
          priority
          className="mb-8"
        />

        <h1 className="mb-6 text-4xl font-bold text-green-400 md:text-5xl">
          You&apos;re In!
        </h1>

        <p className="mb-8 text-lg text-gray-300 md:text-xl">
          Your email has been confirmed, and you&apos;re officially on the Koru
          waitlist. We&apos;re excited to have you and will keep you updated on
          our launch!
        </p>

        <Link
          href="/"
          className="rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-indigo-700"
        >
          Back to Homepage
        </Link>

        <footer className="mt-20 text-gray-500">
          <p>&copy; {new Date().getFullYear()} Koru. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
