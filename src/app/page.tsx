import { Hero } from "@/components/sections/hero";
import { QuickAccess } from "@/components/sections/quick-access";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Skills } from "@/components/sections/skills";
import { Education } from "@/components/sections/education";
import { Achievements } from "@/components/sections/achievements";
import { Experience } from "@/components/sections/experience";
import { Testimonials } from "@/components/sections/testimonials";
import { Blood } from "@/components/sections/blood";
import { Tribute } from "@/components/sections/tribute";
import { Faqs } from "@/components/sections/faqs";
import { Gallery } from "@/components/sections/gallery";
import { Contact } from "@/components/sections/contact";
import { OrderCta } from "@/components/sections/order-cta";
import { VerseInvite } from "@/components/sections/verse-invite";
import Hero3D from "@/components/sections/hero-3d";
import BlogPreview from "@/components/sections/blog-preview";

/**
 * The homepage is the whole product: one continuous journey from
 * "who I am" to "start a project". Anchors map 1:1 to the five nav links.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      {/* FAST LANE — get anyone to what they came for in one tap */}
      <QuickAccess />

      {/* INTERACTIVE 3D ANIMATION — one finger rotate / two finger zoom */}
      <section id="interactive" className="scroll-mt-20 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-brand-500 to-amber-400" />
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-fg-muted">Interactive 3D</h2>
          </div>
          <Hero3D />
        </div>
      </section>

      {/* WHO — identity and credibility */}
      <div id="about" className="scroll-mt-20">
        <About />
        <Education />
      </div>

      {/* WHAT — services, then the single primary action */}
      <div id="services" className="scroll-mt-20">
        <Services />
        <Skills />
        <OrderCta />
      </div>

      {/* PROOF — work, achievements, experience */}
      <div id="work" className="scroll-mt-20">
        <Achievements />
        <Experience />
        <Gallery />
      </div>

      {/* TRUST — client results and community */}
      <div id="trust" className="scroll-mt-20">
        <Testimonials />
        <Blood />
        <Tribute />
      </div>

      {/* An optional door, never a detour */}
      <VerseInvite />

      {/* BLOG / CONTENT */}
      <BlogPreview />

      {/* CONTACT */}
      <div id="contact" className="scroll-mt-20">
        <Faqs />
        <Contact />
      </div>
    </>
  );
}
