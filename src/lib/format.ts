import type { AgeGroup, BreedEnergy, Size, Species } from "@/lib/types";

export function formatSpecies(species: Species): string {
  return species.charAt(0).toUpperCase() + species.slice(1);
}

export function formatSize(size: Size): string {
  return size.charAt(0).toUpperCase() + size.slice(1);
}

export function formatAgeGroup(ageGroup: AgeGroup): string {
  const labels: Record<AgeGroup, string> = {
    puppy: "Puppy / Kitten",
    young: "Young",
    adult: "Adult",
    senior: "Senior",
  };
  return labels[ageGroup];
}

export function formatAge(years: number): string {
  if (years < 1) {
    const months = Math.max(1, Math.round(years * 12));
    return `${months} mo`;
  }
  if (years === 1) return "1 year";
  return `${years} years`;
}

export function formatEnergy(energy: BreedEnergy): string {
  const labels: Record<BreedEnergy, string> = {
    low: "Low",
    moderate: "Moderate",
    high: "High",
  };
  return labels[energy];
}

export function formatCoat(coat: string): string {
  return coat
    .split(/[-\s]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatGoodWith(tag: string): string {
  const labels: Record<string, string> = {
    kids: "Kids",
    dogs: "Dogs",
    cats: "Cats",
    apartments: "Apartments",
    families: "Families",
    "active homes": "Active homes",
    "calm homes": "Calm homes",
    "experienced homes": "Experienced homes",
    "homes with space": "Homes with space",
  };
  return labels[tag] ?? tag.charAt(0).toUpperCase() + tag.slice(1);
}
