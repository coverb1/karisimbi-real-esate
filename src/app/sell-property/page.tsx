import { PageHero } from "@/src/components/pages/page-hero";
import { SellPropertyForm } from "@/src/components/pages/sell-property-form";
export default function SellPropertyPage() {
  return (
    <main>
      <PageHero
        imageSrc="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1800&q=80"
        imageAlt="Register Your Property"
        imagePosition="center 40%"
        eyebrow="List With Us"
        title="SELL YOUR PROPERTY"
        description="List your property with us and connect with serious buyers across Rwanda."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />
      <SellPropertyForm />
    </main>
  );
}
