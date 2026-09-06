"use client";

import { useMemo, useState } from "react";
import type { AgeGroup, Pet, Size, Species } from "@/lib/types";
import PetCard from "@/components/PetCard";

const speciesOptions: { value: Species | "all"; label: string }[] = [
  { value: "all", label: "All species" },
  { value: "dog", label: "Dogs" },
  { value: "cat", label: "Cats" },
  { value: "rabbit", label: "Rabbits" },
  { value: "bird", label: "Birds" },
];

const sizeOptions: { value: Size | "all"; label: string }[] = [
  { value: "all", label: "All sizes" },
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const ageOptions: { value: AgeGroup | "all"; label: string }[] = [
  { value: "all", label: "All ages" },
  { value: "puppy", label: "Puppy / Kitten" },
  { value: "young", label: "Young" },
  { value: "adult", label: "Adult" },
  { value: "senior", label: "Senior" },
];

export default function BrowseClient({ pets }: { pets: Pet[] }) {
  const [query, setQuery] = useState("");
  const [species, setSpecies] = useState<Species | "all">("all");
  const [size, setSize] = useState<Size | "all">("all");
  const [age, setAge] = useState<AgeGroup | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pets.filter((pet) => {
      if (species !== "all" && pet.species !== species) return false;
      if (size !== "all" && pet.size !== size) return false;
      if (age !== "all" && pet.ageGroup !== age) return false;
      if (!q) return true;
      const hay = `${pet.name} ${pet.breed} ${pet.bio} ${pet.location} ${pet.traits.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [pets, query, species, size, age]);

  return (
    <div>
      <div className="rounded-2xl border border-cream-300 bg-white p-4 shadow-sm sm:p-5">
        <label htmlFor="pet-search" className="sr-only">
          Search pets
        </label>
        <input
          id="pet-search"
          type="search"
          placeholder="Search by name, breed, trait..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 text-ink-900 outline-none ring-clay-500/40 placeholder:text-ink-700/50 focus:ring-2"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="filter-species" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-700">
              Species
            </label>
            <select
              id="filter-species"
              value={species}
              onChange={(e) => setSpecies(e.target.value as Species | "all")}
              className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm text-ink-900 outline-none focus:ring-2 focus:ring-clay-500/40"
            >
              {speciesOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filter-age" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-700">
              Age
            </label>
            <select
              id="filter-age"
              value={age}
              onChange={(e) => setAge(e.target.value as AgeGroup | "all")}
              className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm text-ink-900 outline-none focus:ring-2 focus:ring-clay-500/40"
            >
              {ageOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filter-size" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-700">
              Size
            </label>
            <select
              id="filter-size"
              value={size}
              onChange={(e) => setSize(e.target.value as Size | "all")}
              className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm text-ink-900 outline-none focus:ring-2 focus:ring-clay-500/40"
            >
              {sizeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-700" aria-live="polite">
        Showing {filtered.length} of {pets.length} pets
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-cream-300 bg-cream-100 px-6 py-12 text-center">
          <p className="font-display text-xl text-ink-900">No pets match those filters</p>
          <p className="mt-2 text-sm text-ink-700">
            Try clearing search or choosing different filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSpecies("all");
              setSize("all");
              setAge("all");
            }}
            className="mt-4 rounded-full bg-clay-600 px-4 py-2 text-sm font-semibold text-white hover:bg-clay-700"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
}
