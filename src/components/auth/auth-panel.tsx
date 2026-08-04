"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePlatformAuth } from "@/hooks/use-platform-auth";

interface AuthPanelProps {
  title?: string;
  description?: string;
  mode?: "full" | "compact";
}

export function AuthPanel({
  title = "Sign in to Rahat Platform",
  description = "Use your email to access protected admin and client tools.",
  mode = "full",
}: AuthPanelProps) {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/dashboard";
  const auth = usePlatformAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectUrl = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return `${window.location.origin}${nextPath}`;
  }, [nextPath]);

  const handleMagicLink = async () => {
    if (!auth.client || !email) return;
    setIsSubmitting(true);
    setStatus("");
    const { error } = await auth.client.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    setStatus(error ? error.message : "Magic link sent. Check your inbox to continue.");
    setIsSubmitting(false);
  };

  const handlePasswordSignIn = async () => {
    if (!auth.client || !email || !password) return;
    setIsSubmitting(true);
    setStatus("");
    const { error } = await auth.client.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Signed in successfully.");
      await auth.refresh();
      window.location.assign(nextPath);
    }
    setIsSubmitting(false);
  };

  const handlePasswordSignUp = async () => {
    if (!auth.client || !email || !password) return;
    setIsSubmitting(true);
    setStatus("");
    const { error } = await auth.client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    setStatus(error ? error.message : "Account created. Confirm your email if required, then sign in.");
    setIsSubmitting(false);
  };

  if (auth.isLoading) {
    return <Card className="p-6">Checking secure session…</Card>;
  }

  if (!auth.isConfigured) {
    return (
      <Card variant="bordered" className="p-6">
        <h2 className="text-xl font-semibold">Authentication is not configured</h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{auth.error}</p>
      </Card>
    );
  }

  if (auth.user) {
    return (
      <Card variant="bordered" className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-[var(--color-text-tertiary)]">Signed in as</div>
            <div className="font-semibold">{auth.user.email}</div>
          </div>
          <Button variant="outline" onClick={auth.signOut}>
            Sign out
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className={mode === "compact" ? "p-5" : "p-8"}>
      <div className="mb-6">
        <h1 className={mode === "compact" ? "text-2xl font-semibold" : "text-4xl font-semibold"}>
          {title}
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">{description}</p>
      </div>

      <div className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password (optional for magic link)"
          autoComplete="current-password"
        />
        {status && <p className="text-sm text-[var(--color-text-secondary)]">{status}</p>}
        <div className="grid gap-3 sm:grid-cols-3">
          <Button onClick={handleMagicLink} disabled={isSubmitting || !email}>
            Magic link
          </Button>
          <Button
            variant="outline"
            onClick={handlePasswordSignIn}
            disabled={isSubmitting || !email || !password}
          >
            Sign in
          </Button>
          <Button
            variant="secondary"
            onClick={handlePasswordSignUp}
            disabled={isSubmitting || !email || !password}
          >
            Create account
          </Button>
        </div>
      </div>
    </Card>
  );
}
