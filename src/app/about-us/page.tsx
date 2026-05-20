import { AboutHero } from "@/src/components/pages/about-hero-section";
import { AboutStory } from "@/src/components/pages/about-story-section";
import { AboutPrinciples } from "@/src/components/pages/about-principles-section";
import { AboutTeam } from "@/src/components/pages/about-team-section";
import { AboutWhyUs } from "@/src/components/pages/about-whyus-section";
import { SectionWithAnimation } from "@/src/components/animations/SectionWithAnimation";

export default function AboutPage() {
  return (
    <main>
      <SectionWithAnimation>
        <AboutHero />
      </SectionWithAnimation>

      <SectionWithAnimation>
        <AboutStory />
      </SectionWithAnimation>

      <SectionWithAnimation>
        <AboutPrinciples />
      </SectionWithAnimation>

      <SectionWithAnimation>
        <AboutTeam />
      </SectionWithAnimation>

      <SectionWithAnimation>
        <AboutWhyUs />
      </SectionWithAnimation>
    </main>
  );
}
