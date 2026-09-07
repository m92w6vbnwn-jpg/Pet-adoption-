"use client";

import { useMemo, useState } from "react";
import type { Breed, Species } from "@/lib/types";
import BreedCard from "@/components/BreedCard";

const speciesTabs: { value: Species | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "dog", label: "Dogs" },
];

export default function BreedsClient({ breeds }: { breeds: Breed[] }) {
  const [query, setQuery] = useState("");
  const [species, setSpecies] = useState<Species | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return breeds.filter((b) => {
      if (species !== "all" && b.species !== species) return false;
      if (!q) return true;
      const hay =
        `${b.name} ${b.temperament.join(" ")} ${b.goodWith.join(" ")} ${b.origin ?? ""} ${b.description}`.toLowerCase();
      return hay.includes(q);
    });
  }, [breeds, query, species]);

  const counts = useMemo(() => {
    const base: Record<string, number> = { all: breeds.length };
    for (const b of breeds) {
      base[b.species] = (base[b.species] ?? 0) + 1;
    }
    return base;
  }, [breeds]);

  return (
    <div>
      <div className="rounded-2xl border border-cream-300 bg-white p-4 shadow-sm sm:p-5">
        <label htmlFor="breed-search" className="sr-only">
          Search breeds
        </label>
        <input
          id="breed-search"
          type="search"
          placeholder="Search by name, temperament, origin..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 text-ink-900 outline-none ring-clay-500/40 placeholder:text-ink-700/50 focus:ring-2"
        />

        <div
          className="mt-4 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Species"
        >
          {speciesTabs.map((tab) => {
            const active = species === tab.value;
            const count = counts[tab.value] ?? 0;
            if (tab.value !== "all" && count === 0) return null;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSpecies(tab.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-clay-600 text-white shadow-sm"
                    : "bg-cream-100 text-ink-800 hover:bg-cream-200"
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 ${active ? "text-white/80" : "text-ink-700/60"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-700" aria-live="polite">
        Showing {filtered.length} breed{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-cream-300 bg-cream-100 px-6 py-12 text-center">
          <p className="font-display text-xl text-ink-900">No breeds match</p>
          <p className="mt-2 text-sm text-ink-700">
            Try another search or species tab.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSpecies("all");
            }}
            className="mt-4 rounded-full bg-clay-600 px-4 py-2 text-sm font-semibold text-white hover:bg-clay-700"
          >
            Reset
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((breed) => (
            <BreedCard key={breed.slug} breed={breed} />
          ))}
        </div>
      )}
    </div>
  );
}
