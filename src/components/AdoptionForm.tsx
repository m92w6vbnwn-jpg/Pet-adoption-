"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

const FORMSUBMIT_EMAIL = "michealgoege4@gmail.com";
const THANKS_URL =
  "https://m92w6vbnwn-jpg.github.io/Pet-adoption-/apply/thanks/";

export type PetOption = { id: string; name: string };

type AdoptionFormProps = {
  /** When set (pet detail page), locks the application to this pet. */
  petName?: string;
  /** Show preferred-pet dropdown (general /apply page). */
  showPetPicker?: boolean;
  /** Sample pets for the dropdown. */
  pets?: PetOption[];
};

const inputClass =
  "w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 outline-none focus:ring-2 focus:ring-clay-500/40";
const labelClass = "mb-1 block text-sm font-medium text-ink-800";

function AdoptionFormInner({
  petName,
  showPetPicker = false,
  pets = [],
}: AdoptionFormProps) {
  const searchParams = useSearchParams();
  const queryPetId = searchParams.get("pet") ?? "";

  const lockedPet = petName?.trim() || undefined;

  const defaultPetId = useMemo(() => {
    if (lockedPet) return "";
    if (queryPetId && pets.some((p) => p.id === queryPetId)) return queryPetId;
    return "";
  }, [lockedPet, queryPetId, pets]);

  const defaultPetName = useMemo(() => {
    if (lockedPet) return lockedPet;
    const match = pets.find((p) => p.id === defaultPetId);
    return match?.name ?? "";
  }, [lockedPet, pets, defaultPetId]);

  const subjectPet = lockedPet || "a pet";
  const heading = lockedPet
    ? `Apply to adopt ${lockedPet}`
    : "Adoption application";

  return (
    <form
      action={`https://formsubmit.co/${FORMSUBMIT_EMAIL}`}
      method="POST"
      className="rounded-2xl border border-cream-300 bg-white p-6 shadow-sm"
    >
      <h3 className="font-display text-2xl font-semibold text-ink-900">
        {heading}
      </h3>
      <p className="mt-2 text-sm text-ink-700">
        Tell us about your home and lifestyle. Applications are sent to our
        team at{" "}
        <a
          className="font-medium text-clay-700 hover:text-clay-600"
          href={`mailto:${FORMSUBMIT_EMAIL}`}
        >
          {FORMSUBMIT_EMAIL}
        </a>
        . We typically reply within 2–3 business days.
      </p>

      {/* FormSubmit controls */}
      <input
        type="hidden"
        name="_subject"
        value={`Adoption application — ${subjectPet}`}
      />
      <input type="hidden" name="_next" value={THANKS_URL} />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />
      {/* Honeypot */}
      <input
        type="text"
        name="_honey"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {lockedPet ? (
        <input type="hidden" name="preferredPet" value={lockedPet} />
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="cityState" className={labelClass}>
            City / state
          </label>
          <input
            id="cityState"
            name="cityState"
            required
            placeholder="e.g. Los Angeles, CA"
            autoComplete="address-level2"
            className={inputClass}
          />
        </div>

        {showPetPicker && !lockedPet ? (
          <div className="sm:col-span-2">
            <label htmlFor="preferredPet" className={labelClass}>
              Preferred pet{" "}
              <span className="font-normal text-ink-700/70">(optional)</span>
            </label>
            <select
              id="preferredPet"
              name="preferredPet"
              className={inputClass}
              defaultValue={defaultPetName}
            >
              <option value="">No specific pet yet</option>
              {pets.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-ink-700/70">
              Tip: open{" "}
              <code className="rounded bg-cream-200 px-1">/apply?pet=luna</code>{" "}
              to pre-select a pet.
            </p>
          </div>
        ) : null}

        <div>
          <label htmlFor="housingType" className={labelClass}>
            Housing type
          </label>
          <select
            id="housingType"
            name="housingType"
            required
            className={inputClass}
            defaultValue=""
          >
            <option value="" disabled>
              Select…
            </option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo / townhouse</option>
            <option value="shared">Shared housing</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="ownRent" className={labelClass}>
            Do you own or rent?
          </label>
          <select
            id="ownRent"
            name="ownRent"
            required
            className={inputClass}
            defaultValue=""
          >
            <option value="" disabled>
              Select…
            </option>
            <option value="own">Own</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <fieldset>
            <legend className={labelClass}>Do you have a yard?</legend>
            <div className="mt-1 flex flex-wrap gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-ink-800">
                <input
                  type="radio"
                  name="yard"
                  value="yes"
                  required
                  className="accent-clay-600"
                />
                Yes
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-ink-800">
                <input
                  type="radio"
                  name="yard"
                  value="no"
                  className="accent-clay-600"
                />
                No
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-ink-800">
                <input
                  type="radio"
                  name="yard"
                  value="shared"
                  className="accent-clay-600"
                />
                Shared / community
              </label>
            </div>
          </fieldset>
        </div>

        <div>
          <label htmlFor="otherPets" className={labelClass}>
            Other pets at home
          </label>
          <input
            id="otherPets"
            name="otherPets"
            placeholder="None, or list species/names"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="kidsAtHome" className={labelClass}>
            Kids at home
          </label>
          <input
            id="kidsAtHome"
            name="kidsAtHome"
            placeholder="None, or ages"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="experience" className={labelClass}>
            Experience with pets
          </label>
          <textarea
            id="experience"
            name="experience"
            required
            rows={3}
            placeholder="Past pets, training, veterinary care, etc."
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="whyAdopt" className={labelClass}>
            Why do you want to adopt
            {lockedPet ? ` ${lockedPet}` : ""}? Lifestyle notes
          </label>
          <textarea
            id="whyAdopt"
            name="whyAdopt"
            required
            rows={4}
            placeholder="Daily schedule, activity level, who will care for the pet…"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm text-ink-800">
            <input
              type="checkbox"
              name="agreeToContact"
              value="yes"
              required
              className="mt-1 accent-clay-600"
            />
            <span>
              I agree to be contacted by the Puppies for Adoption team about
              this application (email or phone).
            </span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-clay-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-clay-700 sm:w-auto"
      >
        Submit application
      </button>
    </form>
  );
}

export default function AdoptionForm(props: AdoptionFormProps) {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-cream-300 bg-white p-6 shadow-sm">
          <p className="text-ink-700">Loading application form…</p>
        </div>
      }
    >
      <AdoptionFormInner {...props} />
    </Suspense>
  );
}
