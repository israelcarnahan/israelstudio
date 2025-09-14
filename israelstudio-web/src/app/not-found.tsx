import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container py-16 text-center">
      <h1 className="font-display text-4xl">Lost in the studio.</h1>
      <p className="mt-3 text-neutral-600">We couldn&apos;t find that page.</p>
      <div className="mt-6">
        <Link className="btn btn-primary" href="/">Back to Home</Link>
      </div>
    </section>
  );
}
