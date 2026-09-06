"use client";

import { FormEvent, useState } from "react";

export default function AdoptionForm({ petName }: { petName: string }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="rounded-2xl border border-sage-500/30 bg-sage-500/10 p-6"
        role="status"
        aria-live="polite"
      >
        <h3 className="font-display text-2xl font-semibold text-sage-700">
          Application received
        </h3>
        <p className="mt-2 text-ink-700">
          Thank you for applying to adopt <strong>{petName}</strong>. Our team
          will review your application and reach out within 2–3 business days.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-cream-300 bg-white p-6 shadow-sm"
      noValidate={false}
    >
      <h3 className="font-display text-2xl font-semibold text-ink-900">
        Apply to adopt {petName}
      </h3>
      <p className="mt-2 text-sm text-ink-700">
        Tell us a little about your home. This is a demo form — nothing is sent
        to a server.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-ink-800">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 outline-none focus:ring-2 focus:ring-clay-500/40"
          />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink-800">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 outline-none focus:ring-2 focus:ring-clay-500/40"
          />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-ink-800">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 outline-none focus:ring-2 focus:ring-clay-500/40"
          />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="city" className="mb-1 block text-sm font-medium text-ink-800">
            City
          </label>
          <input
            id="city"
            name="city"
            required
            className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 outline-none focus:ring-2 focus:ring-clay-500/40"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="housing" className="mb-1 block text-sm font-medium text-ink-800">
            Housing type
          </label>
          <select
            id="housing"
            name="housing"
            required
            className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 outline-none focus:ring-2 focus:ring-clay-500/40"
            defaultValue=""
          >
            <option value="" disabled>
              Select…
            </option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="shared">Shared housing</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink-800">
            Why do you want to adopt {petName}?
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 outline-none focus:ring-2 focus:ring-clay-500/40"
          />
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
