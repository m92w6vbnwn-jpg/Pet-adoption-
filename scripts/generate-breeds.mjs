#!/usr/bin/env node
/**
 * Generates src/data/breeds.ts with a comprehensive static breed database.
 * Original short blurbs — not copied from Petfinder/Wikipedia.
 */
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function blurb(species, name, traits, size, energy, origin) {
  const energyPhrase =
    energy === "high"
      ? "thrives with daily activity and mental engagement"
      : energy === "low"
        ? "prefers a calmer pace and cozy downtime"
        : "balances play with relaxed companionship";
  const sizePhrase =
    size === "toy" || size === "small"
      ? "compact size"
      : size === "giant" || size === "large"
        ? "substantial presence"
        : "medium frame";
  const traitStr = traits.slice(0, 3).join(", ").toLowerCase();
  const originBit = origin ? ` With roots in ${origin},` : "";
  const care =
    species === "dog"
      ? `Families who can match that energy and offer consistent training find a loyal partner.`
      : species === "cat"
        ? `Indoor enrichment and gentle routines help this breed shine at home.`
        : `Thoughtful housing and a steady routine keep them content.`;
  return `${name} is known for being ${traitStr}, with a ${sizePhrase} that ${energyPhrase}.${originBit} ${care}`.replace(
    /\s+/g,
    " "
  ).trim();
}

function careNotes(species, coat, energy) {
  const coatNote =
    coat === "long" || coat === "double"
      ? "Expect regular brushing to keep the coat healthy."
      : coat === "hairless"
        ? "Protect skin from sun and chill; bathing needs differ from furred breeds."
        : coat === "wire"
          ? "Periodic hand-stripping or professional grooming maintains the coat."
          : "A simple weekly brush usually keeps the coat tidy.";
  const energyNote =
    energy === "high"
      ? " Plan for vigorous daily exercise and puzzle play."
      : energy === "low"
        ? " Short walks or gentle play sessions are often enough."
        : " Moderate daily activity plus enrichment works well.";
  if (species === "cat") {
    return `${coatNote} Vertical space, scratching posts, and interactive toys support wellbeing.${energy === "high" ? " Expect lively evening zoomies." : ""}`.trim();
  }
  if (species === "rabbit") {
    return `Unlimited hay, supervised floor time, and a spacious enclosure are essentials. ${coatNote}`;
  }
  if (species === "bird") {
    return `Social interaction, a roomy cage, and foraging toys matter as much as diet. Avoid drafts and toxic fumes.`;
  }
  return `${coatNote}${energyNote} Positive training and early socialization pay off.`.trim();
}

