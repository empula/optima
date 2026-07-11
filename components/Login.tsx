"use client";

import { useState } from "react";
import { sendMagicLink } from "@/lib/auth";
import Footer from "@/components/Footer";

type Status = "idle" | "sending" | "sent" | "error";

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

  if (status === "sent") {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--app-bg)] text-[var(--text-primary)] p-6">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-[var(--accent)]" />
          <span className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
            Optima
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-sm text-center space-y-2">
            <p className="text-lg font-medium">E-postanı kontrol et</p>
            <p className="text-sm text-[var(--text-muted)]">
              {email} adresine bir giriş linki gönderdik. Linke tıklayınca Optima&apos;ya giriş
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
          Optima
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div className="text-center space-y-1 mb-2">
            <h1 className="text-2xl font-semibold tracking-tight">Optima</h1>
            <p className="text-sm text-[var(--text-muted)]">Devam etmek için e-postanı gir</p>
          </div>
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
