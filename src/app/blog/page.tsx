import Link from "next/link";
import { ArrowLeft, Clock, User } from "lucide-react";

const posts = [
  {
    title: "Building Interactive 3D Experiences with Three.js",
    excerpt: "How we integrated @react-three/fiber into a portfolio site for immersive storytelling. From torus knots to orbit controls, discover the tech stack behind the new hero.",
    author: "Rahat Ahmed",
    date: "2026-08-03",
    read: "6 min read",
    tag: "Development",
    color: "from-brand-600/20 to-rose-600/20",
  },
  {
    title: "Blood Donation & Digital Health Awareness",
    excerpt: "A student-led initiative to connect donors with hospitals using simple web tools. Learn how data, UI/UX, and community drive life-saving results.",
    author: "Rahat Ahmed",
    date: "2026-07-28",
    read: "4 min read",
    tag: "Social Impact",
    color: "from-red-600/20 to-rose-600/20",
  },
  {
    title: "Multilingual Design: BN + EN Without Compromise",
    excerpt: "Tips on typography, RTL considerations, and typography pairing for Bengali and English co-existence in modern web applications.",
    author: "Rahat Ahmed",
    date: "2026-07-15",
    read: "5 min read",
    tag: "Design",
    color: "from-amber-600/20 to-yellow-600/20",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0a12] via-[#0f0f1a] to-canvas pt-28 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-brand-400 transition mb-6"><ArrowLeft className="h-4 w-4" /> Back to home</Link>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gradient-brand mb-3">Blog & Updates</h1>
          <p className="max-w-2xl text-fg-soft text-base sm:text-lg">Thoughts on web technology, design systems, blood donation, and building for a multilingual world.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article key={p.title} className="group relative rounded-3xl border border-white/10 bg-surface/50 backdrop-blur-xl p-7 shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-1 transition">
              <span className={`inline-block rounded-full bg-gradient-to-r ${p.color} px-3 py-0.5 text-xs font-bold text-fg-soft mb-4`}>{p.tag}</span>
              <h2 className="text-xl font-extrabold text-fg mb-3 group-hover:text-brand-400 transition leading-tight">{p.title}</h2>
              <p className="text-sm text-fg-soft leading-relaxed mb-5">{p.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-fg-muted">
                <span className="flex items-center gap-1"><User className="h-3 w-3" /> {p.author}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.read}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