// --- DOGS (AKC-style coverage, 180+) ---
const dogRaw = [
  // Sporting
  ["Labrador Retriever", "large", "short", ["Friendly", "Outgoing", "Eager"], "high", ["kids", "dogs", "active homes"], "Newfoundland"],
  ["Golden Retriever", "large", "long", ["Friendly", "Reliable", "Gentle"], "high", ["kids", "dogs", "families"], "Scotland"],
  ["Cocker Spaniel", "medium", "long", ["Merry", "Gentle", "Eager"], "moderate", ["kids", "families"], "England"],
  ["English Springer Spaniel", "medium", "medium", ["Friendly", "Alert", "Eager"], "high", ["kids", "active homes"], "England"],
  ["Brittany", "medium", "medium", ["Bright", "Agile", "Eager"], "high", ["active homes", "dogs"], "France"],
  ["German Shorthaired Pointer", "large", "short", ["Versatile", "Eager", "Friendly"], "high", ["active homes"], "Germany"],
  ["Weimaraner", "large", "short", ["Fearless", "Alert", "Friendly"], "high", ["active homes"], "Germany"],
  ["Vizsla", "large", "short", ["Affectionate", "Gentle", "Energetic"], "high", ["families", "active homes"], "Hungary"],
  ["Irish Setter", "large", "long", ["Outgoing", "Sweet", "Active"], "high", ["families", "kids"], "Ireland"],
  ["English Setter", "large", "long", ["Gentle", "Friendly", "Mellow"], "moderate", ["families", "kids"], "England"],
  ["Pointer", "large", "short", ["Even-tempered", "Alert", "Hardworking"], "high", ["active homes"], "England"],
  ["Chesapeake Bay Retriever", "large", "double", ["Affectionate", "Bright", "Protective"], "high", ["active homes"], "United States"],
  ["Flat-Coated Retriever", "large", "medium", ["Optimistic", "Friendly", "Active"], "high", ["families", "kids"], "England"],
  ["Nova Scotia Duck Tolling Retriever", "medium", "medium", ["Playful", "Intelligent", "Outgoing"], "high", ["active homes"], "Canada"],
  ["Clumber Spaniel", "large", "dense", ["Gentle", "Loyal", "Calm"], "low", ["families", "apartments"], "England"],
  ["Field Spaniel", "medium", "medium", ["Docile", "Sensitive", "Adaptable"], "moderate", ["families"], "England"],
  ["Sussex Spaniel", "medium", "long", ["Merry", "Friendly", "Steady"], "moderate", ["families"], "England"],
  ["Welsh Springer Spaniel", "medium", "medium", ["Happy", "Reserved", "Active"], "high", ["families"], "Wales"],
  ["American Water Spaniel", "medium", "curly", ["Eager", "Friendly", "Trainable"], "high", ["active homes"], "United States"],
  ["Irish Water Spaniel", "large", "curly", ["Alert", "Inquisitive", "Devoted"], "high", ["active homes"], "Ireland"],
  ["Boykin Spaniel", "medium", "medium", ["Friendly", "Eager", "Companionable"], "high", ["families", "active homes"], "United States"],
  ["Spinone Italiano", "large", "wire", ["Sociable", "Patient", "Docile"], "moderate", ["families", "kids"], "Italy"],
  ["Wirehaired Pointing Griffon", "medium", "wire", ["Friendly", "Devoted", "Trainable"], "high", ["active homes"], "Netherlands"],
  ["Lagotto Romagnolo", "medium", "curly", ["Affectionate", "Keen", "Undemanding"], "moderate", ["families"], "Italy"],
  ["Nederlandse Kooikerhondje", "medium", "medium", ["Cheerful", "Alert", "Friendly"], "moderate", ["families"], "Netherlands"],
  ["Barbet", "medium", "curly", ["Friendly", "Bright", "Obedient"], "moderate", ["families"], "France"],
  // Hound
  ["Beagle", "small", "short", ["Curious", "Friendly", "Merry"], "high", ["kids", "families"], "England"],
  ["Basset Hound", "medium", "short", ["Charming", "Patient", "Low-key"], "low", ["families", "kids"], "France"],
  ["Bloodhound", "large", "short", ["Affectionate", "Gentle", "Independent"], "moderate", ["experienced homes"], "Belgium"],
  ["Dachshund", "small", "short", ["Curious", "Brave", "Clever"], "moderate", ["apartments", "families"], "Germany"],
  ["Longhaired Dachshund", "small", "long", ["Curious", "Devoted", "Spunky"], "moderate", ["apartments", "families"], "Germany"],
  ["Wirehaired Dachshund", "small", "wire", ["Spirited", "Clever", "Loyal"], "moderate", ["apartments"], "Germany"],
  ["Greyhound", "large", "short", ["Independent", "Gentle", "Noble"], "moderate", ["apartments", "calm homes"], "England"],
  ["Afghan Hound", "large", "long", ["Aloof", "Dignified", "Clownish"], "moderate", ["experienced homes"], "Afghanistan"],
  ["Whippet", "medium", "short", ["Affectionate", "Calm", "Playful"], "moderate", ["apartments", "families"], "England"],
  ["Rhodesian Ridgeback", "large", "short", ["Affectionate", "Dignified", "Even"], "moderate", ["experienced homes"], "Southern Africa"],
  ["Basenji", "small", "short", ["Independent", "Smart", "Poised"], "moderate", ["experienced homes"], "Central Africa"],
  ["Norwegian Elkhound", "medium", "double", ["Confident", "Loyal", "Friendly"], "high", ["active homes"], "Norway"],
  ["Borzoi", "giant", "long", ["Affectionate", "Loyal", "Independent"], "moderate", ["calm homes"], "Russia"],
  ["Irish Wolfhound", "giant", "wire", ["Courageous", "Dignified", "Calm"], "moderate", ["homes with space"], "Ireland"],
  ["Scottish Deerhound", "giant", "wire", ["Dignified", "Gentle", "Polite"], "moderate", ["homes with space"], "Scotland"],
  ["Saluki", "large", "short", ["Reserved", "Gentle", "Far-sighted"], "moderate", ["experienced homes"], "Middle East"],
  ["Pharaoh Hound", "medium", "short", ["Friendly", "Smart", "Trainable"], "high", ["active homes"], "Malta"],
  ["Ibizan Hound", "large", "short", ["Even-tempered", "Engaging", "Polite"], "high", ["active homes"], "Spain"],
  ["American Foxhound", "large", "short", ["Easygoing", "Independent", "Sweet"], "high", ["active homes"], "United States"],
  ["English Foxhound", "large", "short", ["Sociable", "Gentle", "Active"], "high", ["active homes", "dogs"], "England"],
  ["Harrier", "medium", "short", ["Outgoing", "Friendly", "People-oriented"], "high", ["active homes"], "England"],
  ["Otterhound", "large", "rough", ["Boisterous", "Even-tempered", "Amicable"], "moderate", ["homes with space"], "England"],
  ["Petit Basset Griffon Vendéen", "small", "wire", ["Happy", "Outgoing", "Independent"], "moderate", ["families"], "France"],
  ["Grand Basset Griffon Vendéen", "medium", "wire", ["Independent", "Happy", "Outgoing"], "high", ["active homes"], "France"],
  ["Plott Hound", "large", "short", ["Loyal", "Alert", "Intelligent"], "high", ["active homes"], "United States"],
  ["Treeing Walker Coonhound", "large", "short", ["Smart", "Brave", "Courteous"], "high", ["active homes"], "United States"],
  ["Bluetick Coonhound", "large", "short", ["Loyal", "Tenacious", "Friendly"], "high", ["active homes"], "United States"],
  ["Redbone Coonhound", "large", "short", ["Even-tempered", "Eager", "Familial"], "high", ["families"], "United States"],
  ["Black and Tan Coonhound", "large", "short", ["Easygoing", "Friendly", "Mellow"], "moderate", ["families"], "United States"],
  ["American English Coonhound", "large", "short", ["Sociable", "Energetic", "Alert"], "high", ["active homes"], "United States"],
  ["Sloughi", "large", "short", ["Reserved", "Loyal", "Quiet"], "moderate", ["experienced homes"], "North Africa"],
  ["Azawakh", "large", "short", ["Loyal", "Independent", "Distant"], "moderate", ["experienced homes"], "West Africa"],
  ["Portuguese Podengo", "medium", "short", ["Alert", "Intelligent", "Lively"], "high", ["active homes"], "Portugal"],
  ["Cirneco dell'Etna", "medium", "short", ["Affectionate", "Friendly", "Independent"], "moderate", ["families"], "Italy"],
  // Working
  ["German Shepherd", "large", "double", ["Confident", "Courageous", "Smart"], "high", ["experienced homes", "active homes"], "Germany"],
  ["Rottweiler", "large", "short", ["Loyal", "Loving", "Confident"], "moderate", ["experienced homes"], "Germany"],
  ["Boxer", "large", "short", ["Fun-loving", "Bright", "Active"], "high", ["kids", "families"], "Germany"],
  ["Doberman Pinscher", "large", "short", ["Loyal", "Fearless", "Alert"], "high", ["experienced homes"], "Germany"],
  ["Great Dane", "giant", "short", ["Friendly", "Patient", "Dependable"], "moderate", ["families", "homes with space"], "Germany"],
  ["Siberian Husky", "large", "double", ["Outgoing", "Mischievous", "Loyal"], "high", ["active homes", "experienced homes"], "Siberia"],
  ["Alaskan Malamute", "large", "double", ["Affectionate", "Loyal", "Playful"], "high", ["experienced homes"], "Alaska"],
  ["Bernese Mountain Dog", "giant", "long", ["Good-natured", "Calm", "Strong"], "moderate", ["families", "kids"], "Switzerland"],
  ["Saint Bernard", "giant", "dense", ["Playful", "Charming", "Inquisitive"], "moderate", ["families", "homes with space"], "Switzerland"],
  ["Newfoundland", "giant", "double", ["Sweet", "Patient", "Devoted"], "moderate", ["kids", "families"], "Newfoundland"],
  ["Mastiff", "giant", "short", ["Courageous", "Dignified", "Good-natured"], "low", ["experienced homes"], "England"],
  ["Bullmastiff", "large", "short", ["Fearless", "Confident", "Docile"], "low", ["experienced homes"], "England"],
  ["Akita", "large", "double", ["Courageous", "Dignified", "Profoundly loyal"], "moderate", ["experienced homes"], "Japan"],
  ["Samoyed", "large", "double", ["Friendly", "Gentle", "Adaptable"], "high", ["families", "kids"], "Siberia"],
  ["Great Pyrenees", "giant", "double", ["Smart", "Patient", "Calm"], "moderate", ["homes with space"], "France"],
  ["Portuguese Water Dog", "medium", "curly", ["Affectionate", "Adventurous", "Athletic"], "high", ["families", "active homes"], "Portugal"],
  ["Standard Schnauzer", "medium", "wire", ["Smart", "Spirited", "Obedient"], "high", ["families"], "Germany"],
  ["Giant Schnauzer", "large", "wire", ["Loyal", "Powerful", "Trainable"], "high", ["experienced homes"], "Germany"],
  ["Dobermann", "large", "short", ["Alert", "Loyal", "Energetic"], "high", ["experienced homes"], "Germany"],
  ["Cane Corso", "large", "short", ["Affectionate", "Intelligent", "Majestic"], "moderate", ["experienced homes"], "Italy"],
  ["Dogo Argentino", "large", "short", ["Loyal", "Athletic", "Trustworthy"], "high", ["experienced homes"], "Argentina"],
  ["Dogues de Bordeaux", "giant", "short", ["Affectionate", "Courageous", "Calm"], "low", ["experienced homes"], "France"],
  ["Leonberger", "giant", "long", ["Friendly", "Gentle", "Playful"], "moderate", ["families"], "Germany"],
  ["Anatolian Shepherd", "giant", "short", ["Loyal", "Independent", "Reserved"], "moderate", ["experienced homes"], "Turkey"],
  ["Komondor", "giant", "corded", ["Independent", "Dignified", "Calm"], "moderate", ["experienced homes"], "Hungary"],
  ["Kuvasz", "giant", "double", ["Loyal", "Fearless", "Patient"], "moderate", ["experienced homes"], "Hungary"],
  ["Tibetan Mastiff", "giant", "double", ["Independent", "Reserved", "Intelligent"], "moderate", ["experienced homes"], "Tibet"],
  ["Black Russian Terrier", "large", "curly", ["Confident", "Intelligent", "Calm"], "moderate", ["experienced homes"], "Russia"],
  ["Chinook", "large", "double", ["Smart", "Patient", "Devoted"], "moderate", ["families"], "United States"],
  ["Boerboel", "giant", "short", ["Confident", "Intelligent", "Calm"], "moderate", ["experienced homes"], "South Africa"],
  ["Greater Swiss Mountain Dog", "giant", "short", ["Faithful", "Family-oriented", "Confident"], "moderate", ["families"], "Switzerland"],
  ["Entlebucher Mountain Dog", "medium", "short", ["Loyal", "Smart", "Enthusiastic"], "high", ["active homes"], "Switzerland"],
  ["Appenzeller Sennenhund", "medium", "short", ["Agile", "Vocal", "Versatile"], "high", ["active homes"], "Switzerland"],
  ["Neapolitan Mastiff", "giant", "short", ["Watchful", "Steady", "Loyal"], "low", ["experienced homes"], "Italy"],
  ["Italian Greyhound", "toy", "short", ["Playful", "Sensitive", "Alert"], "moderate", ["apartments", "calm homes"], "Italy"],
  // Terrier
  ["American Staffordshire Terrier", "medium", "short", ["Confident", "Smart", "Good-natured"], "high", ["experienced homes"], "United States"],
  ["Staffordshire Bull Terrier", "medium", "short", ["Courageous", "Clever", "Affectionate"], "high", ["families", "kids"], "England"],
  ["Bull Terrier", "medium", "short", ["Playful", "Charming", "Mischievous"], "high", ["experienced homes"], "England"],
  ["Miniature Bull Terrier", "small", "short", ["Comical", "Active", "Keen"], "high", ["families"], "England"],
  ["Airedale Terrier", "large", "wire", ["Friendly", "Courageous", "Clever"], "high", ["families"], "England"],
  ["Welsh Terrier", "small", "wire", ["Friendly", "Spirited", "Alert"], "moderate", ["families"], "Wales"],
  ["Wire Fox Terrier", "small", "wire", ["Alert", "Quick", "Confident"], "high", ["experienced homes"], "England"],
  ["Smooth Fox Terrier", "small", "short", ["Friendly", "Alert", "Active"], "high", ["experienced homes"], "England"],
  ["Jack Russell Terrier", "small", "short", ["Bold", "Fearless", "Athletic"], "high", ["active homes"], "England"],
  ["Parson Russell Terrier", "small", "short", ["Bold", "Friendly", "Athletic"], "high", ["active homes"], "England"],
  ["Rat Terrier", "small", "short", ["Friendly", "Inquisitive", "Lively"], "high", ["families"], "United States"],
  ["Toy Fox Terrier", "toy", "short", ["Friendly", "Alert", "Intelligent"], "high", ["apartments"], "United States"],
  ["Cairn Terrier", "small", "wire", ["Alert", "Cheerful", "Busy"], "moderate", ["families"], "Scotland"],
  ["West Highland White Terrier", "small", "wire", ["Confident", "Friendly", "Hardy"], "moderate", ["apartments", "families"], "Scotland"],
  ["Scottish Terrier", "small", "wire", ["Independent", "Confident", "Spirited"], "moderate", ["apartments"], "Scotland"],
  ["Soft Coated Wheaten Terrier", "medium", "silky", ["Happy", "Friendly", "Spirited"], "high", ["families"], "Ireland"],
  ["Irish Terrier", "medium", "wire", ["Bold", "Dashing", "Tenderhearted"], "high", ["families"], "Ireland"],
  ["Kerry Blue Terrier", "medium", "curly", ["People-oriented", "Alert", "Smart"], "high", ["families"], "Ireland"],
  ["Border Terrier", "small", "wire", ["Affectionate", "Happy", "Obedient"], "moderate", ["families"], "England"],
  ["Norfolk Terrier", "small", "wire", ["Fearless", "Alert", "Companionship"], "moderate", ["families"], "England"],
  ["Norwich Terrier", "small", "wire", ["Affectionate", "Alert", "Fearless"], "moderate", ["families"], "England"],
  ["Miniature Schnauzer", "small", "wire", ["Friendly", "Smart", "Obedient"], "moderate", ["apartments", "families"], "Germany"],
  ["Bedlington Terrier", "small", "curly", ["Loyal", "Charming", "Fanciable"], "moderate", ["families"], "England"],
  ["Dandie Dinmont Terrier", "small", "long", ["Independent", "Proud", "Smart"], "moderate", ["apartments"], "Scotland"],
  ["Lakeland Terrier", "small", "wire", ["Bold", "Friendly", "Confident"], "high", ["families"], "England"],
  ["Sealyham Terrier", "small", "wire", ["Alert", "Outgoing", "Curious"], "moderate", ["families"], "Wales"],
  ["Skye Terrier", "small", "long", ["Fearless", "Good-tempered", "Cautious"], "moderate", ["calm homes"], "Scotland"],
  ["Manchester Terrier", "small", "short", ["Discerning", "Spirited", "Sleek"], "moderate", ["apartments"], "England"],
  ["Russell Terrier", "small", "short", ["Alert", "Inquisitive", "Lively"], "high", ["active homes"], "England"],
  ["American Hairless Terrier", "small", "hairless", ["Curious", "Alert", "Friendly"], "moderate", ["apartments"], "United States"],
  ["Glen of Imaal Terrier", "small", "wire", ["Gentle", "Spirited", "Docile"], "moderate", ["families"], "Ireland"],
  ["Cesky Terrier", "small", "silky", ["Family-oriented", "Even", "Trainable"], "moderate", ["families"], "Czech Republic"],
  // Toy
  ["Chihuahua", "toy", "short", ["Charming", "Graceful", "Sassy"], "moderate", ["apartments"], "Mexico"],
  ["Long Coat Chihuahua", "toy", "long", ["Devoted", "Alert", "Sassy"], "moderate", ["apartments"], "Mexico"],
  ["Pomeranian", "toy", "double", ["Lively", "Bold", "Inquisitive"], "moderate", ["apartments"], "Germany"],
  ["Yorkshire Terrier", "toy", "long", ["Affectionate", "Sprightly", "Tomboyish"], "moderate", ["apartments"], "England"],
  ["Maltese", "toy", "long", ["Gentle", "Playful", "Charming"], "moderate", ["apartments"], "Mediterranean"],
  ["Shih Tzu", "toy", "long", ["Affectionate", "Playful", "Outgoing"], "low", ["apartments", "families"], "Tibet"],
  ["Pug", "toy", "short", ["Charming", "Mischievous", "Loving"], "low", ["apartments", "families"], "China"],
  ["French Bulldog", "small", "short", ["Adaptable", "Playful", "Smart"], "low", ["apartments", "families"], "France"],
  ["Cavalier King Charles Spaniel", "small", "medium", ["Affectionate", "Gentle", "Graceful"], "moderate", ["apartments", "families", "kids"], "United Kingdom"],
  ["Papillon", "toy", "long", ["Happy", "Alert", "Friendly"], "moderate", ["apartments"], "France"],
  ["Havanese", "toy", "long", ["Outgoing", "Funny", "Intelligent"], "moderate", ["apartments", "families"], "Cuba"],
  ["Bichon Frise", "small", "curly", ["Playful", "Curious", "Peppy"], "moderate", ["apartments", "families"], "Mediterranean"],
  ["Pekingese", "toy", "long", ["Affectionate", "Loyal", "Regal"], "low", ["apartments"], "China"],
  ["Japanese Chin", "toy", "long", ["Charming", "Noble", "Loving"], "low", ["apartments"], "Japan"],
  ["Toy Poodle", "toy", "curly", ["Intelligent", "Proud", "Active"], "moderate", ["apartments"], "France"],
  ["Miniature Pinscher", "toy", "short", ["Fearless", "Fun-loving", "Proud"], "high", ["apartments"], "Germany"],
  ["Brussels Griffon", "toy", "wire", ["Alert", "Curious", "Loyal"], "moderate", ["apartments"], "Belgium"],
  ["Affenpinscher", "toy", "wire", ["Confident", "Famously funny", "Fearless"], "moderate", ["apartments"], "Germany"],
  ["Chinese Crested", "toy", "hairless", ["Affectionate", "Alert", "Lively"], "moderate", ["apartments"], "China"],
  ["English Toy Spaniel", "toy", "long", ["Gentle", "Happy", "Intelligent"], "low", ["apartments"], "England"],
  ["Silky Terrier", "toy", "long", ["Friendly", "Quick", "Keenly alert"], "moderate", ["apartments"], "Australia"],
  ["Russian Toy", "toy", "short", ["Loyal", "Charming", "Active"], "moderate", ["apartments"], "Russia"],
  ["Biewer Terrier", "toy", "long", ["Intelligent", "Loyal", "Amusing"], "moderate", ["apartments"], "Germany"],
  // Non-sporting
  ["Poodle", "medium", "curly", ["Active", "Proud", "Very smart"], "high", ["families", "apartments"], "France"],
  ["Miniature Poodle", "small", "curly", ["Intelligent", "Active", "Faithful"], "moderate", ["apartments", "families"], "France"],
  ["Bulldog", "medium", "short", ["Friendly", "Courageous", "Calm"], "low", ["apartments", "families"], "England"],
  ["Boston Terrier", "small", "short", ["Friendly", "Bright", "Amusing"], "moderate", ["apartments", "families"], "United States"],
  ["Dalmatian", "large", "short", ["Dignified", "Smart", "Outgoing"], "high", ["active homes"], "Croatia"],
  ["Shar-Pei", "medium", "short", ["Loyal", "Independent", "Calm"], "low", ["experienced homes"], "China"],
  ["Chow Chow", "medium", "double", ["Dignified", "Bright", "Serious"], "low", ["experienced homes"], "China"],
  ["Shiba Inu", "small", "double", ["Alert", "Active", "Attentive"], "moderate", ["experienced homes", "apartments"], "Japan"],
  ["Lhasa Apso", "small", "long", ["Confident", "Smart", "Comical"], "moderate", ["apartments"], "Tibet"],
  ["Tibetan Terrier", "medium", "long", ["Affectionate", "Sensitive", "Clever"], "moderate", ["families"], "Tibet"],
  ["Tibetan Spaniel", "small", "medium", ["Playful", "Bright", "Affectionate"], "moderate", ["apartments"], "Tibet"],
  ["Keeshond", "medium", "double", ["Friendly", "Lively", "Outgoing"], "moderate", ["families"], "Netherlands"],
  ["Schipperke", "small", "double", ["Confident", "Alert", "Curious"], "high", ["apartments"], "Belgium"],
  ["Finnish Spitz", "medium", "double", ["Friendly", "Lively", "Eager"], "high", ["active homes"], "Finland"],
  ["American Eskimo Dog", "medium", "double", ["Friendly", "Alert", "Intelligent"], "moderate", ["families"], "United States"],
  ["Coton de Tulear", "small", "long", ["Affectionate", "Bright", "Happy"], "moderate", ["apartments", "families"], "Madagascar"],
  ["Xoloitzcuintli", "medium", "hairless", ["Loyal", "Alert", "Calm"], "moderate", ["families"], "Mexico"],
  ["Chinese Shar-Pei", "medium", "short", ["Regal", "Bright", "Independent"], "low", ["experienced homes"], "China"],
  ["Lowchen", "small", "long", ["Affectionate", "Outgoing", "Positive"], "moderate", ["apartments"], "Europe"],
  ["Norwegian Lundehund", "small", "double", ["Alert", "Loyal", "Energetic"], "high", ["active homes"], "Norway"],
  // Herding
  ["Border Collie", "medium", "medium", ["Affectionate", "Smart", "Energetic"], "high", ["active homes", "experienced homes"], "United Kingdom"],
  ["Australian Shepherd", "medium", "medium", ["Smart", "Work-oriented", "Exuberant"], "high", ["active homes"], "United States"],
  ["Australian Cattle Dog", "medium", "short", ["Alert", "Curious", "Pleasant"], "high", ["active homes", "experienced homes"], "Australia"],
  ["Shetland Sheepdog", "small", "long", ["Playful", "Energetic", "Bright"], "high", ["families"], "Scotland"],
  ["Collie", "large", "long", ["Devoted", "Graceful", "Proud"], "moderate", ["families", "kids"], "Scotland"],
  ["Smooth Collie", "large", "short", ["Devoted", "Friendly", "Bright"], "moderate", ["families"], "Scotland"],
  ["Pembroke Welsh Corgi", "small", "medium", ["Affectionate", "Smart", "Alert"], "moderate", ["families", "kids"], "Wales"],
  ["Cardigan Welsh Corgi", "small", "medium", ["Loyal", "Affectionate", "Smart"], "moderate", ["families"], "Wales"],
  ["Belgian Malinois", "large", "short", ["Confident", "Smart", "Hardworking"], "high", ["experienced homes", "active homes"], "Belgium"],
  ["Belgian Tervuren", "large", "long", ["Alert", "Intelligent", "Observant"], "high", ["experienced homes"], "Belgium"],
  ["Belgian Sheepdog", "large", "long", ["Affectionate", "Alert", "Watchful"], "high", ["experienced homes"], "Belgium"],
  ["Belgian Laekenois", "large", "wire", ["Alert", "Intelligent", "Affectionate"], "high", ["experienced homes"], "Belgium"],
  ["Old English Sheepdog", "large", "long", ["Adaptable", "Gentle", "Smart"], "moderate", ["families"], "England"],
  ["Bearded Collie", "medium", "long", ["Bouncy", "Charismatic", "Smart"], "high", ["active homes"], "Scotland"],
  ["Australian Kelpie", "medium", "short", ["Alert", "Eager", "Intelligent"], "high", ["active homes"], "Australia"],
  ["Rough Collie", "large", "long", ["Loyal", "Graceful", "Devoted"], "moderate", ["families"], "Scotland"],
  ["German Shepherd Dog", "large", "double", ["Versatile", "Loyal", "Confident"], "high", ["experienced homes"], "Germany"],
  ["Canaan Dog", "medium", "double", ["Alert", "Vigilant", "Devoted"], "moderate", ["experienced homes"], "Middle East"],
  ["Briard", "large", "long", ["Loyal", "Faithful", "Fearless"], "high", ["families"], "France"],
  ["Bouvier des Flandres", "large", "double", ["Courageous", "Affectionate", "Strong-willed"], "moderate", ["experienced homes"], "Belgium"],
  ["Beauceron", "large", "short", ["Gentle", "Faithful", "Obedient"], "high", ["experienced homes"], "France"],
  ["Bergamasco Sheepdog", "large", "flocked", ["Independent", "Quiet", "Patient"], "moderate", ["families"], "Italy"],
  ["Spanish Water Dog", "medium", "curly", ["Affectionate", "Work-driven", "Athletic"], "high", ["active homes"], "Spain"],
  ["Puli", "medium", "corded", ["Loyal", "Smart", "Home-loving"], "high", ["active homes"], "Hungary"],
  ["Pumi", "medium", "curly", ["Ready", "Lively", "Whimsical"], "high", ["active homes"], "Hungary"],
  ["Swedish Vallhund", "small", "medium", ["Friendly", "Energetic", "Watchful"], "high", ["active homes"], "Sweden"],
  ["Norwegian Buhund", "medium", "double", ["Confident", "Perky", "Alert"], "high", ["active homes"], "Norway"],
  ["Icelandic Sheepdog", "medium", "double", ["Friendly", "Cheerful", "Inquisitive"], "high", ["families"], "Iceland"],
  ["Polish Lowland Sheepdog", "medium", "long", ["Confident", "Alert", "Lively"], "moderate", ["families"], "Poland"],
  ["Mudi", "medium", "curly", ["Loyal", "Keen", "Active"], "high", ["active homes"], "Hungary"],
  ["Dutch Shepherd", "large", "short", ["Intelligent", "Loyal", "Reliable"], "high", ["experienced homes"], "Netherlands"],
  ["Miniature American Shepherd", "small", "medium", ["Intelligent", "Good-natured", "Devoted"], "high", ["families", "active homes"], "United States"],
  ["Lancashire Heeler", "small", "short", ["Affectionate", "Alert", "Intelligent"], "moderate", ["families"], "England"],
  ["Finnish Lapphund", "medium", "double", ["Friendly", "Alert", "Eager"], "moderate", ["families"], "Finland"],
  ["Swedish Lapphund", "medium", "double", ["Versatile", "Friendly", "Lively"], "moderate", ["families"], "Sweden"],
  // Misc popular / designer-recognized mixes as named breeds often sought
  ["Cockapoo", "small", "curly", ["Friendly", "Intelligent", "Affectionate"], "moderate", ["families", "apartments"], "United States"],
  ["Goldendoodle", "large", "curly", ["Friendly", "Intelligent", "Eager"], "high", ["families", "kids"], "United States"],
  ["Labradoodle", "large", "curly", ["Friendly", "Energetic", "Smart"], "high", ["families"], "Australia"],
  ["Bernedoodle", "large", "curly", ["Gentle", "Smart", "Playful"], "moderate", ["families"], "United States"],
  ["Aussiedoodle", "medium", "curly", ["Intelligent", "Energetic", "Loyal"], "high", ["active homes"], "United States"],
  ["Cavapoo", "small", "curly", ["Affectionate", "Gentle", "Playful"], "moderate", ["apartments", "families"], "United States"],
  ["Maltipoo", "toy", "curly", ["Affectionate", "Lively", "Clever"], "moderate", ["apartments"], "United States"],
  ["Yorkipoo", "toy", "curly", ["Spunky", "Affectionate", "Alert"], "moderate", ["apartments"], "United States"],
  ["Schnoodle", "small", "curly", ["Smart", "Friendly", "Alert"], "moderate", ["families"], "United States"],
  ["Sheepadoodle", "large", "curly", ["Gentle", "Smart", "Playful"], "moderate", ["families"], "United States"],
  ["Beagle Mix", "medium", "short", ["Curious", "Friendly", "Merry"], "moderate", ["families"], undefined],
  ["German Shepherd Mix", "large", "double", ["Loyal", "Smart", "Protective"], "high", ["experienced homes"], undefined],
  ["Labrador Mix", "large", "short", ["Friendly", "Eager", "Adaptable"], "high", ["families", "kids"], undefined],
  ["Terrier Mix", "small", "short", ["Spunky", "Loyal", "Playful"], "high", ["families"], undefined],
  ["Retriever Mix", "large", "medium", ["Friendly", "Gentle", "Active"], "high", ["families"], undefined],
  ["Shepherd Mix", "large", "double", ["Loyal", "Alert", "Trainable"], "high", ["experienced homes"], undefined],
  ["Spaniel Mix", "medium", "medium", ["Gentle", "Friendly", "Eager"], "moderate", ["families"], undefined],
  ["Hound Mix", "medium", "short", ["Curious", "Affectionate", "Independent"], "moderate", ["families"], undefined],
  ["Pit Bull Mix", "medium", "short", ["Affectionate", "Loyal", "Goofy"], "high", ["experienced homes"], "United States"],
  ["Husky Mix", "large", "double", ["Outgoing", "Energetic", "Friendly"], "high", ["active homes"], undefined],
];

