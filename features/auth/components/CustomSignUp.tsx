"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useSignUp } from "@clerk/nextjs/legacy";
import { ArrowRight, Briefcase, Lock, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEFAULT_ERROR = "Unable to create your account. Try again.";

function getClerkError(error: unknown) {
  if (isClerkAPIResponseError(error)) {
    return error.errors[0]?.longMessage ?? error.errors[0]?.message ?? DEFAULT_ERROR;
  }

  return DEFAULT_ERROR;
}

type SignUpStep = "details" | "verification";

export default function CustomSignUp() {
  const router = useRouter();
  const { isLoaded, setActive, signUp } = useSignUp();
  const [step, setStep] = useState<SignUpStep>("details");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const activateSession = async (sessionId: string) => {
    if (!setActive) {
      return;
    }

    await setActive({ session: sessionId });
    router.push("/");
  };

  const handleCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoaded || !signUp) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const result = await signUp.create({
        emailAddress: email,
        firstName,
        lastName,
        password,
        unsafeMetadata: currentRole.trim()
          ? { currentRole: currentRole.trim() }
          : undefined,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await activateSession(result.createdSessionId);
        return;
      }

      if (result.unverifiedFields.includes("email_address")) {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setStep("verification");
        return;
      }

      setError("This sign-up needs another verification step.");
    } catch (err) {
      setError(getClerkError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoaded || !signUp) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await activateSession(result.createdSessionId);
        return;
      }

      setError("The email code was accepted, but sign-up is not complete yet.");
    } catch (err) {
      setError(getClerkError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded || !signUp) {
      return;
    }

    setError("");
    setIsGoogleLoading(true);

    try {
      await signUp.authenticateWithRedirect({
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
        strategy: "oauth_google",
        unsafeMetadata: currentRole.trim()
          ? { currentRole: currentRole.trim() }
          : undefined,
      });
    } catch (err) {
      setError(getClerkError(err));
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {step === "details" ? (
        <>
          <Button
            className="h-10 w-full justify-center gap-2"
            disabled={!isLoaded || isGoogleLoading || isSubmitting}
            onClick={handleGoogleSignUp}
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

          <form className="space-y-4" onSubmit={handleCreateAccount}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" />
                  <Input
                    autoComplete="given-name"
                    className="h-10 pl-8"
                    id="first-name"
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                    value={firstName}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  autoComplete="family-name"
                  className="h-10"
                  id="last-name"
                  onChange={(event) => setLastName(event.target.value)}
                  required
                  value={lastName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-role">Current role</Label>
              <div className="relative">
                <Briefcase className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" />
                <Input
                  autoComplete="organization-title"
                  className="h-10 pl-8"
                  id="current-role"
                  onChange={(event) => setCurrentRole(event.target.value)}
                  placeholder="Software Engineer"
                  value={currentRole}
                />
              </div>
            </div>

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
                  autoComplete="new-password"
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
              {isSubmitting ? "Creating account..." : "Create account"}
              <ArrowRight />
            </Button>
          </form>
        </>
      ) : (
        <form className="space-y-4" onSubmit={handleVerifyEmail}>
          <div className="space-y-2">
            <Label htmlFor="verification-code">Email verification code</Label>
            <Input
              autoComplete="one-time-code"
              className="h-10"
              id="verification-code"
              inputMode="numeric"
              onChange={(event) => setVerificationCode(event.target.value)}
              placeholder="123456"
              required
              value={verificationCode}
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button
            className="h-10 w-full justify-center gap-2"
            disabled={!isLoaded || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Verifying..." : "Verify email"}
            <ArrowRight />
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-medium text-foreground underline" href="/sign-in">
          Sign in
        </Link>
      </p>
    </div>
  );
}
