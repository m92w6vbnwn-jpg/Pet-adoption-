import type { Metadata } from "next";
import Link from "next/link";
import AdoptionForm from "@/components/AdoptionForm";
import { pets } from "@/data/pets";

export const metadata: Metadata = {
  title: "Apply to adopt",
  description:
    "Submit an adoption application to Puppies for Adoption. Tell us about your home and find your forever friend.",
};

export default function ApplyPage() {
  const petOptions = pets.map((p) => ({ id: p.id, name: p.name }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-clay-600">
          Start your journey
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink-900">
          Apply to adopt
        </h1>
        <p className="mt-3 text-lg text-ink-700">
          Fill out this application and our team will review it carefully.
          Prefer a specific pet? Browse available friends first, or pick one
          below.
        </p>
        <p className="mt-3 text-sm text-ink-700">
          Looking for someone in particular?{" "}
          <Link href="/browse" className="font-medium text-clay-700 hover:text-clay-600">
            Browse pets
          </Link>{" "}
          or open a pet&apos;s profile and use Apply there.
        </p>
      </div>

      <div className="mt-10 max-w-2xl">
        <AdoptionForm showPetPicker pets={petOptions} />
      </div>
    </div>
  );
}
