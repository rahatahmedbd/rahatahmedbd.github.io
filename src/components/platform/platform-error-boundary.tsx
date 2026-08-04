"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface PlatformErrorBoundaryProps {
  children: ReactNode;
}

interface PlatformErrorBoundaryState {
  hasError: boolean;
}

/** Keeps a WebGL or route-level rendering failure from taking down the platform. */
export class PlatformErrorBoundary extends Component<
  PlatformErrorBoundaryProps,
  PlatformErrorBoundaryState
> {
  public state: PlatformErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): PlatformErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep production output quiet while retaining a useful diagnostic in devtools.
    console.error("Platform experience failed to render", error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-6 py-20 text-center text-[var(--color-text-primary)]">
        <div className="max-w-md">
          <div className="mb-6 text-5xl" aria-hidden="true">
            ⚡
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">This experience needs a reset</h1>
          <p className="mt-4 text-[var(--color-text-secondary)]">
            Something interrupted the current view. Your saved preferences and tour progress are
            safe.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={this.handleRetry}>Try again</Button>
            <Link href="/portfolio">
              <Button variant="outline">Open Website Experience</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }
}
