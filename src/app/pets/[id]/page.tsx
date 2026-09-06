import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdoptionForm from "@/components/AdoptionForm";
import { getPetById, pets } from "@/data/pets";
import { formatAge, formatAgeGroup, formatSize, formatSpecies } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return pets.map((pet) => ({ id: pet.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const pet = getPetById(id);
  if (!pet) return { title: "Pet not found" };
  return {
    title: `${pet.name} — ${pet.breed}`,
    description: pet.bio,
  };
}

export default async function PetDetailPage({ params }: Props) {
  const { id } = await params;
  const pet = getPetById(id);
  if (!pet) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-ink-700">
        <Link href="/browse" className="hover:text-clay-600">
          ← Back to browse
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-cream-300 shadow-md">
          <Image
            src={pet.imageUrl}
            alt={`${pet.name}, a ${pet.breed}`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-clay-600">
            {formatSpecies(pet.species)} · {pet.gender}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink-900 sm:text-5xl">
            {pet.name}
          </h1>
          <p className="mt-2 text-lg text-ink-700">
            {pet.breed} · {formatAge(pet.ageYears)} ·{" "}
            {formatSize(pet.size)}
          </p>
          <p className="mt-1 text-sm text-ink-700/80">{pet.location}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-cream-100 px-3 py-3">
              <dt className="text-xs uppercase tracking-wide text-ink-700/70">
                Age group
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink-900">
                {formatAgeGroup(pet.ageGroup)}
              </dd>
            </div>
            <div className="rounded-xl bg-cream-100 px-3 py-3">
              <dt className="text-xs uppercase tracking-wide text-ink-700/70">
                Size
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink-900">
                {formatSize(pet.size)}
              </dd>
            </div>
            <div className="rounded-xl bg-cream-100 px-3 py-3">
              <dt className="text-xs uppercase tracking-wide text-ink-700/70">
                Species
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink-900">
                {formatSpecies(pet.species)}
              </dd>
            </div>
          </dl>

          <h2 className="mt-8 font-display text-2xl font-semibold text-ink-900">
            About {pet.name}
          </h2>
          <p className="mt-3 leading-relaxed text-ink-700">{pet.bio}</p>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink-700">
            Traits
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {pet.traits.map((trait) => (
              <li
                key={trait}
                className="rounded-full bg-sage-500/15 px-3 py-1 text-sm font-medium text-sage-700"
              >
                {trait}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 max-w-2xl" id="apply">
        <AdoptionForm petName={pet.name} />
      </div>
    </div>
  );
}
