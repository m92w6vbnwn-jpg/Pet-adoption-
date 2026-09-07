import Image from "next/image";
import Link from "next/link";
import PetCard from "@/components/PetCard";
import { breedCounts } from "@/data/breeds";
import { getFeaturedPets } from "@/data/pets";

export default function HomePage() {
  const featured = getFeaturedPets();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cream-100 via-cream-50 to-sage-400/20" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-clay-600">
              Pet adoption, made warm
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl lg:text-6xl">
              Find your next best friend at{" "}
              <span className="text-clay-600">Puppies for Adoption</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-700">
              Browse lovable dogs and puppies ready for a forever home. We match
              people and pets with care — one gentle step at a time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/browse"
                className="rounded-full bg-clay-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-clay-700"
              >
                Browse pets
              </Link>
              <Link
                href="/how-it-works"
                className="rounded-full border border-ink-700/20 bg-white/70 px-6 py-3 text-sm font-semibold text-ink-800 transition hover:bg-white"
              >
                How adoption works
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-700/70">
                  Pets
                </dt>
                <dd className="font-display text-2xl font-semibold text-ink-900">
                  5+
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-700/70">
                  Breeds
                </dt>
                <dd className="font-display text-2xl font-semibold text-ink-900">
                  {breedCounts.dog}+
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-700/70">
                  Homes
                </dt>
                <dd className="font-display text-2xl font-semibold text-ink-900">
                  ∞
                </dd>
              </div>
            </dl>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-cream-300 shadow-xl lg:max-w-none">
            <Image
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=900&h=1100&fit=crop"
              alt="Happy dog ready for adoption"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 40vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/70 to-transparent p-6">
              <p className="font-display text-xl text-white">
                Every pet deserves a soft place to land.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-cream-300 bg-gradient-to-br from-sage-500/15 via-cream-50 to-clay-400/10 p-6 sm:p-8 md:flex md:items-center md:justify-between md:gap-8">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-sage-700">
              New here
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
              Breed encyclopedia
            </h2>
            <p className="mt-3 text-ink-700 leading-relaxed">
              Explore {breedCounts.dog}+ dog breeds with temperament tags,
              energy levels, and practical care notes — so you can find a
              companion that fits your life.
            </p>
          </div>
          <Link
            href="/breeds"
            className="mt-6 inline-flex shrink-0 rounded-full bg-clay-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-clay-700 md:mt-0"
          >
            Browse breeds
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold text-ink-900">
              Featured pets
            </h2>
            <p className="mt-2 text-ink-700">
              Meet a few of the friends currently looking for a home.
            </p>
          </div>
          <Link
            href="/browse"
            className="text-sm font-semibold text-clay-600 hover:text-clay-700"
          >
            See all pets →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </section>

      <section className="border-y border-cream-300 bg-sage-500/10">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3">
          {[
            {
              title: "Browse with care",
              body: "Filter by age and size to find a dog that fits your life.",
            },
            {
              title: "Apply simply",
              body: "Share a bit about your home. We review every application thoughtfully.",
            },
            {
              title: "Welcome home",
              body: "When it is a match, we help you prepare for a smooth, happy transition.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-cream-300/80 bg-cream-50/80 p-6"
            >
              <h3 className="font-display text-xl font-semibold text-ink-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          Ready to meet your match?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-700">
          Start browsing adoptable pets near you — or learn how Puppies for Adoption
          guides every adoption from first hello to forever home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/browse"
            className="rounded-full bg-clay-600 px-6 py-3 text-sm font-semibold text-white hover:bg-clay-700"
          >
            Browse all pets
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-ink-700/20 bg-white px-6 py-3 text-sm font-semibold text-ink-800 hover:bg-cream-100"
          >
            About us
          </Link>
        </div>
      </section>
    </>
  );
}
