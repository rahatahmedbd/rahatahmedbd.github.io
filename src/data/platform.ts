import { site } from "@/constants/site";
import type { OrderFormData } from "@/types/platform";

/**
 * Canonical content and catalog data for both product experiences.
 *
 * UI components should read from this module rather than maintaining their own
 * copies of portfolio content, district labels, or order pricing.
 */
export const portfolioProfile = {
  name: site.name,
  alternateName: site.alternateName,
  birthDate: "June 21, 2006",
  birthYear: "2006",
  location: "Sunamganj, Bangladesh",
  headline: "Building meaningful impact through education, technology & community service",
  summary:
    "I am Rahat Ahmed, born on June 21, 2006, in Jibdara village, Shantiganj, Sunamganj. Growing up amidst nature taught me to dream big and work relentlessly.",
  roles: "Student • Tutor • Blood Donor • Web Developer",
  currentEducation: "HSC 2nd Year (Science)",
  bloodGroup: "A+",
  bloodDonations: "4×",
  email: site.email,
  telephone: site.telephone,
  whatsapp: `https://wa.me/${site.telephone.replace(/\D/gu, "")}`,
} as const;

export const educationItems = [
  {
    year: "2025 — Present",
    title: "HSC 2nd Year (Science)",
    institution: "Sunamganj Government College",
    desc: "Currently pursuing HSC in Science group.",
  },
  {
    year: "July 2025",
    title: "SSC — GPA 5.00 (A+)",
    institution: "Satgaon Jibdara High School",
    desc: "Achieved GPA 5.00 in Science group.",
  },
  {
    year: "2019",
    title: "PSC — GPA 5.00",
    institution: "Jibdara Government Primary School",
    desc: "Passed with GPA 5.00.",
  },
] as const;

export const achievementItems = [
  { icon: "🏆", title: "SSC — GPA 5.00 (A+)", year: "2025", desc: "Satgaon Jibdara High School" },
  {
    icon: "🥇",
    title: "44th Science Exhibition — 1st Place",
    year: "2024",
    desc: "National Science & Technology Week",
  },
  { icon: "🥇", title: "42nd Science Fair — 1st Place", year: "2020", desc: "Upazila Level" },
  {
    icon: "🧠",
    title: "Creative Talent Search — 1st in Science",
    year: "2024",
    desc: "Srijonshil Medha",
  },
  { icon: "🎖️", title: "Meritorious Student Honor", year: "2025", desc: "School Recognition" },
  { icon: "🩸", title: "Shantichakra Recognition Crest", year: "2025", desc: "For SSC A+" },
] as const;

/** Service cards shown in the Website Experience. */
export const portfolioServices = [
  {
    title: "Portfolio Website",
    price: "Starting from ৳8,000",
    time: "5–7 days",
    desc: "Beautiful personal or professional portfolio to showcase your work.",
  },
  {
    title: "Business Website",
    price: "Starting from ৳15,000",
    time: "7–10 days",
    desc: "Modern, fast, and responsive business website with contact forms.",
  },
  {
    title: "Educational Website",
    price: "Starting from ৳12,000",
    time: "6–9 days",
    desc: "School, coaching center, or educational institution websites.",
  },
  {
    title: "Blood Organization Site",
    price: "Starting from ৳10,000",
    time: "5–8 days",
    desc: "Donor management & awareness platforms for blood organizations.",
  },
  {
    title: "E-commerce / Landing Page",
    price: "Starting from ৳18,000",
    time: "8–12 days",
    desc: "Simple product showcase or full e-commerce ready landing pages.",
  },
  {
    title: "Custom Project",
    price: "Custom Quote",
    time: "Varies",
    desc: "Need something unique? Let’s discuss your requirements.",
  },
] as const;

export const initiatives = [
  {
    icon: "🏫",
    title: "FS Coaching Center",
    role: "Founder & Director",
    description:
      "Founded in 2024 to provide quality education at affordable prices to underprivileged students in Jibdara Bazar.",
  },
  {
    icon: "🤝",
    title: "Helping Hand Organization",
    role: "Founder",
    description: "Founded in 2023 to support the poor and helpless people in the community.",
  },
] as const;

