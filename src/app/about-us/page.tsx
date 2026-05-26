import { PageHero } from "@/src/components/pages/page-hero";
import { AboutStory } from "@/src/components/pages/about/about-story-section";
import { AboutPrinciples } from "@/src/components/pages/about/about-principles-section";
// import { AboutTeam } from "@/src/components/pages/about/about-team-section";
import { AboutWhyUs } from "@/src/components/pages/about/about-whyus-section";
import { SectionWithAnimation } from "@/src/components/animations/SectionWithAnimation";

export default function AboutPage() {
  return (
    <main>
      <SectionWithAnimation>
        <PageHero
          imageSrc="/who-we-are.jpeg"
          imageAlt="Karisimbi Real Estate"
          imagePosition="center 60%"
          eyebrow="About Us"
          title="WHO WE ARE"
          description="Rwanda's premier property partner — helping families and investors find spaces they truly love since 2010."
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "About Us" },
          ]}
        />
      </SectionWithAnimation>

      <SectionWithAnimation>
        <AboutStory />
      </SectionWithAnimation>

      <SectionWithAnimation>
        <AboutPrinciples />
      </SectionWithAnimation>

      {/* <SectionWithAnimation>
        <AboutTeam />
      </SectionWithAnimation> */}

      <SectionWithAnimation>
        <AboutWhyUs />
      </SectionWithAnimation>
    </main>
  );
}
