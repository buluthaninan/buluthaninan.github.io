import { Background } from "@/components/background";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { Contact, Footer } from "@/components/contact";
import { CommandPalette } from "@/components/command-palette";
import { Cursor } from "@/components/cursor";
import { KonamiEgg, ScrollProgress } from "@/components/extras";

export default function Page() {
  return (
    <>
      <Background />
      <ScrollProgress />
      <Cursor />
      <Nav />

      <main className="relative z-10">
        <Hero />
        <Projects />
        <About />
        <Experience />
        <Contact />
      </main>

      <Footer />

      <CommandPalette />
      <KonamiEgg />
    </>
  );
}
