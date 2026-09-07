"use client";

import Link from "next/link";
import {
  FormEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

const FORMSUBMIT_EMAIL = "michealgoege4@gmail.com";
const FORMSUBMIT_AJAX = `https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`;

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
  links?: { href: string; label: string }[];
};

type QuickReply = {
  id: string;
  label: string;
  keywords: string[];
  answer: string;
  links?: { href: string; label: string }[];
};

const QUICK_REPLIES: QuickReply[] = [
  {
    id: "adopt",
    label: "How do I adopt?",
    keywords: ["adopt", "adoption", "how", "process", "steps", "start"],
    answer:
      "Happy to help you bring a pup home! Browse our available dogs, find one that fits your life, then fill out a short application. We review each home carefully and usually reply within 2–3 business days. Ready when you are!",
    links: [
      { href: "/browse", label: "Browse pets" },
      { href: "/apply", label: "Start an application" },
      { href: "/how-it-works", label: "How it works" },
    ],
  },
  {
    id: "fees",
    label: "Fees & application",
    keywords: ["fee", "fees", "cost", "price", "application", "apply", "money"],
    answer:
      "Adoption fees help cover vaccines, spay/neuter, microchips, and care while pups wait for homes. Exact amounts are listed on each pet’s page. The application itself is free — just tell us about your household so we can make a great match.",
    links: [
      { href: "/apply", label: "Open application" },
      { href: "/how-it-works", label: "What to expect" },
    ],
  },
  {
    id: "location",
    label: "Where are you located?",
    keywords: ["location", "where", "california", "ca", "based", "area", "city"],
    answer:
      "We’re based in California and focus on finding forever homes for dogs and puppies across the state. If you’re nearby or can travel for meet-and-greets, we’d love to hear from you!",
  },
  {
    id: "contact",
    label: "Contact email",
    keywords: ["contact", "email", "reach", "phone", "call", "write"],
    answer: `You can reach our team anytime at ${FORMSUBMIT_EMAIL}. Prefer to leave a note right here? Tap “Leave a message” below and we’ll get back to you soon.`,
  },
  {
    id: "browse",
    label: "Browse pets",
    keywords: ["browse", "pets", "dogs", "puppies", "available", "see", "list"],
    answer:
      "Our current pups are waiting on the Browse page — you can filter by size, age, and more. Spot someone special? Open their profile and apply from there.",
    links: [{ href: "/browse", label: "Browse available pets" }],
  },
  {
    id: "breeds",
    label: "Breed guides",
    keywords: ["breed", "breeds", "guide", "type", "mix", "temperament"],
    answer:
      "Curious about personalities and energy levels? Our breed guides share friendly overviews so you can pick a match that fits your lifestyle — mixes welcome too!",
    links: [{ href: "/breeds", label: "Explore breed guides" }],
  },
];

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "bot",
  text: "Hi there! 👋 I’m the Puppies for Adoption helper. Ask a quick question or tap a topic below — or leave a message for our team.",
};

function matchReply(input: string): QuickReply | undefined {
  const q = input.toLowerCase().trim();
  if (!q) return undefined;
  let best: { reply: QuickReply; score: number } | undefined;
  for (const reply of QUICK_REPLIES) {
    let score = 0;
    for (const kw of reply.keywords) {
      if (q.includes(kw)) score += kw.length;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { reply, score };
    }
  }
  return best?.reply;
}

const inputClass =
  "w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-clay-500/40";

