export type PropertyCategory = "house" | "land" | "plot";

export interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  priceValue: number;
  image: string;
  beds: number | null;
  baths: number | null;
  area: string;
  category: PropertyCategory;
  type: string;
}

export const properties: Property[] = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    location: "Kigali Heights",
    price: "RWF 450,000,000",
    priceValue: 450,
    image: "https://images.unsplash.com/photo-1564703048291-bcf7f001d83d?w=800",
    beds: 4,
    baths: 3,
    area: "3,500 sqft",
    category: "house",
    type: "Villa",
  },
  {
    id: 2,
    title: "Contemporary Family Home",
    location: "Nyarutarama",
    price: "RWF 320,000,000",
    priceValue: 320,
    image: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800",
    beds: 5,
    baths: 4,
    area: "4,200 sqft",
    category: "house",
    type: "Family House",
  },
  {
    id: 3,
    title: "Executive Penthouse",
    location: "Gacuriro",
    price: "RWF 280,000,000",
    priceValue: 280,
    image: "https://images.unsplash.com/photo-1628744448839-a475cc0e90c3?w=800",
    beds: 3,
    baths: 2,
    area: "2,800 sqft",
    category: "house",
    type: "Penthouse",
  },
  {
    id: 4,
    title: "Pristine Land Plot",
    location: "Bugesera District",
    price: "RWF 85,000,000",
    priceValue: 85,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    beds: null,
    baths: null,
    area: "5,000 sqm",
    category: "land",
    type: "Land",
  },
  {
    id: 5,
    title: "Luxury Modern Estate",
    location: "Kimihurura",
    price: "RWF 550,000,000",
    priceValue: 550,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    beds: 6,
    baths: 5,
    area: "5,500 sqft",
    category: "house",
    type: "Villa",
  },
  {
    id: 6,
    title: "Commercial Land Plot",
    location: "Kicukiro District",
    price: "RWF 120,000,000",
    priceValue: 120,
    image: "https://images.unsplash.com/photo-1565583673900-1cd9320f6c8b?w=800",
    beds: null,
    baths: null,
    area: "8,000 sqm",
    category: "land",
    type: "Land",
  },
  {
    id: 7,
    title: "Designer Villa with Pool",
    location: "Rebero",
    price: "RWF 420,000,000",
    priceValue: 420,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    beds: 5,
    baths: 4,
    area: "4,800 sqft",
    category: "house",
    type: "Villa",
  },
  {
    id: 8,
    title: "Spacious Family Home",
    location: "Kacyiru",
    price: "RWF 260,000,000",
    priceValue: 260,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
    beds: 4,
    baths: 3,
    area: "3,200 sqft",
    category: "house",
    type: "Family House",
  },
  {
    id: 9,
    title: "Prime Agricultural Land",
    location: "Nyagatare District",
    price: "RWF 95,000,000",
    priceValue: 95,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    beds: null,
    baths: null,
    area: "10,000 sqm",
    category: "land",
    type: "Land",
  },
  {
    id: 10,
    title: "Residential Plot - Norrsken",
    location: "Kigali Special Zone",
    price: "RWF 65,000,000",
    priceValue: 65,
    image: "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?w=800",
    beds: null,
    baths: null,
    area: "600 sqm",
    category: "plot",
    type: "Plot",
  },
  {
    id: 11,
    title: "Corner Plot - Kanombe",
    location: "Kanombe",
    price: "RWF 48,000,000",
    priceValue: 48,
    image: "https://images.unsplash.com/photo-1529946179074-87642f6204d7?w=800",
    beds: null,
    baths: null,
    area: "450 sqm",
    category: "plot",
    type: "Plot",
  },
  {
    id: 12,
    title: "Hilltop Plot - Bumbogo",
    location: "Bumbogo",
    price: "RWF 72,000,000",
    priceValue: 72,
    image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800",
    beds: null,
    baths: null,
    area: "800 sqm",
    category: "plot",
    type: "Plot",
  },
  {
    id: 13,
    title: "Gated Estate Plot",
    location: "Kibagabaga",
    price: "RWF 110,000,000",
    priceValue: 110,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    beds: null,
    baths: null,
    area: "1,200 sqm",
    category: "plot",
    type: "Plot",
  },
];

export const locationOptions = [
  "All Locations",
  "Kigali Heights",
  "Nyarutarama",
  "Gacuriro",
  "Kimihurura",
  "Rebero",
  "Kacyiru",
  "Kibagabaga",
  "Kanombe",
  "Bumbogo",
  "Kigali Special Zone",
  "Bugesera District",
  "Kicukiro District",
  "Nyagatare District",
];

export const bedsOptions = ["Any", "1+", "2+", "3+", "4+", "5+"];

export const sortOptions = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

export const priceRanges = [
  { label: "Under 100M", min: "", max: "100" },
  { label: "100M – 300M", min: "100", max: "300" },
  { label: "300M – 500M", min: "300", max: "500" },
  { label: "500M+", min: "500", max: "" },
];

export const ITEMS_PER_PAGE = 6;
