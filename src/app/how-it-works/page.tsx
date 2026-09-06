import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How adoption works",
  description: "A simple guide to adopting a pet through Øf.",
};

const steps = [
  {
    n: "01",
    title: "Browse & filter",
    body: "Explore adoptable pets and narrow by species, age, and size until someone feels like a fit.",
  },
  {
    n: "02",
    title: "Meet on the page",
    body: "Read each pet bio, traits, and location. Picture your routines together before you apply.",
  },
  {
    n: "03",
    title: "Apply to adopt",
    body: "Fill out a short application about your home and why you are ready. We review with care.",
  },
  {
    n: "04",
    title: "Welcome home",
    body: "If it is a match, we help you prepare — supplies, first days, and settling in gently.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-ink-900">
        How adoption works
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-700">
        Adopting with Øf is meant to feel clear and kind — not overwhelming.
        Here is the journey from first browse to forever home.
      </p>

      <ol className="mt-12 space-y-6">
        {steps.map((step) => (
          <li
            key={step.n}
            className="flex gap-5 rounded-2xl border border-cream-300 bg-white p-6 shadow-sm"
          >
            <span className="font-display text-3xl font-semibold text-clay-500">
              {step.n}
            </span>
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink-900">
                {step.title}
              </h2>
              <p className="mt-2 text-ink-700">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 rounded-2xl bg-sage-500/15 px-6 py-8 text-center">
        <p className="font-display text-2xl font-semibold text-ink-900">
          Ready for step one?
        </p>
        <Link
          href="/browse"
          className="mt-4 inline-flex rounded-full bg-clay-600 px-6 py-3 text-sm font-semibold text-white hover:bg-clay-700"
        >
          Browse pets
        </Link>
      </div>
    </div>
  );
}
