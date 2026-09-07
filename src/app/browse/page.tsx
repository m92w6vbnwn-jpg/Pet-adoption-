import type { Metadata } from "next";
import Link from "next/link";
import BrowseClient from "@/components/BrowseClient";
import { pets } from "@/data/pets";

export const metadata: Metadata = {
  title: "Browse pets",
  description: "Search and filter adoptable dogs, cats, rabbits, and birds on Øf.",
};

export default function BrowsePage() {
  const breedOptions = Array.from(new Set(pets.map((p) => p.breed))).sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-ink-900">
          Browse pets
        </h1>
        <p className="mt-3 text-lg text-ink-700">
          Search by name or breed, then filter by species, age, and size to find
          your match.{" "}
          <Link href="/breeds" className="font-semibold text-clay-600 hover:text-clay-700">
            Explore the breed encyclopedia
          </Link>{" "}
          for temperament and care notes.
        </p>
      </div>
      <div className="mt-8">
        <BrowseClient pets={pets} breedOptions={breedOptions} />
      </div>
    </div>
  );
}
