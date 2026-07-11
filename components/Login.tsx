"use client";

import { useState } from "react";
import { sendMagicLink, signInWithGoogle } from "@/lib/auth";
import Footer from "@/components/Footer";

type Status = "idle" | "sending" | "sent" | "error";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 009 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 013.68 9c0-.59.1-1.17.27-1.7V4.97H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("sending");
    try {
      await sendMagicLink(email.trim());
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Bir şeyler ters gitti.");
    }
  }

  async function handleGoogleSignIn() {
    setStatus("sending");
    try {
      await signInWithGoogle();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Bir şeyler ters gitti.");
    }
  }

  if (status === "sent") {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--app-bg)] text-[var(--text-primary)] p-6">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-[var(--accent)]" />
          <span className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
            Tally
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-sm text-center space-y-2">
            <p className="text-lg font-medium">E-postanı kontrol et</p>
            <p className="text-sm text-[var(--text-muted)]">
              {email} adresine bir giriş linki gönderdik. Linke tıklayınca Tally&apos;ye giriş
              yapmış olacaksın.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--app-bg)] text-[var(--text-primary)] p-6">
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-[var(--accent)]" />
        <span className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
          Tally
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div className="text-center space-y-2 mb-2">
            <h1 className="text-2xl font-semibold tracking-tight">Tally</h1>
            <p className="text-sm text-[var(--text-muted)] max-w-xs mx-auto">
              Aboneliklerinin ne kadar tuttuğunu gör, kısa seanslarla odaklanma sürene sahip çık.
            </p>
          </div>

          <div className="space-y-3 py-2">
            <div className="flex items-start gap-3">
              <span className="text-base leading-none mt-0.5" aria-hidden="true">
                💳
              </span>
              <p className="text-sm text-[var(--text-muted)] text-left">
                Aboneliklerini ekle, aylık ne kadar gittiğini tek ekranda gör
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-base leading-none mt-0.5" aria-hidden="true">
                ⏱️
              </span>
              <p className="text-sm text-[var(--text-muted)] text-left">
                25 dakikalık odaklanma seanslarıyla zamanına sahip çık
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={status === "sending"}
            className="w-full flex items-center justify-center gap-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg py-2.5 text-sm font-medium hover:border-[var(--input-border-focus)] disabled:opacity-50"
          >
            <GoogleIcon />
            Google ile devam et
          </button>

          <div className="flex items-center gap-3 text-xs text-[var(--text-faint)]">
            <div className="flex-1 h-px bg-[var(--card-border)]" />
            veya
            <div className="flex-1 h-px bg-[var(--card-border)]" />
          </div>

          <p className="text-sm text-[var(--text-muted)] text-center">
            Devam etmek için e-postanı gir
          </p>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@eposta.com"
            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2.5 text-sm placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--input-border-focus)]"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-[var(--cta-bg)] text-[var(--cta-text)] rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {status === "sending" ? "Gönderiliyor..." : "Giriş linki gönder"}
          </button>
          {status === "error" && (
            <p className="text-sm text-[var(--danger)] text-center">{errorMessage}</p>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
}
