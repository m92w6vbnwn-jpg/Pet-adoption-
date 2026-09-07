import type { Metadata } from "next";
import BreedsClient from "@/components/BreedsClient";
import { breedCounts, breeds } from "@/data/breeds";

export const metadata: Metadata = {
  title: "Breed encyclopedia",
  description:
    "Explore dog, cat, rabbit, and bird breeds — temperament, energy, coat, and care notes from Puppies for Adoption.",
};

export default function BreedsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-clay-600">
          Learn before you adopt
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink-900">
          Breed encyclopedia
        </h1>
        <p className="mt-3 text-lg text-ink-700">
          Browse {breedCounts.total}+ breeds with short, practical notes on
          temperament, energy, and everyday care — so you can find a companion
          that fits your life.
        </p>
        <dl className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="rounded-full bg-cream-100 px-3 py-1.5">
            <dt className="sr-only">Dogs</dt>
            <dd>
              <span className="font-semibold text-ink-900">{breedCounts.dog}</span>{" "}
              <span className="text-ink-700">dogs</span>
            </dd>
          </div>
          <div className="rounded-full bg-cream-100 px-3 py-1.5">
            <dt className="sr-only">Cats</dt>
            <dd>
              <span className="font-semibold text-ink-900">{breedCounts.cat}</span>{" "}
              <span className="text-ink-700">cats</span>
            </dd>
          </div>
          <div className="rounded-full bg-cream-100 px-3 py-1.5">
            <dt className="sr-only">Small pets</dt>
            <dd>
              <span className="font-semibold text-ink-900">
                {breedCounts.rabbit + breedCounts.bird}
              </span>{" "}
              <span className="text-ink-700">small pets</span>
            </dd>
          </div>
        </dl>
      </div>
      <div className="mt-8">
        <BreedsClient breeds={breeds} />
      </div>
    </div>
  );
}