// Deduplicate by slug (keep first)
const dogSeen = new Set();
const dogs = [];
for (const row of dogRaw) {
  const [name, sizeGroup, coat, temperament, energy, goodWith, origin] = row;
  const slug = slugify(name);
  if (dogSeen.has(slug)) continue;
  dogSeen.add(slug);
  dogs.push({
    slug,
    name,
    species: "dog",
    sizeGroup,
    coat,
    temperament,
    energy,
    goodWith,
    description: blurb("dog", name, temperament, sizeGroup, energy, origin),
    origin: origin || undefined,
    careNotes: careNotes("dog", coat, energy),
  });
}

// --- CATS (60+) ---
const catRaw = [
  ["Domestic Shorthair", "medium", "short", ["Adaptable", "Affectionate", "Playful"], "moderate", ["kids", "apartments", "dogs"], undefined],
  ["Domestic Longhair", "medium", "long", ["Gentle", "Affectionate", "Calm"], "low", ["apartments", "families"], undefined],
  ["Tabby", "medium", "short", ["Curious", "Friendly", "Independent"], "moderate", ["apartments", "families"], undefined],
  ["Calico", "medium", "short", ["Spunky", "Affectionate", "Independent"], "moderate", ["apartments"], undefined],
  ["Tortoiseshell", "medium", "short", ["Spirited", "Loyal", "Playful"], "moderate", ["apartments"], undefined],
  ["Siamese", "medium", "short", ["Vocal", "Social", "Intelligent"], "high", ["families", "apartments"], "Thailand"],
  ["Siamese Mix", "medium", "short", ["Social", "Curious", "Affectionate"], "moderate", ["families"], undefined],
  ["Persian", "medium", "long", ["Quiet", "Sweet", "Dignified"], "low", ["apartments", "calm homes"], "Iran"],
  ["Maine Coon", "large", "long", ["Gentle", "Friendly", "Playful"], "moderate", ["kids", "dogs", "families"], "United States"],
  ["Ragdoll", "large", "long", ["Docile", "Relaxed", "Affectionate"], "low", ["families", "kids", "apartments"], "United States"],
  ["British Shorthair", "medium", "short", ["Calm", "Easygoing", "Affectionate"], "low", ["apartments", "families"], "United Kingdom"],
  ["American Shorthair", "medium", "short", ["Even-tempered", "Playful", "Healthy"], "moderate", ["kids", "families"], "United States"],
  ["Scottish Fold", "medium", "short", ["Sweet", "Adaptable", "Playful"], "low", ["apartments", "families"], "Scotland"],
  ["Bengal", "medium", "short", ["Energetic", "Curious", "Athletic"], "high", ["active homes", "experienced homes"], "United States"],
  ["Sphynx", "medium", "hairless", ["Outgoing", "Energetic", "Affectionate"], "high", ["families", "apartments"], "Canada"],
  ["Abyssinian", "medium", "short", ["Active", "Loyal", "Playful"], "high", ["active homes"], "Ethiopia"],
  ["Russian Blue", "medium", "short", ["Quiet", "Gentle", "Reserved"], "moderate", ["apartments", "calm homes"], "Russia"],
  ["Oriental Shorthair", "medium", "short", ["Vocal", "Social", "Curious"], "high", ["families"], "United Kingdom"],
  ["Devon Rex", "medium", "curly", ["Mischievous", "Social", "Playful"], "high", ["families", "apartments"], "England"],
  ["Cornish Rex", "medium", "curly", ["Active", "Affectionate", "Curious"], "high", ["families"], "England"],
  ["Birman", "large", "long", ["Gentle", "Social", "Quiet"], "low", ["families", "kids"], "Myanmar"],
  ["Norwegian Forest Cat", "large", "long", ["Friendly", "Patient", "Independent"], "moderate", ["families", "kids"], "Norway"],
  ["Siberian", "large", "long", ["Affectionate", "Playful", "Calm"], "moderate", ["families", "kids"], "Russia"],
  ["Exotic Shorthair", "medium", "short", ["Quiet", "Loyal", "Playful"], "low", ["apartments", "families"], "United States"],
  ["Burmese", "medium", "short", ["People-oriented", "Playful", "Curious"], "moderate", ["families"], "Myanmar"],
  ["Tonkinese", "medium", "short", ["Social", "Curious", "Affectionate"], "high", ["families"], "Canada"],
  ["Himalayan", "medium", "long", ["Gentle", "Quiet", "Sweet"], "low", ["apartments", "calm homes"], "United States"],
  ["Manx", "medium", "short", ["Playful", "Social", "Intelligent"], "moderate", ["families"], "Isle of Man"],
  ["American Curl", "medium", "medium", ["Curious", "People-oriented", "Adaptable"], "moderate", ["families"], "United States"],
  ["Turkish Angora", "medium", "long", ["Intelligent", "Playful", "Graceful"], "high", ["families"], "Turkey"],
  ["Turkish Van", "large", "semi-long", ["Energetic", "Intelligent", "Curious"], "high", ["active homes"], "Turkey"],
  ["Bombay", "medium", "short", ["Affectionate", "Curious", "People-oriented"], "moderate", ["apartments", "families"], "United States"],
  ["Chartreux", "medium", "short", ["Quiet", "Loyal", "Observant"], "low", ["apartments"], "France"],
  ["Egyptian Mau", "medium", "short", ["Loyal", "Active", "Alert"], "high", ["active homes"], "Egypt"],
  ["Savannah", "large", "short", ["Curious", "Athletic", "Loyal"], "high", ["experienced homes"], "United States"],
  ["Ocicat", "medium", "short", ["Confident", "Social", "Athletic"], "high", ["families"], "United States"],
  ["Singapura", "small", "short", ["Curious", "Lively", "Affectionate"], "high", ["apartments"], "Singapore"],
  ["Somali", "medium", "long", ["Playful", "Curious", "Affectionate"], "high", ["families"], "United States"],
  ["Balinese", "medium", "long", ["Vocal", "Social", "Graceful"], "high", ["families"], "United States"],
  ["Javanese", "medium", "long", ["Talkative", "Playful", "Devoted"], "high", ["families"], "United States"],
  ["Ragamuffin", "large", "long", ["Docile", "Affectionate", "Playful"], "low", ["families", "kids"], "United States"],
  ["Nebelung", "medium", "long", ["Gentle", "Quiet", "Devoted"], "moderate", ["calm homes"], "United States"],
  ["Japanese Bobtail", "medium", "short", ["Active", "Talkative", "Playful"], "high", ["families"], "Japan"],
  ["Korat", "medium", "short", ["Gentle", "Quiet", "Loyal"], "moderate", ["calm homes"], "Thailand"],
  ["LaPerm", "medium", "curly", ["Affectionate", "Active", "Curious"], "moderate", ["families"], "United States"],
  ["Selkirk Rex", "medium", "curly", ["Patient", "Playful", "Social"], "moderate", ["families"], "United States"],
  ["American Wirehair", "medium", "wire", ["Easygoing", "Curious", "Affectionate"], "moderate", ["families"], "United States"],
  ["Colorpoint Shorthair", "medium", "short", ["Vocal", "Affectionate", "Active"], "high", ["families"], "United States"],
  ["Snowshoe", "medium", "short", ["Social", "Vocal", "Intelligent"], "moderate", ["families"], "United States"],
  ["Munchkin", "small", "short", ["Playful", "Outgoing", "Curious"], "moderate", ["apartments", "families"], "United States"],
  ["Pixiebob", "large", "short", ["Dog-like", "Loyal", "Quiet"], "moderate", ["families"], "United States"],
  ["Toyger", "medium", "short", ["Outgoing", "Confident", "Athletic"], "moderate", ["families"], "United States"],
  ["Lykoi", "medium", "partial", ["Curious", "Active", "Affectionate"], "moderate", ["experienced homes"], "United States"],
  ["Highlander", "large", "short", ["Playful", "Loyal", "Adventurous"], "high", ["families"], "United States"],
  ["Chantilly-Tiffany", "medium", "long", ["Loyal", "Quiet", "Affectionate"], "low", ["calm homes"], "United States"],
  ["Havana Brown", "medium", "short", ["Friendly", "Curious", "People-oriented"], "moderate", ["families"], "United Kingdom"],
  ["Burmilla", "medium", "short", ["Easygoing", "Playful", "Affectionate"], "moderate", ["families"], "United Kingdom"],
  ["Australian Mist", "medium", "short", ["Gentle", "Social", "Tolerant"], "moderate", ["kids", "families"], "Australia"],
  ["Asian", "medium", "short", ["Active", "Affectionate", "Curious"], "moderate", ["families"], "United Kingdom"],
  ["European Shorthair", "medium", "short", ["Independent", "Friendly", "Healthy"], "moderate", ["families"], "Europe"],
  ["Aegean", "medium", "semi-long", ["Social", "Intelligent", "Active"], "moderate", ["families"], "Greece"],
  ["Cyprus", "medium", "short", ["Friendly", "Active", "Adaptable"], "moderate", ["families"], "Cyprus"],
  ["Khao Manee", "medium", "short", ["Active", "Vocal", "Affectionate"], "high", ["families"], "Thailand"],
  ["Sokoke", "medium", "short", ["Active", "Loyal", "Independent"], "high", ["active homes"], "Kenya"],
  ["Donskoy", "medium", "hairless", ["Social", "Intelligent", "Affectionate"], "moderate", ["families"], "Russia"],
  ["Peterbald", "medium", "hairless", ["Affectionate", "Energetic", "Social"], "high", ["families"], "Russia"],
  ["Kurilian Bobtail", "medium", "short", ["Playful", "Friendly", "Curious"], "moderate", ["families"], "Russia"],
];

