"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  return (
    <section className="container py-16 max-w-md">
      <h1 className="font-display text-3xl">Admin Sign In</h1>
      <p className="mt-2 text-neutral-600 text-sm">
        Enter your email to receive a magic link (shown in the server console during development).
      </p>
      <form
        className="mt-6 grid gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await signIn("email", { email, redirect: true, callbackUrl: "/admin" });
        }}
      >
        <input
          className="rounded-xl border border-neutral-300 px-4 py-3"
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn-primary" type="submit">Send magic link</button>
      </form>
    </section>
  );
}
