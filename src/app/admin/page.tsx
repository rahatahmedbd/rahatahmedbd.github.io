import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  Briefcase,
  ShoppingBag,
  Clock,
  CheckCircle,
  MessageSquare,
  Star,
  PlusCircle,
  HelpCircle,
  Settings,
  User,
  Activity,
  ArrowRight,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard Overview | Super Admin",
};

export default async function AdminDashboardPage() {
  const { profile } = await getCurrentUser();
  const supabase = await getSupabaseServerClient();

  // Fetch all counts in parallel for optimal performance
  const [
    { count: totalProjects },
    { count: totalOrders },
    { count: pendingOrders },
    { count: activeProjects },
    { count: completedOrders },
    { count: newMessages },
    { count: totalTestimonials },
    { data: recentActivities },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("messages").select("*", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase.from("activity_logs").select("*, profiles(full_name, email)").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    {
      label: { bn: "মোট প্রজেক্ট", en: "Total Projects" },
      value: totalProjects ?? 0,
      icon: Briefcase,
      color: "from-blue-500 to-indigo-600",
    },
    {
      label: { bn: "মোট অর্ডার", en: "Total Orders" },
      value: totalOrders ?? 0,
      icon: ShoppingBag,
      color: "from-purple-500 to-pink-600",
    },
    {
      label: { bn: "অপেক্ষমান অর্ডার", en: "Pending Orders" },
      value: pendingOrders ?? 0,
      icon: Clock,
      color: "from-amber-500 to-orange-600",
    },
    {
      label: { bn: "চলমান প্রজেক্ট", en: "Active Projects" },
      value: activeProjects ?? 0,
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: { bn: "নতুন মেসেজ", en: "New Messages" },
      value: newMessages ?? 0,
      icon: MessageSquare,
      color: "from-rose-500 to-red-600",
    },
    {
      label: { bn: "মোট টেস্টিমোনিয়্যাল", en: "Total Testimonials" },
      value: totalTestimonials ?? 0,
      icon: Star,
      color: "from-gold-400 to-gold-600",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome banner */}
      <Reveal direction="fade">
        <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-gradient-to-r from-brand-600/10 to-indigo-600/5 backdrop-blur-md">
          <h1 className="text-display-sm font-bold tracking-tight">
            স্বাগতম, <span className="text-gradient">{profile?.full_name || "রাহাত আহমেদ"}</span>! 👋
          </h1>
          <p className="text-sm text-fg-soft mt-1.5 max-w-xl">
            আপনার ওয়েবসাইটের কন্টেন্ট এবং অন্যান্য ম্যানেজমেন্ট কন্ট্রোল এখান থেকে সহজেই পরিচালনা করুন।
            কোনো সোর্স কোড পরিবর্তন ছাড়াই সব কন্টেন্ট ইনস্ট্যান্ট লাইভ ওয়েবসাইটে আপডেট হবে।
          </p>
        </div>
      </Reveal>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Reveal key={idx} delay={idx * 40} direction="scale">
              <div className="card-surface p-5 sm:p-6 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur shadow-soft flex items-center gap-4 sm:gap-5">
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-soft`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
                    {stat.label.en}
                  </p>
                  <p className="text-display-xs font-extrabold text-fg mt-0.5">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <Reveal delay={200}>
          <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur shadow-lift space-y-6">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-brand-500" />
              <h3 className="font-bold text-fg">সাম্প্রতিক অ্যাক্টিভিটি (Recent Activities)</h3>
            </div>

            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities && recentActivities.length > 0 ? (
                  recentActivities.map((act: any, actIdx: number) => (
                    <li key={act.id}>
                      <div className="relative pb-8">
                        {actIdx !== recentActivities.length - 1 ? (
                          <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-border/10" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-brand-500/10 flex items-center justify-center ring-8 ring-canvas">
                              <Activity className="h-4 w-4 text-brand-500" />
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-xs text-fg">
                                <span className="font-semibold text-fg">
                                  {act.profiles?.full_name || "System"}
                                </span>{" "}
                                executed{" "}
                                <span className="font-mono bg-canvas px-1.5 py-0.5 rounded text-brand-500">
                                  {act.action}
                                </span>
                              </p>
                            </div>
                            <div className="text-right text-[10px] whitespace-nowrap text-fg-muted font-medium">
                              {new Date(act.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-fg-muted italic text-center py-4">
                    কোনো অ্যাক্টিভিটি লগ পাওয়া যায়নি
                  </p>
                )}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Quick Actions */}
        <Reveal delay={240}>
          <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur shadow-lift space-y-6 h-full">
            <div>
              <h3 className="font-bold text-fg text-lg">কুইক অ্যাকশন (Quick Actions)</h3>
              <p className="text-xs text-fg-soft mt-1">
                সবচেয়ে প্রয়োজনীয় ফিচারগুলোতে সরাসরি অ্যাক্সেস করতে নিচের কুইক লিংকগুলো ব্যবহার করুন।
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a
                href="/admin/portfolio"
                className="flex flex-col items-start p-4 rounded-2xl border border-border/10 bg-canvas/30 hover:border-brand-500/20 hover:bg-brand-500/5 transition-all group"
              >
                <PlusCircle className="h-5 w-5 text-brand-500 mb-2" />
                <span className="text-sm font-semibold text-fg">প্রজেক্ট যুক্ত করুন</span>
                <span className="text-[10px] text-fg-soft mt-1 flex items-center gap-1">
                  Add Portfolio Project <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </a>

              <a
                href="/admin/faq"
                className="flex flex-col items-start p-4 rounded-2xl border border-border/10 bg-canvas/30 hover:border-brand-500/20 hover:bg-brand-500/5 transition-all group"
              >
                <HelpCircle className="h-5 w-5 text-brand-500 mb-2" />
                <span className="text-sm font-semibold text-fg">প্রশ্নোত্তর যুক্ত করুন</span>
                <span className="text-[10px] text-fg-soft mt-1 flex items-center gap-1">
                  Manage FAQs <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </a>

              <a
                href="/admin/settings"
                className="flex flex-col items-start p-4 rounded-2xl border border-border/10 bg-canvas/30 hover:border-brand-500/20 hover:bg-brand-500/5 transition-all group"
              >
                <Settings className="h-5 w-5 text-brand-500 mb-2" />
                <span className="text-sm font-semibold text-fg">সাইট সেটিংস</span>
                <span className="text-[10px] text-fg-soft mt-1 flex items-center gap-1">
                  Website Settings <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </a>

              <a
                href="/admin/profile"
                className="flex flex-col items-start p-4 rounded-2xl border border-border/10 bg-canvas/30 hover:border-brand-500/20 hover:bg-brand-500/5 transition-all group"
              >
                <User className="h-5 w-5 text-brand-500 mb-2" />
                <span className="text-sm font-semibold text-fg">আমার প্রোফাইল</span>
                <span className="text-[10px] text-fg-soft mt-1 flex items-center gap-1">
                  Admin Profile <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
