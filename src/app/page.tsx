import { Hero } from "@/components/sections/hero";
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

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Skills />
      <Education />
      <Achievements />
      <Experience />
      <Testimonials />
      <Blood />
      <Tribute />
      <Faqs />
      <Gallery />
      <Contact />
    </>
  );
}
