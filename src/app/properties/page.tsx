import { PageHero } from "@/src/components/pages/page-hero";
import { PropertiesListings } from "@/src/components/pages/properties/properties-listings";

export default function PropertiesPage() {
  return (
    <main>
      <PageHero
        imageSrc="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1800&q=80"
        imageAlt="Properties for Sale"
        imagePosition="center 50%"
        eyebrow="Our Listings"
        title="PROPERTIES"
        description="Houses, land and plots — curated across Rwanda's finest locations."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Properties" },
        ]}
      />
      <PropertiesListings />
    </main>
  );
}