export const bloodDonation = {
  title: "Shantichakra Blood Society",
  role: "Co-Founder & General Secretary",
  location: "Sunamganj",
  donations: "4× Blood Donor",
  bloodGroup: "A+ Blood Group",
  founded: "Founded 2025",
} as const;

export const galleryItems = [
  {
    image: "/assets/images/ssc-gpa5-2025.jpg",
    alt: "Rahat Ahmed SSC 2025 GPA 5.00 A+ achievement",
    title: "SSC 2025 — GPA 5.00 (A+)",
    meta: "July 2025",
    icon: "🏆",
  },
  {
    image: "/assets/images/ssc-songbordhona-2025.jpg",
    alt: "Rahat Ahmed at Meritorious Student Honor Ceremony",
    title: "Meritorious Student Honor",
    meta: "Satgaon Jibdara High School",
    icon: "🎗️",
  },
  {
    image: "/assets/images/45-science-fair-2023.jpg",
    alt: "45th National Science Fair 2023 achievements",
    title: "45th Science Fair",
    meta: "August 31, 2023",
    icon: "🥇",
  },
  {
    image: "/assets/images/helping-hand-org.jpg",
    alt: "Helping Hand Organization community work",
    title: "Helping Hand Organization",
    meta: "Founded 2023",
    icon: "🤝",
  },
  {
    image: "/assets/images/baba-farid-ahmed.jpg",
    alt: "A family tribute photograph",
    title: "Tribute",
    meta: "Family",
    icon: "🕊️",
  },
] as const;

export const skills = [
  "Web Development",
  "Teaching",
  "Blood Donation",
  "Community Service",
  "Content Creation",
] as const;

export const socialLinks = [
  { label: "Facebook", handle: "Rahat Ahmed", href: "https://www.facebook.com/rahat.ahmed.948943" },
  { label: "TikTok", handle: "@rahatvives", href: "https://www.tiktok.com/@rahatvives" },
  {
    label: "YouTube",
    handle: "@RahatAhmedOfficial0",
    href: "https://www.youtube.com/@RahatAhmedOfficial0",
  },
  { label: "Instagram", handle: "@rahatahm6d", href: "https://www.instagram.com/rahatahm6d/" },
] as const;

export interface WebsiteType {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  delivery: string;
  icon: string;
}

export interface WebsitePackage {
  id: string;
  name: string;
  price: number;
  delivery: string;
  features: readonly string[];
  popular?: boolean;
}

export interface ExtraFeature {
  id: string;
  name: string;
  price: number;
  description: string;
}

/** The single catalog consumed by the Website Order flow and Website Store district. */
export const websiteTypes: readonly WebsiteType[] = [
  {
    id: "portfolio",
    title: "Personal Portfolio",
    description: "Beautiful showcase of your work and achievements",
    startingPrice: 8000,
    delivery: "5-7 days",
    icon: "👤",
  },
  {
    id: "business",
    title: "Business Website",
    description: "Professional online presence for your company",
    startingPrice: 15000,
    delivery: "7-10 days",
    icon: "🏢",
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    description: "Sell products online with cart and payments",
    startingPrice: 25000,
    delivery: "10-14 days",
    icon: "🛒",
  },
  {
    id: "education",
    title: "School / College",
    description: "Educational institution website with courses",
    startingPrice: 18000,
    delivery: "8-12 days",
    icon: "🎓",
  },
  {
    id: "organization",
    title: "Organization / NGO",
    description: "Non-profit or community organization site",
    startingPrice: 12000,
    delivery: "6-9 days",
    icon: "🤝",
  },
  {
    id: "custom",
    title: "Custom Website",
    description: "Fully custom solution tailored to your needs",
    startingPrice: 20000,
    delivery: "Varies",
    icon: "✨",
  },
];

