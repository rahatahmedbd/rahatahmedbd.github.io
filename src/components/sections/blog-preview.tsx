import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const previews = [
  { title: "3D Web Experiences", desc: "Interactive Three.js hero animations with orbit controls.", tag: "Tech" },
  { title: "Multilingual Design", desc: "Seamless BN/EN typography pairing for global audiences.", tag: "Design" },
  { title: "Social Impact", desc: "Blood donation awareness and student-led digital health.", tag: "Impact" },
];

export default function BlogPreview() {
  return (
    <section id="blog" className="scroll-mt-20 py-24 bg-gradient-to-b from-canvas-subtle to-canvas">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-fg mb-2">Latest Updates</h2>
            <p className="text-fg-soft text-base sm:text-lg">Thoughts on tech, design, and community.</p>
          </div>
          <Link href="/blog" className="hidden sm:inline-flex items-center gap-2 rounded-full bg-surface raised border border-white/10 px-5 py-2.5 text-sm font-semibold shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {previews.map((p) => (
            <Link key={p.title} href="/blog" className="group relative rounded-3xl border border-white/10 bg-surface/60 backdrop-blur-xl p-7 shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-1 transition">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600/20 text-brand-400"><Sparkles className="h-3 w-3" /></span>
                <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">{p.tag}</span>
              </div>
              <h3 className="text-xl font-extrabold text-fg mb-2 group-hover:text-brand-400 transition leading-tight">{p.title}</h3>
              <p className="text-sm text-fg-soft leading-relaxed">{p.desc}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 sm:hidden">
          <Link href="/blog" className="inline-flex items-center gap-2 rounded-full bg-surface raised border border-white/10 px-5 py-2.5 text-sm font-semibold">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}
