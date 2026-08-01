"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  Search,
  Users,
  ShoppingBag,
  Briefcase,
  Star,
  FileText,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Reveal } from "@/components/ui/reveal";

interface SearchResultsProps {
  query: string;
  clients: any[];
  orders: any[];
  portfolio: any[];
  testimonials: any[];
  invoices: any[];
  faqs: any[];
}

export function SearchResults({
  query,
  clients,
  orders,
  portfolio,
  testimonials,
  invoices,
  faqs,
}: SearchResultsProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [typedQuery, setTypedQuery] = useState(query);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedQuery.trim().length >= 2) {
      router.push(`/admin/search?q=${encodeURIComponent(typedQuery.trim())}`);
    }
  };

  const totalResults =
    clients.length +
    orders.length +
    portfolio.length +
    testimonials.length +
    invoices.length +
    faqs.length;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div>
          <h1 className="text-display-sm font-bold tracking-tight">
            <span className="text-gradient">গ্লোবাল সার্চ (Global Advanced Search)</span>
          </h1>
          <p className="text-sm text-fg-soft mt-1">
            সুপার এডমিন ডাটাবেসের সমস্ত ক্লায়েন্ট, ইনভয়েস, প্রজেক্ট, টেস্টিমোনিয়াল এবং অর্ডার্স এক জায়গা থেকে সার্চ করুন।
          </p>
        </div>
      </Reveal>

      {/* Search Input bar */}
      <Reveal delay={60}>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-fg-muted" />
          <input
            type="text"
            value={typedQuery}
            onChange={(e) => setTypedQuery(e.target.value)}
            placeholder="Type search terms (minimum 2 characters)..."
            className="w-full h-12 pl-12 pr-4 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all"
          />
        </form>
      </Reveal>

      {/* Search results stats */}
      {query && (
        <Reveal delay={100}>
          <p className="text-xs text-fg-muted uppercase tracking-wider font-semibold">
            Found {totalResults} match{totalResults !== 1 ? "es" : ""} for &quot;
            <span className="text-brand-500 font-bold">{query}</span>&quot;
          </p>
        </Reveal>
      )}

      {/* Grid of Results */}
      <div className="space-y-8">
        {/* 1. Clients Block */}
        {clients.length > 0 && (
          <Reveal delay={140}>
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-fg-muted flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-500" />
                Matching Clients ({clients.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clients.map((c) => (
                  <div key={c.id} className="card-surface p-4 rounded-2xl border border-border/10 bg-surface/30 backdrop-blur flex items-center justify-between">
                    <div>
                      <p className="font-bold text-fg text-sm">{c.full_name || "Guest Client"}</p>
                      <p className="text-xs text-fg-soft">{c.email}</p>
                    </div>
                    <a href="/admin/clients" className="p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-lg">
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* 2. Orders Block */}
        {orders.length > 0 && (
          <Reveal delay={180}>
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-fg-muted flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-brand-500" />
                Matching Orders ({orders.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {orders.map((o) => (
                  <div key={o.id} className="card-surface p-4 rounded-2xl border border-border/10 bg-surface/30 backdrop-blur flex items-center justify-between">
                    <div>
                      <p className="font-mono font-bold text-brand-500 text-sm">{o.reference}</p>
                      <p className="text-xs font-bold text-fg mt-0.5">{o.website_type}</p>
                      <p className="text-[10px] text-fg-soft">Client: {o.client_info?.fullName}</p>
                    </div>
                    <a href={`/admin/orders?ref=${o.reference}`} className="p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-lg">
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* 3. Portfolio Block */}
        {portfolio.length > 0 && (
          <Reveal delay={220}>
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-fg-muted flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-brand-500" />
                Matching Portfolio ({portfolio.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolio.map((p) => (
                  <div key={p.id} className="card-surface p-4 rounded-2xl border border-border/10 bg-surface/30 backdrop-blur flex items-center justify-between">
                    <div>
                      <p className="font-bold text-fg text-sm">{p.title}</p>
                      <p className="text-[10px] text-brand-500 font-mono mt-0.5">Slug: /{p.slug}</p>
                    </div>
                    <a href="/admin/portfolio" className="p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-lg">
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* 4. Testimonials Block */}
        {testimonials.length > 0 && (
          <Reveal delay={260}>
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-fg-muted flex items-center gap-2">
                <Star className="h-4 w-4 text-brand-500" />
                Matching Testimonials ({testimonials.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="card-surface p-4 rounded-2xl border border-border/10 bg-surface/30 backdrop-blur flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-bold text-fg text-sm">{t.author_name}</p>
                      <p className="text-xs text-fg-soft truncate leading-relaxed mt-0.5">&ldquo;{t.content}&rdquo;</p>
                    </div>
                    <a href="/admin/testimonials" className="p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-lg shrink-0">
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* 5. Invoices Block */}
        {invoices.length > 0 && (
          <Reveal delay={300}>
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-fg-muted flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-500" />
                Matching Invoices ({invoices.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {invoices.map((i) => (
                  <div key={i.id} className="card-surface p-4 rounded-2xl border border-border/10 bg-surface/30 backdrop-blur flex items-center justify-between">
                    <div>
                      <p className="font-mono font-bold text-fg text-sm">{i.number}</p>
                      <p className="text-xs text-brand-500 font-bold mt-0.5">Amount: ${i.amount}</p>
                      <p className="text-[10px] text-fg-muted">Status: {i.status}</p>
                    </div>
                    <a href="/admin/invoices" className="p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-lg">
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* 6. FAQs Block */}
        {faqs.length > 0 && (
          <Reveal delay={340}>
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-fg-muted flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-brand-500" />
                Matching FAQs ({faqs.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {faqs.map((f) => (
                  <div key={f.id} className="card-surface p-4 rounded-2xl border border-border/10 bg-surface/30 backdrop-blur flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-bold text-fg text-sm">{f.question}</p>
                      <p className="text-xs text-fg-soft truncate mt-0.5">{f.answer}</p>
                    </div>
                    <a href="/admin/faq" className="p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-lg shrink-0">
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {query && totalResults === 0 && (
          <Reveal direction="fade">
            <div className="card-surface border border-border/10 rounded-3xl bg-surface/10 p-12 text-center text-fg-muted italic text-sm">
              <Compass className="h-10 w-10 text-border mx-auto mb-3" />
              কোনো তথ্য পাওয়া যায়নি। একটু অন্য শব্দ দিয়ে পুনরায় ট্রাই করুন।
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
