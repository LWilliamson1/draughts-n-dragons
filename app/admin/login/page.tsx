"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import TieflingLogo from "@/components/TieflingLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials. Try again.");
      setLoading(false);
    } else {
      router.push("/admin/events");
    }
  }

  return (
    <div className="min-h-screen bg-dungeon-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <TieflingLogo size={80} />
          <h1 className="font-cinzel-decorative text-gold-rune text-2xl font-black mt-4">
            Admin Portal
          </h1>
          <p className="font-im-fell italic text-parchment-dark opacity-50 text-sm mt-1">
            Draughts &amp; Dragons
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-dungeon-dark border border-dungeon-purple rounded-xl p-8 space-y-5"
          style={{ boxShadow: "0 0 40px rgba(74,45,110,0.3)" }}
        >
          <div>
            <label className="block font-cinzel text-xs tracking-widest text-parchment-dark opacity-70 uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-dungeon-black border border-dungeon-purple rounded-lg px-4 py-2.5
                text-parchment font-im-fell focus:outline-none focus:border-gold-rune transition-colors"
            />
          </div>

          <div>
            <label className="block font-cinzel text-xs tracking-widest text-parchment-dark opacity-70 uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-dungeon-black border border-dungeon-purple rounded-lg px-4 py-2.5
                text-parchment font-im-fell focus:outline-none focus:border-gold-rune transition-colors"
            />
          </div>

          {error && (
            <p className="font-im-fell text-dragon-crimson text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-cinzel text-sm tracking-wider uppercase py-3 rounded-lg
              bg-gold-rune text-dungeon-dark font-bold
              hover:bg-gold-bright disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            {loading ? "Entering…" : "Enter the Keep"}
          </button>
        </form>
      </div>
    </div>
  );
}
