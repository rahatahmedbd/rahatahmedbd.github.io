"use client";

import { useState } from "react";
import {
  Users,
  Search,
  X,
  User,
  Mail,
  Phone,
  DollarSign,
  Briefcase,
  Layers,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Reveal } from "@/components/ui/reveal";

interface Client {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  role_id: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  totalSpend: number;
  totalOrders: number;
  activeProjects: number;
}

interface ClientsDatabaseProps {
  initialClients: Client[];
}

export function ClientsDatabase({ initialClients }: ClientsDatabaseProps) {
  const { t, lang } = useLanguage();
  const [clients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState("");

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Filter Logic
  const filteredClients = clients.filter(
    (cl) =>
      cl.email.toLowerCase().includes(search.toLowerCase()) ||
      (cl.full_name && cl.full_name.toLowerCase().includes(search.toLowerCase())) ||
      (cl.phone && cl.phone.includes(search))
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return lang === "bn"
      ? d.toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })
      : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div>
          <h1 className="text-display-sm font-bold tracking-tight">
            <span className="text-gradient">ক্লায়েন্ট ডাটাবেস (Client Base CRM)</span>
          </h1>
          <p className="text-sm text-fg-soft mt-1">
            আপনার প্ল্যাটফর্মে নিবন্ধিত সমস্ত ক্লায়েন্ট অ্যাকাউন্ট, তাদের মোট অর্ডারের সংখ্যা এবং মোট খরচের পরিমাণ পরিচালনা করুন।
          </p>
        </div>
      </Reveal>

      {/* Filter and Search */}
      <Reveal delay={60}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-fg-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client database by name, email or phone..."
            className="w-full h-12 pl-12 pr-4 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all"
          />
        </div>
      </Reveal>

      {/* Table view */}
      <Reveal delay={120}>
        <div className="card-surface rounded-3xl border border-border/10 bg-surface/20 shadow-lift overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/10 bg-canvas/30 text-fg-muted uppercase tracking-wider font-semibold text-xs">
                  <th className="p-4 pl-6">Client Profile</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Role Tag</th>
                  <th className="p-4">Orders</th>
                  <th className="p-4">Total Spending</th>
                  <th className="p-4 pr-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/5 text-fg-soft">
                {filteredClients.length > 0 ? (
                  filteredClients.map((cl) => (
                    <tr key={cl.id} className="hover:bg-canvas-muted/10 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-full bg-canvas-muted border border-border/10 flex items-center justify-center font-bold text-brand-500 text-sm">
                            {cl.avatar_url ? (
                              <img src={cl.avatar_url} alt={cl.full_name || ""} className="h-full w-full object-cover" />
                            ) : (
                              cl.full_name?.slice(0, 2).toUpperCase() || <User className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-fg">{cl.full_name || "Guest Client"}</p>
                            <p className="text-xs text-fg-muted">Joined {formatDate(cl.created_at).split(" ")[0]}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-fg">{cl.email}</p>
                        <p className="text-xs text-fg-muted">{cl.phone || "No phone recorded"}</p>
                      </td>
                      <td className="p-4">
                        <span className="inline-block bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border border-brand-500/10 capitalize">
                          {cl.role_id?.replace(/_/g, " ") || cl.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-fg">{cl.totalOrders} order(s)</p>
                        <p className="text-xs text-emerald-500 font-medium">{cl.activeProjects} active</p>
                      </td>
                      <td className="p-4 font-mono font-bold text-fg">
                        ${cl.totalSpend}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => setSelectedClient(cl)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-500 hover:underline"
                        >
                          View CRM
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-10 text-center italic text-fg-muted">
                      কোনো ক্লায়েন্ট অ্যাকাউন্ট পাওয়া যায়নি
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* Expanded Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          {/* Backdrop */}
          <div onClick={() => setSelectedClient(null)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-canvas border border-border/15 p-6 sm:p-8 rounded-3xl shadow-2xl z-10 space-y-6">
            <button
              onClick={() => setSelectedClient(null)}
              className="absolute top-5 right-5 p-1.5 text-fg-soft border border-border/10 rounded-full hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-fg flex items-center gap-2">
                <Users className="h-5 w-5 text-brand-500" />
                Client CRM Profile
              </h3>
              <p className="text-xs text-fg-soft mt-1">
                Relational summary and transactions captured for client profile.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-canvas-muted rounded-2xl border border-border/5">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-canvas border-2 border-brand-500 flex items-center justify-center font-bold text-brand-500 text-base">
                  {selectedClient.avatar_url ? (
                    <img src={selectedClient.avatar_url} alt={selectedClient.full_name || ""} className="h-full w-full object-cover" />
                  ) : (
                    selectedClient.full_name?.slice(0, 2).toUpperCase() || <User className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-fg text-base">{selectedClient.full_name || "Guest Client"}</h4>
                  <p className="text-xs text-brand-500 font-semibold uppercase tracking-wider mt-0.5">
                    {selectedClient.role_id?.replace(/_/g, " ") || "Client"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-canvas-muted rounded-xl border border-border/5">
                  <p className="text-fg-muted font-semibold uppercase tracking-wider">Registered Email</p>
                  <p className="text-fg font-medium mt-1 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                    {selectedClient.email}
                  </p>
                </div>
                <div className="p-3 bg-canvas-muted rounded-xl border border-border/5">
                  <p className="text-fg-muted font-semibold uppercase tracking-wider">Contact Phone</p>
                  <p className="text-fg font-medium mt-1 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                    {selectedClient.phone || "Not Recorded"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-canvas-muted rounded-xl border border-border/5">
                  <Briefcase className="h-4 w-4 text-brand-500 mx-auto mb-1.5" />
                  <p className="text-fg-muted font-semibold uppercase tracking-wider text-[9px]">Total Orders</p>
                  <p className="text-fg font-extrabold text-base mt-0.5">{selectedClient.totalOrders}</p>
                </div>
                <div className="p-3 bg-canvas-muted rounded-xl border border-border/5">
                  <Layers className="h-4 w-4 text-brand-500 mx-auto mb-1.5" />
                  <p className="text-fg-muted font-semibold uppercase tracking-wider text-[9px]">Active Projects</p>
                  <p className="text-fg font-extrabold text-base mt-0.5 text-brand-500">{selectedClient.activeProjects}</p>
                </div>
                <div className="p-3 bg-canvas-muted rounded-xl border border-border/5">
                  <DollarSign className="h-4 w-4 text-emerald-500 mx-auto mb-1.5" />
                  <p className="text-fg-muted font-semibold uppercase tracking-wider text-[9px]">Total Spending</p>
                  <p className="text-emerald-500 font-extrabold text-base mt-0.5">${selectedClient.totalSpend}</p>
                </div>
              </div>

              <div className="p-4 bg-canvas-muted rounded-2xl border border-border/5 space-y-1 text-xs">
                <p className="text-fg-muted font-semibold uppercase tracking-wider">Account Creation Date</p>
                <p className="text-fg font-medium mt-0.5">{formatDate(selectedClient.created_at)}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-5 h-10 rounded-full border border-border/10 hover:bg-surface/50 text-sm font-semibold transition-all"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
