"use client";

import { useState, useActionState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import TieflingLogo from "@/components/TieflingLogo";
import { signUpCustomer } from "@/app/actions/auth";

type Mode = "signin" | "signup";

// ── Google button ────────────────────────────────────────────────────────────

function GoogleButton({ callbackUrl }: { callbackUrl: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => { setLoading(true); signIn("google", { callbackUrl }); }}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded border border-dungeon-purple/40
        bg-white text-dungeon-dark font-cinzel text-sm tracking-wider uppercase
        hover:bg-parchment transition-all duration-200 shadow-sm disabled:opacity-60"
    >
      {/* Google icon */}
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.3 0 24 0 14.7 0 6.7 5.4 2.8 13.3l7.8 6.1C12.5 13.1 17.8 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8C43.7 37.4 46.5 31.4 46.5 24.5z"/>
        <path fill="#FBBC05" d="M10.6 28.6A14.9 14.9 0 0 1 9.5 24c0-1.6.3-3.1.8-4.5l-7.8-6.1A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l8-6.1z"/>
        <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.2 1.5-5 2.4-8.4 2.4-6.2 0-11.5-4.2-13.4-9.9l-8 6.1C6.7 42.6 14.7 48 24 48z"/>
        <path fill="none" d="M0 0h48v48H0z"/>
      </svg>
      {loading ? "Redirecting…" : "Continue with Google"}
    </button>
  );
}

// ── Credentials sign-in form ─────────────────────────────────────────────────

function SignInForm({ callbackUrl }: { callbackUrl: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) {
      window.location.href = callbackUrl;
    } else {
      setError("Invalid email or password.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-cinzel text-xs tracking-widest uppercase text-parchment-dark/70 mb-1.5">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-dungeon-mid border border-dungeon-purple/50 rounded px-3 py-2.5
            text-parchment text-sm font-im-fell focus:outline-none focus:border-gold-rune/60 transition-colors"
          placeholder="adventurer@example.com"
        />
      </div>
      <div>
        <label className="block font-cinzel text-xs tracking-widest uppercase text-parchment-dark/70 mb-1.5">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-dungeon-mid border border-dungeon-purple/50 rounded px-3 py-2.5
            text-parchment text-sm font-im-fell focus:outline-none focus:border-gold-rune/60 transition-colors"
          placeholder="••••••••"
        />
      </div>
      {error && (
        <p className="font-im-fell text-dragon-crimson text-sm text-center">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full font-cinzel text-sm tracking-wider uppercase px-4 py-3 rounded
          bg-gold-rune text-dungeon-dark font-bold
          hover:bg-gold-bright transition-all duration-200
          shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

// ── Sign-up form ─────────────────────────────────────────────────────────────

function SignUpForm({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [state, action, pending] = useActionState(signUpCustomer, null);
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState("");

  // After successful registration, auto sign-in
  if (state?.success && state.email) {
    signIn("credentials", { email: state.email, password, redirect: false }).then((res) => {
      if (res?.ok) {
        onSuccess(state.email!);
      } else {
        setSignInError("Account created — please sign in.");
      }
    });
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block font-cinzel text-xs tracking-widest uppercase text-parchment-dark/70 mb-1.5">
          Name
        </label>
        <input
          name="name"
          type="text"
          required
          className="w-full bg-dungeon-mid border border-dungeon-purple/50 rounded px-3 py-2.5
            text-parchment text-sm font-im-fell focus:outline-none focus:border-gold-rune/60 transition-colors"
          placeholder="Your adventurer name"
        />
      </div>
      <div>
        <label className="block font-cinzel text-xs tracking-widest uppercase text-parchment-dark/70 mb-1.5">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          className="w-full bg-dungeon-mid border border-dungeon-purple/50 rounded px-3 py-2.5
            text-parchment text-sm font-im-fell focus:outline-none focus:border-gold-rune/60 transition-colors"
          placeholder="adventurer@example.com"
        />
      </div>
      <div>
        <label className="block font-cinzel text-xs tracking-widest uppercase text-parchment-dark/70 mb-1.5">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-dungeon-mid border border-dungeon-purple/50 rounded px-3 py-2.5
            text-parchment text-sm font-im-fell focus:outline-none focus:border-gold-rune/60 transition-colors"
          placeholder="Min. 8 characters"
        />
      </div>
      {(state?.error || signInError) && (
        <p className="font-im-fell text-dragon-crimson text-sm text-center">
          {state?.error ?? signInError}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full font-cinzel text-sm tracking-wider uppercase px-4 py-3 rounded
          bg-gold-rune text-dungeon-dark font-bold
          hover:bg-gold-bright transition-all duration-200
          shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}

// ── Inner content (uses useSearchParams) ────────────────────────────────────

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account";
  const [mode, setMode] = useState<Mode>("signin");

  return (
    <>
      <p className="font-im-fell italic text-parchment-dark/60 text-sm mt-1">
        {mode === "signin" ? "Welcome back, adventurer." : "Join the party."}
      </p>

      {/* Card */}
      <div className="bg-dungeon-dark rounded-2xl border border-dungeon-purple/40 p-8 mt-6"
        style={{ boxShadow: "0 0 40px rgba(74,45,110,0.3)" }}>

        {/* Mode toggle */}
        <div className="flex rounded-lg border border-dungeon-purple/40 overflow-hidden mb-6">
          {(["signin", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 font-cinzel text-xs tracking-widest uppercase py-2.5 transition-all duration-200
                ${mode === m
                  ? "bg-dungeon-purple text-parchment"
                  : "text-parchment-dark/60 hover:text-parchment-dark"
                }`}
            >
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Google */}
        <GoogleButton callbackUrl={callbackUrl} />

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-dungeon-purple/40" />
          <span className="font-cinzel text-xs tracking-widest uppercase text-parchment-dark/40">or</span>
          <div className="flex-1 h-px bg-dungeon-purple/40" />
        </div>

        {/* Credentials form */}
        {mode === "signin" ? (
          <SignInForm callbackUrl={callbackUrl} />
        ) : (
          <SignUpForm onSuccess={() => { window.location.href = callbackUrl; }} />
        )}

        {/* Admin link */}
        <p className="text-center font-im-fell italic text-parchment-dark/40 text-xs mt-6">
          Staff?{" "}
          <Link href="/admin/login" className="underline hover:text-parchment-dark/70 transition-colors">
            Admin portal
          </Link>
        </p>
      </div>
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-dungeon-black flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-2">
          <TieflingLogo size={72} />
          <h1 className="font-cinzel-decorative text-gold-rune text-2xl font-black mt-4">
            Draughts &amp; Dragons
          </h1>
        </div>
        <Suspense fallback={<div className="mt-6 h-96 rounded-2xl bg-dungeon-dark border border-dungeon-purple/40 animate-pulse" />}>
          <SignInContent />
        </Suspense>
      </div>
    </div>
  );
}
