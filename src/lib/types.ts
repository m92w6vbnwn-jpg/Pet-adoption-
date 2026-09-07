export type Species = "dog" | "cat" | "rabbit" | "bird";
export type Size = "small" | "medium" | "large";
export type AgeGroup = "puppy" | "young" | "adult" | "senior";

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  /** Optional link into the breed encyclopedia */
  breedSlug?: string;
  ageYears: number;
  ageGroup: AgeGroup;
  size: Size;
  gender: "male" | "female";
  location: string;
  bio: string;
  traits: string[];
  imageUrl: string;
  featured?: boolean;
}

export type BreedEnergy = "low" | "moderate" | "high";
export type BreedSizeGroup =
  | "toy"
  | "small"
  | "medium"
  | "large"
  | "giant";

export interface Breed {
  slug: string;
  name: string;
  species: Species;
  sizeGroup: BreedSizeGroup | string;
  coat: string;
  temperament: string[];
  energy: BreedEnergy;
  goodWith: string[];
  description: string;
  origin?: string;
  careNotes?: string;
}
