export default function CommissionsPage() {
  return (
    <section className="container py-12">
      <h1 className="font-display text-3xl sm:text-4xl">Request a Commission</h1>
      <p className="mt-3 text-neutral-600 max-w-prose">
        Tell me your idea—size, subject, palette, deadline, and any references. I&apos;ll reply with timing and options.
      </p>

      <form className="mt-8 grid gap-4 max-w-xl">
        <input className="w-full rounded-xl border border-neutral-300 px-4 py-3" placeholder="Your name" />
        <input className="w-full rounded-xl border border-neutral-300 px-4 py-3" placeholder="Email" type="email" />
        <textarea className="w-full rounded-2xl border border-neutral-300 px-4 py-3 min-h-[140px]" placeholder="Describe your vision…" />
        <button className="btn btn-primary w-fit" type="button">Submit (placeholder)</button>
      </form>
    </section>
  );
}
