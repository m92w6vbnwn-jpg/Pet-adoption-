export type Species = "dog" | "cat" | "rabbit" | "bird";
export type Size = "small" | "medium" | "large";
export type AgeGroup = "puppy" | "young" | "adult" | "senior";

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
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
