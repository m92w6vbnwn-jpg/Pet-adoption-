import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Application received",
  description: "Thank you — your adoption application was received.",
};

export default function ApplyThanksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div
        className="mx-auto max-w-xl rounded-2xl border border-sage-500/30 bg-sage-500/10 p-8 text-center"
        role="status"
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-sage-700">
          Thank you
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          Application received
        </h1>
        <p className="mt-4 text-ink-700">
          We got your adoption application and will review it shortly. Our team
          typically reaches out within 2–3 business days at the email or phone
          you provided.
        </p>
        <p className="mt-3 text-sm text-ink-700">
          Questions in the meantime?{" "}
          <a
            className="font-medium text-clay-700 hover:text-clay-600"
            href="mailto:michealgoege4@gmail.com"
          >
            michealgoege4@gmail.com
          </a>
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/browse"
            className="rounded-full bg-clay-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-clay-700"
          >
            Browse more pets
          </Link>
          <Link
            href="/"
            className="rounded-full border border-cream-300 bg-white px-5 py-2.5 text-sm font-semibold text-ink-800 hover:bg-cream-100"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
