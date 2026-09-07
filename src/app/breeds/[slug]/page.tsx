import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PetCard from "@/components/PetCard";
import { breeds, getBreedBySlug } from "@/data/breeds";
import { pets } from "@/data/pets";
import {
  formatCoat,
  formatEnergy,
  formatGoodWith,
  formatSpecies,
} from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return breeds.map((breed) => ({ slug: breed.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const breed = getBreedBySlug(slug);
  if (!breed) return { title: "Breed not found" };
  return {
    title: `${breed.name} — breed guide`,
    description: breed.description,
  };
}

export default async function BreedDetailPage({ params }: Props) {
  const { slug } = await params;
  const breed = getBreedBySlug(slug);
  if (!breed) notFound();

  const matchingPets = pets.filter(
    (p) =>
      p.breedSlug === breed.slug ||
      p.breed.toLowerCase() === breed.name.toLowerCase() ||
      p.breed.toLowerCase().includes(breed.name.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-ink-700">
        <Link href="/breeds" className="hover:text-clay-600">
          ← All breeds
        </Link>
      </nav>

      <header className="mt-6 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-clay-600">
          {formatSpecies(breed.species)} breed
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink-900 sm:text-5xl">
          {breed.name}
        </h1>
        {breed.origin && (
          <p className="mt-2 text-ink-700">Origin: {breed.origin}</p>
        )}
        <p className="mt-4 text-lg leading-relaxed text-ink-700">
          {breed.description}
        </p>
      </header>

      <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-cream-300 bg-cream-100/80 px-4 py-4">
          <dt className="text-xs uppercase tracking-wide text-ink-700/70">
            Size group
          </dt>
          <dd className="mt-1 font-semibold capitalize text-ink-900">
            {breed.sizeGroup}
          </dd>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-cream-100/80 px-4 py-4">
          <dt className="text-xs uppercase tracking-wide text-ink-700/70">
            Coat
          </dt>
          <dd className="mt-1 font-semibold text-ink-900">
            {formatCoat(breed.coat)}
          </dd>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-cream-100/80 px-4 py-4">
          <dt className="text-xs uppercase tracking-wide text-ink-700/70">
            Energy
          </dt>
          <dd className="mt-1 font-semibold text-ink-900">
            {formatEnergy(breed.energy)}
          </dd>
        </div>
        <div className="rounded-2xl border border-cream-300 bg-cream-100/80 px-4 py-4">
          <dt className="text-xs uppercase tracking-wide text-ink-700/70">
            Species
          </dt>
          <dd className="mt-1 font-semibold text-ink-900">
            {formatSpecies(breed.species)}
          </dd>
        </div>
      </dl>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink-900">
            Temperament
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {breed.temperament.map((t) => (
              <li
                key={t}
                className="rounded-full bg-sage-500/15 px-3 py-1 text-sm font-medium text-sage-700"
              >
                {t}
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-ink-700">
            Often a good fit with
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {breed.goodWith.map((g) => (
              <li
                key={g}
                className="rounded-full bg-cream-100 px-3 py-1 text-sm font-medium text-ink-800"
              >
                {formatGoodWith(g)}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-cream-300 bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl font-semibold text-ink-900">
            Care notes
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">
            {breed.careNotes ??
              "Provide fresh water, species-appropriate food, routine vet care, and daily enrichment tailored to energy level."}
          </p>
          <p className="mt-4 text-sm text-ink-700/80">
            Every individual is unique — use this guide as a starting point, then
            meet pets in person when you can.
          </p>
        </section>
      </div>

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-900">
              Adoptable {breed.name}s on Øf
            </h2>
            <p className="mt-1 text-sm text-ink-700">
              {matchingPets.length > 0
                ? `${matchingPets.length} sample pet${matchingPets.length === 1 ? "" : "s"} currently listed.`
                : "No sample pets of this breed right now — browse all pets or check back soon."}
            </p>
          </div>
          <Link
            href={`/browse?breed=${encodeURIComponent(breed.name)}`}
            className="text-sm font-semibold text-clay-600 hover:text-clay-700"
          >
            Browse with breed filter →
          </Link>
        </div>

        {matchingPets.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {matchingPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-cream-300 bg-cream-100 px-6 py-10 text-center">
            <Link
              href="/browse"
              className="rounded-full bg-clay-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-clay-700"
            >
              Browse all pets
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
