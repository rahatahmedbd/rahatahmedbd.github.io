import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  Briefcase,
  Clock,
  CheckCircle,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  User,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Client Portal Overview | Super Admin",
};

export default async function ClientDashboardOverviewPage() {
  const { user, profile } = await getCurrentUser();
  const supabase = await getSupabaseServerClient();

  // Fetch client projects (orders)
  // Match either by registered client_id or their profile email in client_info
  const { data: projects, error } = await supabase
    .from("orders")
    .select("*")
    .or(`client_id.eq.${user?.id},client_info->>email.eq.${user?.email}`);

  if (error) {
    console.error("Failed to load client projects:", error);
  }

  const clientProjects = projects || [];

  // Statistics
  const activeProjects = clientProjects.filter(
    (p) => p.status !== "completed" && p.status !== "cancelled"
  );
  const completedProjects = clientProjects.filter((p) => p.status === "completed");
  const pendingProjects = clientProjects.filter((p) => p.status === "pending");

  // Fetch latest messages from project conversation history
  let projectMessages: any[] = [];
  if (clientProjects.length > 0) {
    const projectIds = clientProjects.map((p) => p.id);
    const { data: messages } = await supabase
      .from("project_messages")
      .select("*, profiles(full_name, avatar_url)")
      .in("order_id", projectIds)
      .order("created_at", { ascending: false })
      .limit(5);
    projectMessages = messages || [];
  }

  const stats = [
    {
      label: { bn: "সক্রিয় প্রজেক্ট", en: "Active Projects" },
      value: activeProjects.length,
      icon: RefreshCw,
      color: "from-brand-500 to-brand-700",
    },
    {
      label: { bn: "সম্পন্ন প্রজেক্ট", en: "Completed Projects" },
      value: completedProjects.length,
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: { bn: "অপেক্ষমান প্রজেক্ট", en: "Pending Projects" },
      value: pendingProjects.length,
      icon: Clock,
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome Banner */}
      <Reveal direction="fade">
        <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-gradient-to-r from-brand-600/10 to-indigo-600/5 backdrop-blur-md">
          <h1 className="text-display-sm font-bold tracking-tight">
            স্বাগতম, <span className="text-gradient">{profile?.full_name || "সম্মানিত গ্রাহক"}</span>! 👋
          </h1>
          <p className="text-sm text-fg-soft mt-1.5 max-w-xl">
            আপনার প্রজেক্টের রিয়েল-টাইম কাজের অগ্রগতি, মেসেজ, ফিডব্যাক এবং ফাইলসমূহ এখান থেকে সরাসরি ট্র্যাক ও তদারকি করুন।
          </p>
        </div>
      </Reveal>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
        {/* Project List / Recent Timelines */}
        <Reveal delay={200}>
          <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur shadow-lift space-y-5">
            <div className="flex items-center gap-2 border-b border-border/5 pb-3">
              <Briefcase className="h-5 w-5 text-brand-500" />
              <h3 className="font-bold text-fg text-base">আপনার প্রজেক্ট সমূহ (My Projects)</h3>
            </div>

            <div className="space-y-4">
              {clientProjects.length > 0 ? (
                clientProjects.map((prj) => (
                  <div key={prj.id} className="p-4 bg-canvas/30 rounded-2xl border border-border/10 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-fg">{prj.website_type}</h4>
                      <p className="text-xs text-brand-500 font-mono mt-0.5">{prj.reference}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/10">
                        {prj.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-fg-muted italic text-xs space-y-3">
                  <p>আপনার কোনো প্রজেক্ট রেকর্ড পাওয়া যায়নি।</p>
                  <Button href="/order" className="px-5 h-9 text-xs">
                    অর্ডার করুন
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* Project Latest Messages */}
        <Reveal delay={240}>
          <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur shadow-lift space-y-5">
            <div className="flex items-center gap-2 border-b border-border/5 pb-3">
              <MessageSquare className="h-5 w-5 text-brand-500" />
              <h3 className="font-bold text-fg text-base">সাম্প্রতিক প্রজেক্ট চ্যাট (Latest Messages)</h3>
            </div>

            <div className="space-y-4">
              {projectMessages.length > 0 ? (
                projectMessages.map((msg) => (
                  <div key={msg.id} className="p-3 bg-canvas/20 rounded-xl border border-border/5 flex gap-3 items-start">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/10 text-brand-500 font-bold text-xs shrink-0">
                      {msg.profiles?.full_name?.slice(0, 2).toUpperCase() || <User className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-fg">{msg.profiles?.full_name || "Support"}</p>
                      <p className="text-xs text-fg-soft mt-1 leading-relaxed">{msg.message}</p>
                      <p className="text-[10px] text-fg-muted mt-1">{new Date(msg.created_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-fg-muted italic text-center py-6">
                  কোনো মেসেজ রেকর্ড পাওয়া যায়নি।
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
