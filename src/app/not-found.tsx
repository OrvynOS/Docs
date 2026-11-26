import Link from "next/link";

export default function NotFound() {
  return (
    <div className="home">
      <section className="home-hero">
        <h1>Page not found</h1>
        <p>That page doesn&apos;t exist. Try search (Ctrl K) or start from the docs home.</p>
        <div className="home-actions">
          <Link href="/" className="btn btn-primary">
            Docs home
          </Link>
        </div>
      </section>
    </div>
  );
}
