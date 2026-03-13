"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import TieflingLogo from "@/components/TieflingLogo";

const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: "Could not start the sign-in flow. Please try again.",
  OAuthCallback: "Something went wrong during sign-in. Please try again.",
  OAuthCreateAccount: "Could not create an account with this provider.",
  EmailCreateAccount: "Could not create an account with this email.",
  Callback: "Something went wrong. Please try again.",
  OAuthAccountNotLinked:
    "This email is already registered with a different sign-in method. Please use the original method.",
  CredentialsSignin: "Invalid email or password.",
  default: "An unexpected error occurred. Please try again.",
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "default";
  const message = ERROR_MESSAGES[error] ?? ERROR_MESSAGES.default;

  return (
    <div className="bg-dungeon-dark rounded-2xl border border-dragon-red/30 p-8"
      style={{ boxShadow: "0 0 40px rgba(139,26,26,0.2)" }}>
      <p className="font-im-fell italic text-parchment-dark text-lg leading-relaxed mb-6">
        {message}
      </p>
      <Link
        href="/auth/signin"
        className="inline-block font-cinzel text-sm tracking-wider uppercase px-8 py-3 rounded
          bg-gold-rune text-dungeon-dark font-bold
          hover:bg-gold-bright transition-all duration-200"
      >
        Back to Sign In
      </Link>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-dungeon-black flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex flex-col items-center mb-8">
          <TieflingLogo size={72} />
          <h1 className="font-cinzel-decorative text-dragon-crimson text-2xl font-black mt-4">
            A Curse Has Struck
          </h1>
        </div>
        <Suspense fallback={<div className="h-32 rounded-2xl bg-dungeon-dark border border-dragon-red/30 animate-pulse" />}>
          <ErrorContent />
        </Suspense>
      </div>
    </div>
  );
}
