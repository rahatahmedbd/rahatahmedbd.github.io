"use client";

import { useState, useTransition } from "react";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { createInvoiceAction, updateInvoiceStatusAction, deleteInvoiceAction } from "@/app/actions/business";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface Invoice {
  id: string;
  order_id: string | null;
  client_id: string;
  number: string;
  amount: number;
  currency: string;
  status: string;
  issued_at: string | null;
  due_at: string | null;
  pdf_url: string | null;
  created_at: string;
  orders?: { reference: string; website_type: string | null } | null;
  profiles?: { full_name: string | null; email: string } | null;
}

interface ClientProfile {
  id: string;
  full_name: string | null;
  email: string;
}

interface OrderReference {
  id: string;
  reference: string;
  website_type: string | null;
}

interface InvoicesManagerProps {
  initialInvoices: Invoice[];
  clients: ClientProfile[];
  orders: OrderReference[];
}

export function InvoicesManager({ initialInvoices, clients, orders }: InvoicesManagerProps) {
  const { t } = useLanguage();
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isPending, startTransition] = useTransition();

  // Modal and form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const [clientId, setClientId] = useState(clients[0]?.id || "");
  const [orderId, setOrderId] = useState("");
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState("issued");
  const [dueAt, setDueAt] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      (inv.profiles?.full_name && inv.profiles.full_name.toLowerCase().includes(search.toLowerCase())) ||
      (inv.orders?.reference && inv.orders.reference.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = filterStatus === "all" || inv.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const generateInvoiceNumber = () => {
    return `INV-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  const openAddModal = () => {
    setEditingInvoice(null);
    setClientId(clients[0]?.id || "");
    setOrderId("");
    setNumber(generateInvoiceNumber());
    setAmount(100);
    setStatus("issued");
    setDueAt("");
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (inv: Invoice) => {
    setEditingInvoice(inv);
    setClientId(inv.client_id);
    setOrderId(inv.order_id || "");
    setNumber(inv.number);
    setAmount(inv.amount);
    setStatus(inv.status);
    setDueAt(inv.due_at ? inv.due_at.slice(0, 10) : "");
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      if (editingInvoice) {
        // Edit Status
        const res = await updateInvoiceStatusAction(editingInvoice.id, status);
        if (!res.success) {
          setError(res.error || "Failed to update invoice");
          return;
        }

        setInvoices((prev) =>
          prev.map((i) => (i.id === editingInvoice.id ? { ...i, status } : i))
        );
        setSuccess("Invoice status updated successfully!");
      } else {
        // Create
        const res = await createInvoiceAction({
          orderId: orderId || undefined,
          clientId,
          number,
          amount,
          status: status as any,
          dueAt: dueAt || undefined,
        });

        if (!res.success) {
          setError(res.error || "Failed to create invoice");
          return;
        }

        const newInvoice = {
          ...(res.data as Invoice),
          profiles: clients.find((c) => c.id === clientId) as any,
          orders: orders.find((o) => o.id === orderId) as any,
        };

        setInvoices((prev) => [newInvoice, ...prev]);
        setSuccess("Invoice generated successfully!");
      }

      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this billing invoice?")) return;

    startTransition(async () => {
      const res = await deleteInvoiceAction(id);
      if (!res.success) {
        alert(res.error || "Failed to delete invoice");
        return;
      }
      setInvoices((prev) => prev.filter((i) => i.id !== id));
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-display-sm font-bold tracking-tight">
              <span className="text-gradient">ইনভয়েস ও বিলিং (Billing Invoices)</span>
            </h1>
            <p className="text-sm text-fg-soft mt-1">
              সুপার এডমিন ডাটাবেসের সমস্ত পেমেন্ট ইনভয়েস, রসিদ এবং বিলিং হিস্ট্রি কোনো কোড এডিট ছাড়াই তৈরি ও ট্র্যাকিং করুন।
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-full bg-brand-600 text-white px-5 h-11 font-semibold hover:bg-brand-500 hover:-translate-y-0.5 shadow-soft transition-all duration-300 self-start"
          >
            <Plus className="h-4 w-4" />
            Generate Invoice
          </button>
        </div>
      </Reveal>

      {/* Filter and Search */}
      <Reveal delay={60}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-fg-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices by number, client name, project reference..."
              className="w-full h-12 pl-12 pr-4 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-12 px-5 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all text-fg"
          >
            <option value="all">All Invoice Statuses</option>
            <option value="draft">Draft</option>
            <option value="issued">Issued</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </Reveal>

      {/* Table view */}
      <Reveal delay={120}>
        <div className="card-surface rounded-3xl border border-border/10 bg-surface/20 shadow-lift overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/10 bg-canvas/30 text-fg-muted uppercase tracking-wider font-semibold text-xs">
                  <th className="p-4 pl-6">Invoice Number</th>
                  <th className="p-4">Assigned Client</th>
                  <th className="p-4">Billing Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/5 text-fg-soft">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-canvas-muted/10 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-fg">{inv.number}</span>
                        </div>
                        {inv.orders && (
                          <span className="text-[10px] text-brand-500 font-bold block mt-0.5">Project: {inv.orders.website_type}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-fg">{inv.profiles?.full_name || "Guest Client"}</p>
                        <p className="text-xs text-fg-muted">{inv.profiles?.email}</p>
                      </td>
                      <td className="p-4 font-mono font-bold text-fg">
                        ${inv.amount}
                        {inv.due_at && (
                          <span className="text-[10px] text-fg-muted font-normal block">Due: {new Date(inv.due_at).toLocaleDateString()}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            inv.status === "paid"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10"
                              : inv.status === "cancelled"
                              ? "bg-fg-muted/10 text-fg-soft border border-border/10"
                              : "bg-amber-500/10 text-amber-500 border border-amber-500/10"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right space-x-1.5">
                        <button
                          onClick={() => openEditModal(inv)}
                          className="inline-flex p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-lg hover:bg-brand-500/5"
                          title="Edit Invoice Status / Payment details"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(inv.id)}
                          className="inline-flex p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-lg hover:bg-brand-500/5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center italic text-fg-muted">
                      কোনো পেমেন্ট ইনভয়েস পাওয়া যায়নি
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* Add & Edit Invoice Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <div className="relative w-full max-w-xl bg-canvas border border-border/15 p-6 sm:p-8 rounded-3xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-fg-soft border border-border/10 rounded-full hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-fg">
                {editingInvoice ? "ইনভয়েস এডিট করুন" : "নতুন ইনভয়েস তৈরি করুন"}
              </h3>
              <p className="text-xs text-fg-soft mt-1">Generate professional payment bills tied dynamically to active projects.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4 text-sm text-brand-600 dark:text-brand-400">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p>{success}</p>
                </div>
              )}

              {!editingInvoice ? (
                <>
                  {/* Select Client */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Target Client</label>
                    <select
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none text-fg"
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.full_name || "Guest Client"} ({c.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Associated Order */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Associated Website Project (Optional)</label>
                    <select
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none text-fg"
                    >
                      <option value="">No linked project</option>
                      {orders.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.website_type} ({o.reference})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Invoice Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="number">
                      Invoice Number
                    </label>
                    <input
                      id="number"
                      type="text"
                      required
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none"
                    />
                  </div>

                  {/* Billing Amount */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="amount">
                        Invoice Amount ($)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                        <input
                          id="amount"
                          type="number"
                          required
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="dueAt">
                        Due Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                        <input
                          id="dueAt"
                          type="date"
                          value={dueAt}
                          onChange={(e) => setDueAt(e.target.value)}
                          className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none text-fg"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : null}

              {/* Status Select dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="status">
                  Update Invoice Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none text-fg"
                >
                  <option value="draft">Draft</option>
                  <option value="issued">Issued (Sent)</option>
                  <option value="paid">Paid (Mark Completed)</option>
                  <option value="overdue">Overdue (Unpaid)</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="px-6 h-11">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Invoice"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
