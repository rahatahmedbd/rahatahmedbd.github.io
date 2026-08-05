"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  title: string;
  price: string;
  time: string;
  desc: string;
}

export function ServiceCard({ title, price, time, desc }: ServiceCardProps) {
  return (
    <div className="group flex flex-col border border-transparent p-7 premium-hover hover:border-[color-mix(in_srgb,var(--color-brand-primary)_22%,transparent)] hover:shadow-[var(--shadow-xl)] rounded-2xl bg-[var(--color-surface)]">
      <div>
        <div className="font-semibold text-[21px] leading-tight tracking-[-0.3px] mb-2 group-hover:text-[var(--color-brand-primary)] transition-colors">
          {title}
        </div>
        <div className="text-[28px] font-semibold tracking-[-0.5px] text-[var(--color-brand-primary)] mb-1">
          {price}
        </div>
        <div className="text-xs tracking-[0.6px] uppercase text-[var(--color-text-tertiary)] mb-4">
          Delivery: {time}
        </div>
        <p className="text-[var(--color-text-secondary)] text-[14.5px] leading-relaxed">
          {desc}
        </p>
      </div>

      <div className="mt-auto pt-7">
        <Link href="/order">
          <Button
            variant="outline"
            className="w-full group-hover:bg-[var(--color-brand-primary)] group-hover:text-white group-hover:border-[var(--color-brand-primary)] transition-all"
          >
            Choose This Service →
          </Button>
        </Link>
      </div>
    </div>
  );
}
