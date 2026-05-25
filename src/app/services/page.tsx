import { PageHero } from "@/src/components/pages/page-hero";
import { MainServices } from "@/src/components/pages/services/main-services";
import { AdditionalServices } from "@/src/components/pages/services/additional-services";
import { ServiceProcess } from "@/src/components/pages/services/service-process";
import { SectionWithAnimation } from "@/src/components/animations/SectionWithAnimation";

export default function ServicesPage() {
  return (
    <main>
      <SectionWithAnimation animation="fade-down" duration={0.85}>
        <PageHero
          imageSrc="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=80"
          imageAlt="Our Services"
          imagePosition="center 40%"
          eyebrow="What We Offer"
          title="OUR SERVICES"
          description="End-to-end real estate services — from finding your dream home to selling with maximum value, delivered with expertise and personal care."
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Services" },
          ]}
        />
      </SectionWithAnimation>
      <SectionWithAnimation animation="fade-up" delay={0.1}>
        <MainServices />
      </SectionWithAnimation>
      <SectionWithAnimation animation="fade-left" delay={0.2}>
        <AdditionalServices />
      </SectionWithAnimation>
      <SectionWithAnimation animation="fade-right" delay={0.3}>
        <ServiceProcess />
      </SectionWithAnimation>
    </main>
  );
}
