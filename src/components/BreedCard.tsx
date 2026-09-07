import Link from "next/link";
import type { Breed } from "@/lib/types";
import { formatEnergy, formatSpecies } from "@/lib/format";

export default function BreedCard({ breed }: { breed: Breed }) {
  return (
    <article className="flex flex-col rounded-2xl border border-cream-300 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-clay-600">
          {formatSpecies(breed.species)}
        </p>
        <span className="rounded-full bg-sage-500/15 px-2 py-0.5 text-xs font-medium text-sage-700">
          {formatEnergy(breed.energy)} energy
        </span>
      </div>
      <h3 className="mt-2 font-display text-xl font-semibold text-ink-900">
        <Link href={`/breeds/${breed.slug}`} className="hover:text-clay-600">
          {breed.name}
        </Link>
      </h3>
      <p className="mt-1 text-xs text-ink-700/70">
        {breed.sizeGroup} · {breed.coat} coat
        {breed.origin ? ` · ${breed.origin}` : ""}
      </p>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-700">
        {breed.description}
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {breed.temperament.slice(0, 3).map((t) => (
          <li
            key={t}
            className="rounded-full bg-cream-100 px-2 py-0.5 text-xs font-medium text-ink-800"
          >
            {t}
          </li>
        ))}
      </ul>
      <Link
        href={`/breeds/${breed.slug}`}
        className="mt-4 inline-flex items-center justify-center rounded-full border border-clay-500/40 bg-cream-100 px-4 py-2 text-sm font-semibold text-clay-700 transition hover:bg-clay-600 hover:text-white"
      >
        View breed
      </Link>
    </article>
  );
}
