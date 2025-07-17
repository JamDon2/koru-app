"use client";

import Image from "next/image";
import { useState } from "react";
import { joinWaitlist } from "api-client";
import { z } from "zod";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!z.string().email().safeParse(email).success) {
        setError("Invalid email address");
        setLoading(false);
        return;
      }

      await joinWaitlist({
        query: { email },
        headers: { "hcaptcha-token": "mock-token" },
      });

      setSuccess(true);
      setEmail("");
    } catch (err: unknown) {
      console.error("API Call failed", err);

      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-gradient-to-b from-gray-900 to-black p-4 text-white">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center text-center">
        <Image
          src="/logos/dark_flat.png"
          alt="Koru Logo"
          width={200}
          height={200}
          priority
          className="mb-2"
        />

        <h1 className="mb-3 text-6xl font-extrabold md:text-8xl">Koru</h1>

        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
          <span className="">
            <span className="">Your Finances</span>,{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(129,140,248,0.4)]">
              Reimagined.
            </span>
          </span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-gray-300 md:text-xl">
          Manage your money across multiple currencies with Koru. Experience
          seamless, automatic transaction imports from all your banks and get
          true clarity on your financial world. Stop juggling, start thriving.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-grow rounded-md border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500"
            aria-label="Email for waitlist"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex cursor-pointer items-center justify-center rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Join Waitlist"
            )}
          </button>
        </form>

        <span className="mt-2 text-sm text-gray-500">
          Your privacy matters. No spam, just important updates and early
          access.
        </span>

        {success && (
          <p className="mt-4 text-green-400">
            Please check your email for a confirmation link. Thanks for joining!
            We&apos;ll be in touch soon.
          </p>
        )}
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </main>
    </div>
  );
}

// Helper type removed as Options is now imported