const catSeen = new Set();
const cats = [];
for (const row of catRaw) {
  const [name, sizeGroup, coat, temperament, energy, goodWith, origin] = row;
  const slug = slugify(name);
  if (catSeen.has(slug)) continue;
  catSeen.add(slug);
  cats.push({
    slug,
    name,
    species: "cat",
    sizeGroup,
    coat,
    temperament,
    energy,
    goodWith,
    description: blurb("cat", name, temperament, sizeGroup, energy, origin),
    origin: origin || undefined,
    careNotes: careNotes("cat", coat, energy),
  });
}

// --- Rabbits (small set) ---
const rabbitRaw = [
  ["Holland Lop", "small", "short", ["Gentle", "Friendly", "Curious"], "moderate", ["families", "apartments"], "Netherlands"],
  ["Mini Rex", "small", "short", ["Calm", "Affectionate", "Soft"], "low", ["apartments", "families"], "United States"],
  ["Netherland Dwarf", "small", "short", ["Spunky", "Curious", "Alert"], "moderate", ["experienced homes"], "Netherlands"],
  ["Lionhead", "small", "long", ["Friendly", "Playful", "Docile"], "moderate", ["families"], "Belgium"],
  ["Flemish Giant", "large", "short", ["Gentle", "Docile", "Patient"], "low", ["homes with space"], "Belgium"],
  ["English Lop", "medium", "short", ["Laid-back", "Affectionate", "Calm"], "low", ["families"], "England"],
  ["Dutch", "small", "short", ["Curious", "Energetic", "Friendly"], "moderate", ["families"], "Netherlands"],
  ["Mini Lop", "small", "short", ["Outgoing", "Affectionate", "Playful"], "moderate", ["families"], "United States"],
];

