import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Education } from "@/components/sections/education";
import { Achievements } from "@/components/sections/achievements";
import { Experience } from "@/components/sections/experience";
import { Blood } from "@/components/sections/blood";
import { Tribute } from "@/components/sections/tribute";
import { Gallery } from "@/components/sections/gallery";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Education />
      <Achievements />
      <Experience />
      <Blood />
      <Tribute />
      <Gallery />
      <Contact />
    </>
  );
}
