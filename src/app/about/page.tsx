import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Puppies for Adoption",
  description: "Learn about Puppies for Adoption — a warm home for pet adoption.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-clay-600">
        Our story
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink-900">
        About Puppies for Adoption
      </h1>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-700">
        <p>
          Puppies for Adoption was created with a simple belief: every pet deserves a soft place
          to land, and every person deserves a clear, kind path to adoption.
        </p>
        <p>
          We bring adoptable dogs and puppies into one calm, beautiful space —
          so you can browse thoughtfully, learn about each animal, and apply
          when you feel ready.
        </p>
        <p>
          This v1 site is a front-end experience with realistic sample pets. In
          a future version, Puppies for Adoption will connect shelters, fosters, and families with
          live listings and guided support.
        </p>
        <p>
          Until then, explore, fall a little in love, and imagine the home you
          might share.
        </p>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/browse"
          className="rounded-full bg-clay-600 px-5 py-3 text-sm font-semibold text-white hover:bg-clay-700"
        >
          Browse pets
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-ink-700/20 bg-white px-5 py-3 text-sm font-semibold text-ink-800 hover:bg-cream-100"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