const rabbits = rabbitRaw.map(([name, sizeGroup, coat, temperament, energy, goodWith, origin]) => ({
  slug: slugify(name),
  name,
  species: "rabbit",
  sizeGroup,
  coat,
  temperament,
  energy,
  goodWith,
  description: blurb("rabbit", name, temperament, sizeGroup, energy, origin),
  origin,
  careNotes: careNotes("rabbit", coat, energy),
}));

// --- Birds (small set) ---
const birdRaw = [
  ["Budgerigar", "small", "short", ["Social", "Vocal", "Playful"], "high", ["families", "apartments"], "Australia"],
  ["Cockatiel", "small", "short", ["Gentle", "Affectionate", "Curious"], "moderate", ["families"], "Australia"],
  ["Lovebird", "small", "short", ["Bonded", "Active", "Curious"], "high", ["experienced homes"], "Africa"],
  ["Canary", "small", "short", ["Melodic", "Alert", "Independent"], "moderate", ["apartments"], "Canary Islands"],
  ["Conure", "medium", "short", ["Playful", "Vocal", "Affectionate"], "high", ["experienced homes"], "South America"],
  ["African Grey Parrot", "medium", "short", ["Intelligent", "Observant", "Social"], "high", ["experienced homes"], "Central Africa"],
];

