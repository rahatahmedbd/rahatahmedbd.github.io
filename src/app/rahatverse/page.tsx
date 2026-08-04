'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';

export default function RahatVersePlaceholder() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center py-12 px-4">
      <Container size="md">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-[var(--color-brand-secondary)]/10">
            <span className="text-6xl">🏙️</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[var(--color-text-primary)] mb-6">
            RahatVerse
          </h1>
          
          <div className="mb-10">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[var(--color-warning)]/10 text-[var(--color-warning-dark)] text-sm font-medium mb-6">
              🚧 Coming Soon
            </div>
            
            <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed">
              RahatVerse is currently under construction.<br />
              An immersive 3D city experience will be available in a future update.
            </p>
          </div>

          {/* Info Card */}
          <Card variant="bordered" className="p-8 mb-10 text-left">
            <h3 className="font-semibold text-lg mb-3 text-[var(--color-text-primary)]">
              What to expect in RahatVerse
            </h3>
            <ul className="space-y-3 text-[var(--color-text-secondary)]">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-[var(--color-brand-primary)]">•</span>
                <span>Interactive 3D city navigation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-[var(--color-brand-primary)]">•</span>
                <span>Automatic vehicle tour through different locations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-[var(--color-brand-primary)]">•</span>
                <span>Zoom, rotate, and manual exploration</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-[var(--color-brand-primary)]">•</span>
                <span>AAA-quality cinematic experience</span>
              </li>
            </ul>
          </Card>

          {/* Back Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary" size="lg">
                ← Back to Welcome Screen
              </Button>
            </Link>
            
            <Link href="/portfolio">
              <Button variant="secondary" size="lg">
                Explore Website Experience Instead
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
