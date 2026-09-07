import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-cream-300 bg-ink-900 text-cream-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold text-white">Øf</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream-300">
            Helping people and pets find each other — with care, warmth, and a
            forever home in mind.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-cream-200">
            Explore
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/browse" className="hover:text-white">
                Browse pets
              </Link>
            </li>
            <li>
              <Link href="/breeds" className="hover:text-white">
                Breed encyclopedia
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="hover:text-white">
                How adoption works
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About Øf
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-cream-200">
            Get in touch
          </h2>
          <p className="mt-3 text-sm text-cream-300">hello@of-pets.example</p>
          <p className="mt-1 text-sm text-cream-300">Douala, Cameroon</p>
        </div>
      </div>
      <div className="border-t border-ink-800 py-4 text-center text-xs text-cream-300/80">
        © {new Date().getFullYear()} Øf. Made with care for animals everywhere.
      </div>
    </footer>
  );
}
