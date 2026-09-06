import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-ink-900">
        Page not found
      </h1>
      <p className="mt-3 text-ink-700">
        That page wandered off. Let us help you find a pet instead.
      </p>
      <Link
        href="/browse"
        className="mt-8 inline-flex rounded-full bg-clay-600 px-6 py-3 text-sm font-semibold text-white hover:bg-clay-700"
      >
        Browse pets
      </Link>
    </div>
  );
}
