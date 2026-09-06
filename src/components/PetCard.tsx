import Image from "next/image";
import Link from "next/link";
import type { Pet } from "@/lib/types";
import { formatAge, formatSize, formatSpecies } from "@/lib/format";

export default function PetCard({ pet }: { pet: Pet }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/pets/${pet.id}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={pet.imageUrl}
          alt={`${pet.name}, a ${pet.breed}`}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-cream-50/95 px-2.5 py-1 text-xs font-semibold text-ink-800">
          {formatSpecies(pet.species)}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl font-semibold text-ink-900">
            <Link href={`/pets/${pet.id}`} className="hover:text-clay-600">
              {pet.name}
            </Link>
          </h3>
          <span className="rounded-full bg-sage-500/15 px-2 py-0.5 text-xs font-medium text-sage-700">
            {formatSize(pet.size)}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-700">
          {pet.breed} · {formatAge(pet.ageYears, pet.species)}
        </p>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-700/90">
          {pet.bio}
        </p>
        <p className="mt-3 text-xs text-ink-700/70">{pet.location}</p>
        <Link
          href={`/pets/${pet.id}`}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-clay-500/40 bg-cream-100 px-4 py-2 text-sm font-semibold text-clay-700 transition hover:bg-clay-600 hover:text-white"
        >
          Meet {pet.name}
        </Link>
      </div>
    </article>
  );
}