const birds = birdRaw.map(([name, sizeGroup, coat, temperament, energy, goodWith, origin]) => ({
  slug: slugify(name),
  name,
  species: "bird",
  sizeGroup,
  coat,
  temperament,
  energy,
  goodWith,
  description: blurb("bird", name, temperament, sizeGroup, energy, origin),
  origin,
  careNotes: careNotes("bird", coat, energy),
}));

const all = [...dogs, ...cats, ...rabbits, ...birds];

function serializeBreed(b) {
  const lines = [
    `  {`,
    `    slug: ${JSON.stringify(b.slug)},`,
    `    name: ${JSON.stringify(b.name)},`,
    `    species: ${JSON.stringify(b.species)},`,
    `    sizeGroup: ${JSON.stringify(b.sizeGroup)},`,
    `    coat: ${JSON.stringify(b.coat)},`,
    `    temperament: ${JSON.stringify(b.temperament)},`,
    `    energy: ${JSON.stringify(b.energy)},`,
    `    goodWith: ${JSON.stringify(b.goodWith)},`,
    `    description: ${JSON.stringify(b.description)},`,
  ];
  if (b.origin) lines.push(`    origin: ${JSON.stringify(b.origin)},`);
  if (b.careNotes) lines.push(`    careNotes: ${JSON.stringify(b.careNotes)},`);
  lines.push(`  }`);
  return lines.join("\n");
}