export default function LiveChat() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [draft, setDraft] = useState("");
  const [mode, setMode] = useState<"chat" | "message" | "sent">("chat");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    // Return focus to launcher after close
    requestAnimationFrame(() => openButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) {
      firstFocusRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mode, open]);

  function pushBot(reply: QuickReply) {
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${reply.id}-${Date.now()}`,
        role: "bot",
        text: reply.answer,
        links: reply.links,
      },
    ]);
  }

  function handleQuick(reply: QuickReply) {
    setMessages((prev) => [
      ...prev,
      { id: `user-${reply.id}-${Date.now()}`, role: "user", text: reply.label },
    ]);
    pushBot(reply);
  }

  function handleSendChat(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", text },
    ]);
    const matched = matchReply(text);
    if (matched) {
      pushBot(matched);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-fallback-${Date.now()}`,
          role: "bot",
          text: `I’m not sure about that one yet. Try a quick topic below, or leave a message for our team at ${FORMSUBMIT_EMAIL} — we’ll follow up personally.`,
        },
      ]);
    }
  }

  async function handleLeaveMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setSendError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    try {
      const res = await fetch(FORMSUBMIT_AJAX, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: "Website chat message",
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!res.ok) {
        throw new Error(`FormSubmit responded with ${res.status}`);
      }
      setMode("sent");
      form.reset();
    } catch {
      setSendError(
        "We couldn’t send that just now. Please email us directly or try again in a moment.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Puppies for Adoption chat"
          className="pointer-events-auto flex max-h-[min(32rem,calc(100dvh-5.5rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 shadow-xl shadow-ink-900/15"
        >
          <header className="flex items-center justify-between gap-2 bg-clay-600 px-4 py-3 text-white">
            <div>
              <p className="font-display text-lg font-semibold leading-tight">
                Puppies for Adoption chat
              </p>
              <p className="text-xs text-cream-100/90">
                Friendly FAQ · leave a message anytime
              </p>
            </div>
            <button
              ref={firstFocusRef}
              type="button"
              onClick={close}
              className="rounded-full p-1.5 text-white/90 transition hover:bg-white/15 hover:text-white"
              aria-label="Close chat"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </header>

          {mode === "sent" ? (
            <div className="flex flex-1 flex-col items-start gap-3 overflow-y-auto p-4" role="status">
              <div className="rounded-2xl border border-sage-500/30 bg-sage-500/10 p-4">
                <p className="font-display text-xl font-semibold text-sage-700">
                  Message sent
                </p>
                <p className="mt-2 text-sm text-ink-700">
                  Thanks! Your note is on its way to our team. We’ll reply to
                  the email you shared as soon as we can.
                </p>
                <p className="mt-2 text-xs text-ink-700/80">
                  First-time FormSubmit deliveries may ask you to confirm the
                  recipient inbox before messages arrive.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMode("chat")}
                className="rounded-full bg-sage-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sage-700"
              >
                Back to chat
              </button>
            </div>
          ) : mode === "message" ? (
            <form
              onSubmit={handleLeaveMessage}
              className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
            >
              <p className="text-sm text-ink-700">
                Leave a message and we’ll email you back. Sent to{" "}
                <span className="font-medium text-clay-700">
                  {FORMSUBMIT_EMAIL}
                </span>
                .
              </p>
              <div>
                <label htmlFor="chat-name" className="mb-1 block text-sm font-medium text-ink-800">
                  Name
                </label>
                <input
                  id="chat-name"
                  name="name"
                  required
                  autoComplete="name"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="chat-email" className="mb-1 block text-sm font-medium text-ink-800">
                  Email
                </label>
                <input
                  id="chat-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="chat-message" className="mb-1 block text-sm font-medium text-ink-800">
                  Message
                </label>
                <textarea
                  id="chat-message"
                  name="message"
                  required
                  rows={4}
                  className={inputClass}
                  placeholder="Questions about a pup, timing, or your home…"
                />
              </div>
              {/* Honeypot */}
              <input
                type="text"
                name="_honey"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              {sendError ? (
                <p className="text-sm text-clay-700" role="alert">
                  {sendError}
                </p>
              ) : null}
              <div className="mt-auto flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("chat");
                    setSendError(null);
                  }}
                  className="rounded-full border border-cream-300 bg-white px-4 py-2 text-sm font-medium text-ink-800 hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-full bg-clay-600 px-4 py-2 text-sm font-semibold text-white hover:bg-clay-700 disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Send message"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto p-3 sm:p-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "rounded-br-md bg-clay-600 text-white"
                          : "rounded-bl-md border border-cream-300 bg-white text-ink-800"
                      }`}
                    >
                      <p>{m.text}</p>
                      {m.links?.length ? (
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                          {m.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                className="inline-flex rounded-full bg-sage-500/15 px-2.5 py-1 text-xs font-semibold text-sage-700 hover:bg-sage-500/25"
                                onClick={close}
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-cream-300 bg-cream-100/80 px-3 py-2">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-700/70">
                  Quick topics
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleQuick(q)}
                      className="rounded-full border border-cream-300 bg-white px-2.5 py-1 text-xs font-medium text-ink-800 transition hover:border-sage-500/40 hover:bg-sage-500/10"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              <form
                onSubmit={handleSendChat}
                className="flex items-center gap-2 border-t border-cream-300 bg-white p-2.5"
              >
                <label htmlFor="chat-draft" className="sr-only">
                  Type a question
                </label>
                <input
                  id="chat-draft"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a question…"
                  className="min-w-0 flex-1 rounded-full border border-cream-300 bg-cream-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-clay-500/40"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-clay-600 px-3 py-2 text-sm font-semibold text-white hover:bg-clay-700"
                  aria-label="Send question"
                >
                  Send
                </button>
              </form>

              <div className="border-t border-cream-300 bg-cream-50 px-3 py-2">
                <button
                  type="button"
                  onClick={() => setMode("message")}
                  className="w-full rounded-full border border-sage-500/40 bg-sage-500/10 px-3 py-2 text-sm font-semibold text-sage-700 transition hover:bg-sage-500/20"
                >
                  Leave a message
                </button>
              </div>
            </>
          )}
        </div>
      ) : null}

      <button
        ref={openButtonRef}
        type="button"
        className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-clay-600 text-white shadow-lg shadow-clay-700/30 transition hover:bg-clay-700 focus-visible:ring-offset-cream-50"
        aria-label={open ? "Close chat" : "Open live chat"}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => {
          if (open) close();
          else {
            setOpen(true);
            setMode("chat");
          }
        }}
      >
        {open ? (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
