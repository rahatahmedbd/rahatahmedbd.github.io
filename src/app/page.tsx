import { Hero } from "@/components/sections/hero";
import { QuickAccess } from "@/components/sections/quick-access";
import { Organizations } from "@/components/sections/organizations";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Skills } from "@/components/sections/skills";
import { Education } from "@/components/sections/education";
import { Achievements } from "@/components/sections/achievements";
import { Experience } from "@/components/sections/experience";
import { Portfolio } from "@/components/sections/portfolio";
import { Testimonials } from "@/components/sections/testimonials";
import { Blood } from "@/components/sections/blood";
import { Tribute } from "@/components/sections/tribute";
import { Faqs } from "@/components/sections/faqs";
import { Gallery } from "@/components/sections/gallery";
import { Contact } from "@/components/sections/contact";
import { OrderCta } from "@/components/sections/order-cta";
// VerseInvite removed (caused loading issues from recent RahatVerse update)
// import { VerseInvite } from "@/components/sections/verse-invite";

/**
 * The homepage is the whole product: one continuous journey from
 * "who I am" to "start a project". Anchors map 1:1 to the five nav links.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      {/* TRUST — the real institutions behind the story, immediately */}
      <Organizations />

      {/* FAST LANE — get anyone to what they came for in one tap */}
      <QuickAccess />

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
        <Portfolio />
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

      {/* VerseInvite removed (caused loading issues from recent RahatVerse update) */}

      {/* CONTACT */}
      <div id="contact" className="scroll-mt-20">
        <Faqs />
        <Contact />
      </div>
    </>
  );
}
