"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useSignIn } from "@clerk/nextjs/legacy";
import { ArrowRight, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEFAULT_ERROR = "Unable to sign in. Check your details and try again.";

function getClerkError(error: unknown) {
  if (isClerkAPIResponseError(error)) {
    return error.errors[0]?.longMessage ?? error.errors[0]?.message ?? DEFAULT_ERROR;
  }

  return DEFAULT_ERROR;
}

export default function CustomSignIn() {
  const router = useRouter();
  const { isLoaded, setActive, signIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handlePasswordSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoaded || !signIn) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
        strategy: "password",
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.push("/");
        return;
      }

      setError("This sign-in needs another verification step.");
    } catch (err) {
      setError(getClerkError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded || !signIn) {
      return;
    }

    setError("");
    setIsGoogleLoading(true);

    try {
      await signIn.authenticateWithRedirect({
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
        strategy: "oauth_google",
      });
    } catch (err) {
      setError(getClerkError(err));
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Button
        className="h-10 w-full justify-center gap-2"
        disabled={!isLoaded || isGoogleLoading || isSubmitting}
        onClick={handleGoogleSignIn}
        type="button"
        variant="outline"
      >
        <span className="text-sm font-semibold">G</span>
        {isGoogleLoading ? "Opening Google..." : "Continue with Google"}
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form className="space-y-4" onSubmit={handlePasswordSignIn}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" />
            <Input
              autoComplete="email"
              className="h-10 pl-8"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" />
            <Input
              autoComplete="current-password"
              className="h-10 pl-8"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </div>
        </div>

        {error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button
          className="h-10 w-full justify-center gap-2"
          disabled={!isLoaded || isSubmitting || isGoogleLoading}
          type="submit"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
          <ArrowRight />
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link className="font-medium text-foreground underline" href="/sign-up">
          Create an account
        </Link>
      </p>
    </div>
  );
}
