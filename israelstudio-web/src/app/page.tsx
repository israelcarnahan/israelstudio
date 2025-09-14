export default function Home() {
  return (
    <section className="container py-16">
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight">
            Art with sparkle ✨<br className="hidden sm:block" />
            designed to make you feel.
          </h1>
          <p className="mt-5 text-lg text-neutral-600 max-w-prose">
            Vibrant portraits and tactile tufted pieces. Built for joy, texture, and a little mischief.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn btn-primary" href="/shop">Shop Paintings</a>
            <a className="btn btn-ghost" href="/commissions">Request a Commission</a>
          </div>
        </div>
        <div className="aspect-square rounded-2xl bg-neutral-100 shadow-soft" />
      </div>
    </section>
  );
}