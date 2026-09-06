"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
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
      >
        <h3 className="font-display text-2xl font-semibold text-sage-700">
          Message sent
        </h3>
        <p className="mt-2 text-ink-700">
          Thanks for reaching out. We will get back to you soon. (Demo only —
          no email was actually sent.)
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-cream-300 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink-800">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 outline-none focus:ring-2 focus:ring-clay-500/40"
          />
        </div>
        <div>
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
        <div>
          <label htmlFor="subject" className="mb-1 block text-sm font-medium text-ink-800">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            required
            className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 outline-none focus:ring-2 focus:ring-clay-500/40"
          />
        </div>
        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink-800">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 outline-none focus:ring-2 focus:ring-clay-500/40"
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 rounded-full bg-clay-600 px-5 py-3 text-sm font-semibold text-white hover:bg-clay-700"
      >
        Send message
      </button>
    </form>
  );
}