export const websitePackages: readonly WebsitePackage[] = [
  {
    id: "basic",
    name: "Basic",
    price: 8000,
    delivery: "5 days",
    features: ["Up to 5 pages", "Responsive design", "Contact form", "Basic SEO", "1 revision"],
  },
  {
    id: "standard",
    name: "Standard",
    price: 15000,
    delivery: "8 days",
    features: [
      "Up to 10 pages",
      "Responsive design",
      "Contact + Booking form",
      "Advanced SEO",
      "3 revisions",
      "Blog integration",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 25000,
    delivery: "12 days",
    features: [
      "Unlimited pages",
      "Responsive design",
      "Admin dashboard",
      "Payment integration",
      "Unlimited revisions",
      "AI chatbot",
      "Analytics",
    ],
  },
];

export const extraFeatures: readonly ExtraFeature[] = [
  { id: "admin", name: "Admin Panel", price: 5000, description: "Manage content easily" },
  { id: "auth", name: "User Authentication", price: 4000, description: "Login & registration" },
  { id: "blog", name: "Blog System", price: 3500, description: "Write & publish articles" },
  { id: "payment", name: "Payment Gateway", price: 6000, description: "bKash / Card payments" },
  { id: "ai", name: "AI Integration", price: 7000, description: "Chatbot or smart features" },
  { id: "multilang", name: "Multi-language", price: 3000, description: "Bangla + English support" },
  { id: "seo", name: "Advanced SEO", price: 2500, description: "Better search ranking" },
];

export interface DistrictStat {
  label: string;
  value: string;
}

export interface RahatVerseDistrict {
  id: string;
  title: string;
  icon: string;
  description: string;
  stats: readonly DistrictStat[];
  exploreRoute: string;
}

/** District labels and summaries are derived from the same canonical content above. */
export const rahatVerseDistricts: readonly RahatVerseDistrict[] = [
  {
    id: "website-store",
    title: "Website Store",
    icon: "🏢",
    description: `Order premium, modern, and mobile-first websites starting from ৳${websiteTypes[0].startingPrice.toLocaleString("en-US")}.`,
    stats: [
      {
        label: "Starting Price",
        value: `৳${websiteTypes[0].startingPrice.toLocaleString("en-US")}`,
      },
      { label: "Delivery", value: "5-12 days" },
    ],
    exploreRoute: "/order",
  },
  {
    id: "about",
    title: "About Me Center",
    icon: "👤",
    description: "Student, Teacher, Blood Donor, BNCC Cadet & Web Developer from Sunamganj.",
    stats: [
      { label: "Born", value: portfolioProfile.birthYear },
      { label: "Location", value: "Sunamganj" },
    ],
    exploreRoute: "/portfolio#about",
  },
  {
    id: "education",
    title: "Education Academy",
    icon: "🏫",
    description: `${educationItems[0].title} at ${educationItems[0].institution}. ${educationItems[1].title}.`,
    stats: [
      { label: "SSC", value: "GPA 5.00" },
      { label: "Current", value: "HSC 2nd Year" },
    ],
    exploreRoute: "/portfolio#education",
  },
  {
    id: "achievements",
    title: "Achievement Tower",
    icon: "🏆",
    description: "Multiple 1st place wins in National Science Fairs and academic excellence.",
    stats: [
      { label: "1st Places", value: "6+" },
      { label: "Achievements", value: "12+" },
    ],
    exploreRoute: "/portfolio#achievements",
  },
  {
    id: "portfolio",
    title: "Portfolio Hub",
    icon: "💼",
    description: "Modern web development projects built with Next.js, React & TypeScript.",
    stats: [
      { label: "Projects", value: "Multiple" },
      { label: "Focus", value: "Modern Web" },
    ],
    exploreRoute: "/portfolio#experience",
  },
  {
    id: "blood",
    title: "Blood Donation Center",
    icon: "❤️",
    description: `${bloodDonation.role} of ${bloodDonation.title}, ${bloodDonation.location}.`,
    stats: [
      { label: "Donations", value: portfolioProfile.bloodDonations },
      { label: "Role", value: "General Secretary" },
    ],
    exploreRoute: "/portfolio#blood",
  },
  {
    id: "gallery",
    title: "Gallery Museum",
    icon: "🖼️",
    description:
      "Memorable moments from academic achievements, blood donation, and community work.",
    stats: [
      { label: "Photos", value: "11+" },
      { label: "Categories", value: "4" },
    ],
    exploreRoute: "/portfolio#gallery",
  },
  {
    id: "contact",
    title: "Contact Center",
    icon: "📞",
    description: "Get in touch for website orders, collaboration, or any inquiry.",
    stats: [
      { label: "Response", value: "24h" },
      { label: "WhatsApp", value: "Available" },
    ],
    exploreRoute: "/portfolio#contact",
  },
];

export interface RahatVerseStop {
  id: string;
  name: string;
  position: [number, number, number];
  description: string;
}

const districtFor = (id: string): RahatVerseDistrict => {
  const district = rahatVerseDistricts.find((item) => item.id === id);
  if (!district) {
    throw new Error(`Unknown RahatVerse district: ${id}`);
  }
  return district;
};

/** One tour route shared by the automatic tour, minimap, and global navigation. */
export const rahatVerseTourStops: readonly RahatVerseStop[] = [
  {
    id: "website-store",
    name: districtFor("website-store").title,
    position: [0, 0, 0],
    description: districtFor("website-store").description,
  },
  {
    id: "about",
    name: districtFor("about").title,
    position: [0, 0, -60],
    description: districtFor("about").description,
  },
  {
    id: "education",
    name: districtFor("education").title,
    position: [-52, 0, 52],
    description: districtFor("education").description,
  },
  {
    id: "skills",
    name: "Skills",
    position: [-60, 0, 0],
    description: `${skills[0]} & ${skills[1]}.`,
  },
  {
    id: "achievements",
    name: districtFor("achievements").title,
    position: [52, 0, -52],
    description: districtFor("achievements").description,
  },
  {
    id: "portfolio",
    name: districtFor("portfolio").title,
    position: [60, 0, 0],
    description: districtFor("portfolio").description,
  },
  {
    id: "gallery",
    name: districtFor("gallery").title,
    position: [0, 0, 60],
    description: districtFor("gallery").description,
  },
  {
    id: "blood",
    name: districtFor("blood").title,
    position: [52, 0, 52],
    description: districtFor("blood").description,
  },
  {
    id: "contact",
    name: districtFor("contact").title,
    position: [-52, 0, -52],
    description: districtFor("contact").description,
  },
  {
    id: "ai",
    name: "AI Assistant",
    position: [0, 35, -35],
    description: "Future AI companion.",
  },
];

export const platformNavigation = [
  { id: "about", label: "About", websiteRoute: "/portfolio#about", districtId: "about" },
  {
    id: "education",
    label: "Education",
    websiteRoute: "/portfolio#education",
    districtId: "education",
  },
  {
    id: "achievements",
    label: "Achievements",
    websiteRoute: "/portfolio#achievements",
    districtId: "achievements",
  },
  { id: "skills", label: "Skills", websiteRoute: "/portfolio#skills", districtId: "skills" },
  {
    id: "portfolio",
    label: "Portfolio",
    websiteRoute: "/portfolio#experience",
    districtId: "portfolio",
  },
  { id: "gallery", label: "Gallery", websiteRoute: "/portfolio#gallery", districtId: "gallery" },
  {
    id: "services",
    label: "Services",
    websiteRoute: "/portfolio#services",
    districtId: "website-store",
  },
  { id: "pricing", label: "Pricing", websiteRoute: "/order", districtId: "website-store" },
  { id: "contact", label: "Contact", websiteRoute: "/portfolio#contact", districtId: "contact" },
] as const;

export const initialOrderFormData: OrderFormData = {
  name: "",
  email: "",
  phone: "",
  businessName: "",
  message: "",
};
