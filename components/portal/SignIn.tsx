"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

// Officers sign in with the same email and password they use in the app. The portal then reads
// their own org; what they can see and change is what their role allows in the app.

function Frame({ title, line, children }: { title: string; line: string; children?: React.ReactNode }) {
  return (
    <div className="pt-auth">
      <div className="pt-auth-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pt-logo-light" src="/kit/lockup-on-ivory.png" alt="Chapter Room" height={24} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pt-logo-dark" src="/kit/lockup-on-emerald.png" alt="" aria-hidden="true" height={24} />
        <h1>{title}</h1>
        <p>{line}</p>
        {children}
      </div>
    </div>
  );
}

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const sb = supabase();
    if (!sb) return;
    setBusy(true);
    setError(null);
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    // On success the provider hears the new session and loads the org.
    if (!error) return;
    if (error.message === "Invalid login credentials") setError("That email and password don’t match an account.");
    else if (/fetch|network/i.test(error.message)) setError("Couldn’t reach Chapter Room. Check your connection and try again.");
    else setError(error.message);
  };

  return (
    <Frame title="Officer portal" line="Sign in with your Chapter Room app account.">
      <form className="pt-auth-form" onSubmit={submit}>
        <label className="pt-field">
          <span className="pt-stat-label">Email</span>
          <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="pt-field">
          <span className="pt-stat-label">Password</span>
          <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && (
          <p className="pt-auth-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="pt-btn" data-kind="primary" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <a href="/" className="pt-back">
        ← joinchapterroom.com
      </a>
    </Frame>
  );
}

export function AccessNote({ message, onSignOut }: { message: string; onSignOut: () => void }) {
  return (
    <Frame title="Can’t open the portal" line={message}>
      <button type="button" className="pt-btn" data-kind="plain" onClick={onSignOut}>
        Sign out
      </button>
    </Frame>
  );
}
