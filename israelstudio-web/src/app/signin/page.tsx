"use client";
import { ENABLE_AUTH } from "@/lib/authFlag";
import { notFound } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  // Kill the sign-in page when auth is disabled
  if (!ENABLE_AUTH) {
    notFound();
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        window.location.href = "/admin";
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container py-16 max-w-md">
      <h1 className="font-display text-3xl">Admin Sign In</h1>
      <p className="mt-2 text-neutral-600 text-sm">
        Enter your email and password to access the admin panel.
      </p>
      <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
        <input
          className="rounded-xl border border-neutral-300 px-4 py-3"
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="rounded-xl border border-neutral-300 px-4 py-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
        <button 
          className="btn btn-primary" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </section>
  );
}