import type { AgeGroup, Size, Species } from "@/lib/types";

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

export function formatAge(years: number, _species: Species): string {
  if (years < 1) {
    const months = Math.max(1, Math.round(years * 12));
    return `${months} mo`;
  }
  if (years === 1) return "1 year";
  return `${years} years`;
}
