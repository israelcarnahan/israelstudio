export function Footer() {
  return (
    <footer className="site">
      <div className="container py-10 text-sm text-neutral-600 grid gap-6 sm:grid-cols-2">
        <div>
          <div className="font-display text-lg text-neutral-900">
            Israel&apos;s Studio
          </div>
          <p className="mt-2 max-w-prose">
            Funky paintings and hand tufted rugs. Commissions welcome.
          </p>
        </div>
        <div className="sm:justify-self-end">
          <div className="chip">
            © {new Date().getFullYear()} Israel&apos;s Studio
          </div>
        </div>
      </div>
    </footer>
  );
}
