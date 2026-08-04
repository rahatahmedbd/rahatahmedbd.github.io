'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';

export default function WelcomeExperience() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center py-12 px-4">
      <Container size="lg">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Header */}
          <div className="mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-[var(--color-brand-primary)]/10">
              <span className="text-4xl">🌟</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-[var(--color-text-primary)] mb-6">
              Welcome to<br />Rahat&apos;s World
            </h1>
            
            <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Choose how you&apos;d like to explore my portfolio
            </p>
          </div>

          {/* Experience Options */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
            
            {/* Website Experience Card */}
            <Link href="/portfolio" className="group">
              <Card 
                variant="elevated" 
                className="h-full p-8 md:p-10 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-xl)] cursor-pointer border border-transparent hover:border-[var(--color-brand-primary)]/20"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-brand-primary)] text-white mb-6">
                      <span className="text-3xl">🌐</span>
                    </div>
                    
                    <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] mb-3">
                      Website Experience
                    </h2>
                    
                    <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
                      Browse my portfolio in a clean, modern, and premium way. 
                      Perfect for quick exploration and website orders.
                    </p>
                  </div>

                  <div className="mt-auto">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="w-full group-hover:bg-[var(--color-brand-primary-dark)]"
                    >
                      Enter Website Experience
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>

            {/* RahatVerse Card */}
            <Link href="/rahatverse" className="group">
              <Card 
                variant="elevated" 
                className="h-full p-8 md:p-10 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-xl)] cursor-pointer border border-transparent hover:border-[var(--color-brand-primary)]/20"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-brand-secondary)] text-white mb-6">
                      <span className="text-3xl">🏙️</span>
                    </div>
                    
                    <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] mb-3">
                      RahatVerse
                    </h2>
                    
                    <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
                      Explore my portfolio inside an immersive 3D city experience. 
                      Every location tells a different part of my story.
                    </p>
                  </div>

                  <div className="mt-auto">
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="w-full"
                    >
                      Enter RahatVerse
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <p className="text-sm text-[var(--color-text-tertiary)]">
              Both experiences showcase the same information in different ways.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
