"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Eye,
  Trash2,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  Bookmark,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { updateAdminOrderAction, deleteAdminOrderAction } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface Order {
  id: string;
  reference: string;
  client_id: string | null;
  status: string;
  total_amount: number;
  currency: string;
  notes: string | null;
  client_info: any;
  website_type: string | null;
  required_features: string[] | null;
  design_preference: string[] | null;
  budget_option: string | null;
  deadline_option: string | null;
  project_details: string | null;
  uploaded_files: any[] | null;
  estimated_cost: number | null;
  estimated_delivery: string | null;
  final_price: number | null;
  final_delivery: string | null;
  is_priority: boolean;
  internal_notes: string | null;
  internal_files: any[] | null;
  created_at: string;
}

interface OrdersManagerProps {
  initialOrders: Order[];
}

export function OrdersManager({ initialOrders }: OrdersManagerProps) {
  const { t, lang } = useLanguage();
  const searchParams = useSearchParams();
  const [orders, setProjects] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isPending, startTransition] = useTransition();

  // Selected Order Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Form inputs for editing
  const [status, setStatus] = useState("");
  const [finalPrice, setFinalPrice] = useState<number | "">("");
  const [finalDelivery, setFinalDelivery] = useState("");
  const [isPriority, setIsPriority] = useState(false);
  const [internalNotes, setInternalNotes] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Deep linking to an order (e.g., from notifications)
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      const match = orders.find((o) => o.reference === ref);
      if (match) {
        handleViewDetails(match);
      }
    }
  }, [searchParams, orders]);

  // Filter & Search Logic
  const filteredOrders = orders.filter((ord) => {
    const clientName = ord.client_info?.fullName || "";
    const clientEmail = ord.client_info?.email || "";
    
    const matchesSearch =
      ord.reference.toLowerCase().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase()) ||
      clientEmail.toLowerCase().includes(search.toLowerCase()) ||
      (ord.website_type && ord.website_type.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = filterStatus === "all" || ord.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (ord: Order) => {
    setSelectedOrder(ord);
    setStatus(ord.status);
    setFinalPrice(ord.final_price !== null ? ord.final_price : "");
    setFinalDelivery(ord.final_delivery || "");
    setIsPriority(ord.is_priority);
    setInternalNotes(ord.internal_notes || "");
    setError(null);
    setSuccess(null);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await updateAdminOrderAction(selectedOrder.id, {
        status,
        finalPrice: finalPrice === "" ? undefined : finalPrice,
        finalDelivery: finalDelivery || undefined,
        isPriority,
        internalNotes,
      });

      if (!res.success) {
        setError(res.error || "Failed to save order updates");
        return;
      }

      setProjects((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? (res.data as Order) : o))
      );
      setSuccess("Order details saved successfully!");
      setSelectedOrder(res.data as Order);
    });
  };

  const handleDeleteOrder = (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this website order request?")) return;

    startTransition(async () => {
      const res = await deleteAdminOrderAction(id);
      if (!res.success) {
        alert(res.error || "Failed to delete order");
        return;
      }

      setProjects((prev) => prev.filter((o) => o.id !== id));
      setSelectedOrder(null);
    });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return lang === "bn"
      ? d.toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })
      : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const statuses = [
    "pending",
    "Contacted",
    "Waiting for Client",
    "Quote Sent",
    "Quote Accepted",
    "Project Started",
    "UI/UX Design",
    "Development",
    "Testing",
    "Revision",
    "Completed",
    "Cancelled",
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div>
          <h1 className="text-display-sm font-bold tracking-tight">
            <span className="text-gradient">প্রজেক্ট রিকুয়েস্ট ও অর্ডার্স (Website Orders)</span>
          </h1>
          <p className="text-sm text-fg-soft mt-1">
            ভিজিটর এবং ক্লায়েন্টদের প্রেরিত সমস্ত নতুন প্রজেক্ট রিকুয়েস্ট, অফার বাজেট, অগ্রাধিকার এবং ডেলিভারি ডেট এখান থেকে আপডেট করুন।
          </p>
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
              placeholder="Search website orders by reference, client name, email..."
              className="w-full h-12 pl-12 pr-4 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-12 px-5 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all text-fg"
          >
            <option value="all">All Statuses</option>
            {statuses.map((st) => (
              <option key={st} value={st.toLowerCase()}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </Reveal>

      {/* Orders Table view */}
      <Reveal delay={120}>
        <div className="card-surface rounded-3xl border border-border/10 bg-surface/20 shadow-lift overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/10 bg-canvas/30 text-fg-muted uppercase tracking-wider font-semibold text-xs">
                  <th className="p-4 pl-6">Reference</th>
                  <th className="p-4">Client Details</th>
                  <th className="p-4">Website Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Final Price</th>
                  <th className="p-4 pr-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/5 text-fg-soft">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-canvas-muted/10 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-fg">{ord.reference}</span>
                          {ord.is_priority && (
                            <span className="inline-block h-2 w-2 rounded-full bg-brand-500" title="High Priority" />
                          )}
                        </div>
                        <span className="text-[10px] text-fg-muted block mt-0.5">{formatDate(ord.created_at)}</span>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-fg">{ord.client_info?.fullName || "Guest Client"}</p>
                        <p className="text-xs text-fg-muted">{ord.client_info?.email}</p>
                      </td>
                      <td className="p-4">
                        <span className="inline-block bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold text-xs px-2.5 py-0.5 rounded-full border border-brand-500/10">
                          {ord.website_type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-surface/60 border border-border/10 text-fg-soft">
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-fg">
                        {ord.final_price !== null ? `$${ord.final_price}` : `$${ord.estimated_cost} (Est)`}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleViewDetails(ord)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:underline"
                        >
                          <Eye className="h-4 w-4" />
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-10 text-center italic text-fg-muted">
                      কোনো ওয়েবসাইট অর্ডার রিকুয়েস্ট পাওয়া যায়নি
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* View & Update Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          {/* Backdrop */}
          <div onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal Content */}
          <div className="relative w-full max-w-4xl bg-canvas border border-border/15 p-6 sm:p-8 rounded-3xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 p-1.5 text-fg-soft border border-border/10 rounded-full hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Title */}
            <div className="lg:col-span-12">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-fg">
                  Manage Order: <span className="font-mono text-brand-500">{selectedOrder.reference}</span>
                </h3>
                {selectedOrder.is_priority && (
                  <span className="inline-flex items-center gap-1 bg-brand-500/10 text-brand-500 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-brand-500/10">
                    High Priority
                  </span>
                )}
              </div>
              <p className="text-xs text-fg-soft mt-1">Submitted on {formatDate(selectedOrder.created_at)}</p>
            </div>

            {/* Left side: Order requirements recap - 7 cols */}
            <div className="lg:col-span-7 space-y-6 overflow-y-auto pr-1">
              {/* Client Card */}
              <div className="p-4 bg-canvas-muted rounded-2xl border border-border/5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-fg-muted">Client Information</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-fg-soft font-medium flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-brand-500" />
                      Name:
                    </span>
                    <span className="font-semibold text-fg block mt-0.5">{selectedOrder.client_info?.fullName}</span>
                  </div>
                  {selectedOrder.client_info?.companyName && (
                    <div>
                      <span className="text-fg-soft font-medium">Company:</span>
                      <span className="font-semibold text-fg block mt-0.5">{selectedOrder.client_info.companyName}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-fg-soft font-medium flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-brand-500" />
                      Email:
                    </span>
                    <span className="font-semibold text-fg block mt-0.5">{selectedOrder.client_info?.email}</span>
                  </div>
                  <div>
                    <span className="text-fg-soft font-medium flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-brand-500" />
                      WhatsApp:
                    </span>
                    <span className="font-semibold text-fg block mt-0.5">{selectedOrder.client_info?.phone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-fg-soft font-medium flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-brand-500" />
                      Country:
                    </span>
                    <span className="font-semibold text-fg block mt-0.5">{selectedOrder.client_info?.country}</span>
                  </div>
                </div>
              </div>

              {/* Requirements Specifications */}
              <div className="space-y-4 text-xs">
                <div className="border-b border-border/5 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-fg-muted mb-1.5">Website Specifications</h4>
                  <p className="text-fg font-medium">Type: <span className="font-bold text-brand-500">{selectedOrder.website_type}</span></p>
                </div>

                <div className="border-b border-border/5 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-fg-muted mb-1.5">Required Features</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedOrder.required_features && selectedOrder.required_features.length > 0 ? (
                      selectedOrder.required_features.map((f) => (
                        <span key={f} className="bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold px-2 py-0.5 rounded border border-brand-500/10">
                          {f}
                        </span>
                      ))
                    ) : (
                      <span className="italic text-fg-muted">None specified</span>
                    )}
                  </div>
                </div>

                <div className="border-b border-border/5 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-fg-muted mb-1.5">Design & Layout Preferences</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedOrder.design_preference && selectedOrder.design_preference.map((p) => (
                      <span key={p} className="bg-canvas-muted px-2 py-0.5 rounded font-bold">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Details Notes */}
                <div className="border-b border-border/5 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-fg-muted mb-1.5">Full Requirements Description</h4>
                  <p className="text-fg-soft leading-relaxed whitespace-pre-line">{selectedOrder.project_details || "No notes provided."}</p>
                </div>

                {/* Client Attached Files */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-fg-muted mb-2">Attached Files</h4>
                  {selectedOrder.uploaded_files && selectedOrder.uploaded_files.length > 0 ? (
                    <div className="space-y-1.5">
                      {selectedOrder.uploaded_files.map((file, fIdx) => (
                        <a
                          key={fIdx}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2.5 bg-canvas-muted rounded-xl border border-border/5 hover:border-brand-500/20 transition-all group"
                        >
                          <span className="font-semibold text-fg flex items-center gap-2">
                            <FileText className="h-4 w-4 text-brand-500" />
                            {file.name}
                          </span>
                          <span className="text-[10px] text-fg-muted group-hover:text-brand-500 font-mono">Download →</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="italic text-fg-muted">No client attachments</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Editor Form - 5 cols */}
            <form onSubmit={handleSaveChanges} className="lg:col-span-5 space-y-5 border-l border-border/5 pl-0 lg:pl-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-fg-muted border-b border-border/5 pb-1.5">Order Management Operations</h4>

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

              {/* Status Select dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="status">
                  Update Order Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none text-fg"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st.toLowerCase()}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assign Final Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="finalPrice">
                  Final Price (Budget)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                  <input
                    id="finalPrice"
                    type="number"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder={`Original Estimate: $${selectedOrder.estimated_cost}`}
                    className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              {/* Assign Delivery Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="finalDelivery">
                  Assigned Delivery Date / Timeline
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                  <input
                    id="finalDelivery"
                    type="text"
                    value={finalDelivery}
                    onChange={(e) => setFinalDelivery(e.target.value)}
                    placeholder={`Original Estimate: ${selectedOrder.estimated_delivery}`}
                    className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              {/* Priority Toggle */}
              <div className="flex items-center gap-2.5 py-1 px-1">
                <input
                  id="isPriority"
                  type="checkbox"
                  checked={isPriority}
                  onChange={(e) => setIsPriority(e.target.checked)}
                  className="rounded border-border/20 text-brand-500 focus:ring-brand-500 h-4 w-4 bg-canvas/30"
                />
                <label htmlFor="isPriority" className="text-xs text-fg-soft font-semibold cursor-pointer select-none">
                  Mark as High Priority
                </label>
              </div>

              {/* Internal Admin Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="internalNotes">
                  Internal Notes (Not visible to client)
                </label>
                <textarea
                  id="internalNotes"
                  rows={4}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Only visible internally to the administrative team..."
                  className="w-full p-4 rounded-3xl border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none resize-none"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-border/5">
                <button
                  type="button"
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  disabled={isPending}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-500 hover:text-brand-400"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Order
                </button>

                <Button type="submit" disabled={isPending} className="px-6 h-11">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Updates"
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
