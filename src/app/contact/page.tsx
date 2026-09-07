import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Øf pet adoption team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-semibold text-ink-900">
            Contact
          </h1>
          <p className="mt-3 text-lg text-ink-700">
            Questions about a pet, partnership ideas, or adoption support? Send
            us a note — we would love to hear from you.
          </p>
          <dl className="mt-8 space-y-4 text-ink-700">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-700/70">
                Email
              </dt>
              <dd className="mt-1">hello@of-pets.example</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-700/70">
                Location
              </dt>
              <dd className="mt-1">California, United States</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-700/70">
                Hours
              </dt>
              <dd className="mt-1">Mon–Fri, 9:00–17:00 (PT)</dd>
            </div>
          </dl>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