const out = `import type { Breed } from "@/lib/types";

/** Comprehensive static breed encyclopedia for Puppies for Adoption (dogs, cats, and a few small pets). */
export const breeds: Breed[] = [
${all.map(serializeBreed).join(",\n")},
];

export function getBreedBySlug(slug: string): Breed | undefined {
  return breeds.find((b) => b.slug === slug);
}

export function getBreedsBySpecies(species: Breed["species"]): Breed[] {
  return breeds.filter((b) => b.species === species);
}

export function searchBreeds(query: string, species?: Breed["species"] | "all"): Breed[] {
  const q = query.trim().toLowerCase();
  return breeds.filter((b) => {
    if (species && species !== "all" && b.species !== species) return false;
    if (!q) return true;
    const hay = \`\${b.name} \${b.temperament.join(" ")} \${b.goodWith.join(" ")} \${b.origin ?? ""} \${b.description}\`.toLowerCase();
    return hay.includes(q);
  });
}

export function breedSlugFromPetBreed(petBreed: string): string | undefined {
  const exact = breeds.find((b) => b.name.toLowerCase() === petBreed.toLowerCase());
  if (exact) return exact.slug;
  const partial = breeds.find(
    (b) =>
      petBreed.toLowerCase().includes(b.name.toLowerCase()) ||
      b.name.toLowerCase().includes(petBreed.toLowerCase())
  );
  return partial?.slug;
}

export const breedCounts = {
  dog: breeds.filter((b) => b.species === "dog").length,
  cat: breeds.filter((b) => b.species === "cat").length,
  rabbit: breeds.filter((b) => b.species === "rabbit").length,
  bird: breeds.filter((b) => b.species === "bird").length,
  total: breeds.length,
} as const;
`;

const dest = join(__dirname, "../src/data/breeds.ts");
writeFileSync(dest, out);
console.log("Wrote", dest);
console.log("Counts:", {
  dog: dogs.length,
  cat: cats.length,
  rabbit: rabbits.length,
  bird: birds.length,
  total: all.length,
});
