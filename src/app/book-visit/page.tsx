import { BookVisitForm } from "@/src/components/pages/book-visit-form";
import { PageHero } from "@/src/components/pages/page-hero";

export default function BookVisitPage() {
  return (
    <main>
      <PageHero
        imageSrc="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1800&q=80"
        imageAlt="Book a Property Visit"
        imagePosition="center 40%"
        eyebrow="List With Us"
        title="BOOK A VISIT"
        description="  Schedule a property viewing with our professional agents — at your convenience."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Book a Visit" }]}
      />
      <BookVisitForm />
    </main>
  );
}
