export interface BilingualText {
  en: string;
  bn: string;
}

export interface RealExample {
  title: string;
  desc: BilingualText;
  image: string;
  badge?: string;
}

export interface BuildingData {
  id: string;
  slug: string;
  title: BilingualText;
  subtitle: BilingualText;
  icon: string;
  color: string; // Tailwind color token/hex
  glowColor: string;
  description: BilingualText;
  targetAudience: BilingualText;
  realExamples: RealExample[];
  keyBenefits: BilingualText[];
  typicalTimeline: string;
  suggestedTech: string[];
  recommendedFeatures: string[];
  basePrice: number;
}

export const BUILDINGS_DATA: BuildingData[] = [
  {
    id: "business-website",
    slug: "business-website",
    title: { en: "Business Website Center", bn: "বিজনেস ওয়েবসাইট সেন্টার" },
    subtitle: {
      en: "Corporate identity, modern branding & lead engines",
      bn: "কর্পোরেট পরিচিতি, ব্র্যান্ডিং ও লিড জেনারেশন",
    },
    icon: "Building2",
    color: "from-blue-500 to-cyan-500",
    glowColor: "#06b6d4",
    description: {
      en: "High-converting corporate portals engineered with Next.js App Router, ultra-fast CDN asset delivery, SEO schemas, and interactive lead capturing.",
      bn: "নেক্সট.জেএস এবং দ্রুতগতির সিডিএন প্রযুক্তি দ্বারা তৈরি আধুনিক কর্পোরেট ওয়েবসাইট, যা আপনার ব্যবসাকে উচ্চমানে তুলে ধরে এবং কাস্টমার আকর্ষণ করে।",
    },
    targetAudience: {
      en: "Agencies, Startups, Law Firms, Consultancies, Real Estate, Service Companies",
      bn: "এজেন্সি, স্টার্টআপ, আইনি প্রতিষ্ঠান, কনসালটেন্সি, রিয়েল এস্টেট ও সেবামূলক প্রতিষ্ঠান",
    },
    realExamples: [
      {
        title: "Vertex Global Consulting",
        desc: {
          en: "Enterprise advisory portal with multi-branch locator & lead funnel.",
          bn: "বহুভাষিক কনসালটিং পোর্টাল এবং ইন্টারেক্টিভ অ্যাপয়েন্টমেন্ট সিস্টেম।",
        },
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
        badge: "Corporate",
      },
      {
        title: "Nova Horizon Real Estate",
        desc: {
          en: "Property catalog with interactive filtering and virtual inquiry room.",
          bn: "স্মার্ট ফিল্টারিং ও ভার্চুয়াল ইনকোয়ারি সহ রিয়েল এস্টেট প্রজেক্ট শোকেস।",
        },
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop",
        badge: "Real Estate",
      },
    ],
    keyBenefits: [
      { en: "100/100 Google Lighthouse Speed Score", bn: "১০০/১০০ গুগল লাইটহাউস স্পিড পারফরম্যান্স" },
      { en: "SEO-Optimized Metadata & OpenGraph", bn: "সার্চ ইঞ্জিন ফ্রেন্ডলি মেটাডেটা ও সোশাল শেয়ারিং" },
      { en: "Custom Contact & Lead Capture Engine", bn: "স্বয়ংক্রিয় লিড সংগ্রহের কনটাক্ট সিস্টেম" },
      { en: "CMS Admin Panel for Content Management", bn: "সহজে কন্টেন্ট আপডেট করার জন্য সিএমএস এডমিন প্যানেল" },
    ],
    typicalTimeline: "1–2 Weeks",
    suggestedTech: ["Next.js 14", "TypeScript", "Tailwind CSS", "Supabase", "Cloudinary"],
    recommendedFeatures: ["Admin Panel", "SEO Package", "User Login", "Analytics", "Multi-language"],
    basePrice: 150,
  },
  {
    id: "ecommerce-studio",
    slug: "ecommerce-studio",
    title: { en: "E-commerce Studio", bn: "ই-কমার্স স্টুডিও" },
    subtitle: {
      en: "Online stores, shopping carts & payment gateways",
      bn: "অনলাইন শপ, প্রোডাক্ট ক্যাটালগ ও ডিজিটাল পেমেন্ট",
    },
    icon: "ShoppingBag",
    color: "from-emerald-500 to-teal-500",
    glowColor: "#10b981",
    description: {
      en: "Full-scale e-commerce platforms with shopping cart, coupon rules, multi-currency support, automated invoicing, and local/global payment gateways.",
      bn: "অনলাইন শপিং কার্ট, বিকাশ/রকেট/কার্ড পেমেন্ট গেটওয়ে, ইনভেন্টরি ম্যানেজমেন্ট এবং ইনভয়েস সহ সম্পূর্ণ ই-কমার্স সমাধান।",
    },
    targetAudience: {
      en: "Online Stores, Fashion Brands, Electronics Retailers, Food Shops, Digital Goods Creators",
      bn: "অনলাইন ক্লথিং ব্র্যান্ড, ইলেকট্রনিক্স শপ, গ্যাজেট স্টোর ও খুচরা বিক্রেতা",
    },
    realExamples: [
      {
        title: "Luxe Thread Apparel",
        desc: {
          en: "Fashion storefront with instant cart, bKash/Nagad checkout and order tracking.",
          bn: "বিকাশ/নগদ পেমেন্ট ও রিয়েলটাইম অর্ডার ট্র্যাকিং সহ ক্যাজুয়াল ব্র্যান্ড স্টোর।",
        },
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
        badge: "E-Commerce",
      },
      {
        title: "Gadget Pulse BD",
        desc: {
          en: "Tech store with live stock filters, customer reviews and courier integration.",
          bn: "স্মার্ট সার্চ ও লাইভ স্টক আপডেট সহ অনলাইন টেক শপ।",
        },
        image: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=800&auto=format&fit=crop",
        badge: "Retail",
      },
    ],
    keyBenefits: [
      { en: "Local Payments (bKash/Nagad/SSLCommerz/Stripe)", bn: "বিকাশ, নগদ, কার্ড ও স্ট্রাইপ পেমেন্ট গেটওয়ে" },
      { en: "Real-time Product & Inventory Management", bn: "লাইভ প্রোডাক্ট স্টক ও ইনভেন্টরি কন্ট্রোল" },
      { en: "Automated PDF Invoices & Order SMS", bn: "স্বয়ংক্রিয় পিডিএফ ইনভয়েস ও কাস্টমার মেসেজ" },
      { en: "Customer Order Tracking Portal", bn: "কাস্টমার অর্ডার ট্র্যাকিং ও ক্লায়েন্ট ড্যাশবোর্ড" },
    ],
    typicalTimeline: "2–3 Weeks",
    suggestedTech: ["Next.js", "Supabase DB & Auth", "Stripe / Local Payment API", "Tailwind CSS"],
    recommendedFeatures: ["Payment Gateway", "User Login", "Dashboard", "Admin Panel", "Notifications"],
    basePrice: 250,
  },
  {
    id: "ngo-charity-hub",
    slug: "ngo-charity-hub",
    title: { en: "NGO & Charity Hub", bn: "এনজিও ও চ্যারিটি হাব" },
    subtitle: {
      en: "Non-profit portals, donation drives & blood networks",
      bn: "অলাভজনক সংস্থা, ফান্ডরেইজিং ও সমাজসেবা পোর্টাল",
    },
    icon: "Heart",
    color: "from-rose-500 to-red-600",
    glowColor: "#f43f5e",
    description: {
      en: "Empowering non-profits with donation portals, donor management, voluntary campaign tracking, transparency reports, and blood network hubs.",
      bn: "অনলাইন ডোনেশন, ভランটিয়ার রেজিস্ট্রেশন, ব্লাড ডোনার ডিরেক্টরি এবং চ্যারিটি প্রজেক্ট স্বচ্ছতার সাথে পরিচালনা করার প্ল্যাটফর্ম।",
    },
    targetAudience: {
      en: "Charities, NGO Foundations, Blood Donor Networks, Relief Organizations, Social Clubs",
      bn: "চ্যারিটি অর্গানাইজেশন, রক্তদান সামাজিক সংগঠন, ত্রান তহবিল ও ফাউন্ডেশন",
    },
    realExamples: [
      {
        title: "Shantichakra Blood Society",
        desc: {
          en: "Voluntary blood donation platform with emergency donor search & district alerts.",
          bn: "জরুরি রক্তদাতা খোঁজা ও ব্লাড ডোনেশন নেটওয়ার্ক পোর্টাল।",
        },
        image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?q=80&w=800&auto=format&fit=crop",
        badge: "Blood SBS",
      },
      {
        title: "Hope Hope Foundation",
        desc: {
          en: "Relief fund tracker with public donation log & campaign progress bar.",
          bn: "অনলাইন ফান্ডরেইজিং ও প্রজেক্ট ইম্প্যাক্ট ড্যাশবোর্ড।",
        },
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
        badge: "Charity",
      },
    ],
    keyBenefits: [
      { en: "Instant Online Donation System", bn: "অনলাইন নিরাপদ ডোনেশন ও ফান্ড কালেকশন" },
      { en: "Volunteer & Member Registration", bn: "ভলান্টিয়ার রেজিস্ট্রেশন ও মেম্বার ডিরেক্টরি" },
      { en: "Emergency Donor Search Engine", bn: "জরুরি রক্তদাতা ও সাহায্যপ্রার্থী সার্চ সিস্টেম" },
      { en: "Public Transparency & Impact Reports", bn: "স্বচ্ছ প্রজেক্ট আপডেট ও সোশ্যাল রিপোর্ট" },
    ],
    typicalTimeline: "1.5–2 Weeks",
    suggestedTech: ["Next.js", "Supabase RLS", "Payment Gateway", "Tailwind CSS"],
    recommendedFeatures: ["Donation System", "Admin Panel", "Search", "Multi-language", "CMS"],
    basePrice: 140,
  },
  {
    id: "personal-portfolio",
    slug: "personal-portfolio",
    title: { en: "Personal Portfolio Studio", bn: "পার্সোনাল পোর্টফোলিও স্টুডিও" },
    subtitle: {
      en: "3D interactive showcases, resumes & creative hubs",
      bn: "ইন্টারেক্টিভ ৩ডি পোর্টফোলিও, রেজুমে ও ক্রিয়েটিভ প্রোফাইল",
    },
    icon: "Briefcase",
    color: "from-purple-500 to-indigo-500",
    glowColor: "#a855f7",
    description: {
      en: "Captivating portfolio websites featuring 3D animations, interactive project showcases, bio highlights, resume downloads, and personal brand identity.",
      bn: "আপনার কাজ, অভিজ্ঞতা এবং অর্জনগুলোকে আকর্ষণীয় ৩ডি অ্যানিমেশন ও মডার্ন ডিজাইনে উপস্থাপন করার প্রিমিয়াম পোর্টফোলিও।",
    },
    targetAudience: {
      en: "Software Developers, Designers, Content Creators, Teachers, Freelancers, Executives",
      bn: "ডেভেলপার, ডিজাইনার, শিক্ষক, ফ্রিল্যান্সার, কন্টেন্ট ক্রিয়েটর ও প্রফেশনাল ব্যক্তিত্ব",
    },
    realExamples: [
      {
        title: "Rahat Ahmed Official Portfolio",
        desc: {
          en: "Interactive multi-chapter cyber portfolio with 3D city mode & dark mode.",
          bn: "৩ডি সিটি গেমিফাইড অভিজ্ঞতা ও মাল্টি-ল্যাঙ্গুয়েজ পোর্টফোলিও।",
        },
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
        badge: "Cyber 3D",
      },
      {
        title: "Aura Creative Studio Profile",
        desc: {
          en: "Sleek dark theme photography portfolio with filterable gallery.",
          bn: "স্টাইলিশ ক্রিয়েটিভ আর্ট ও ফটোগ্রাফি শোকেস।",
        },
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
        badge: "Creative",
      },
    ],
    keyBenefits: [
      { en: "High-impact Visuals & 3D Interactive Design", bn: "হাই-ইম্প্যাক্ট ভিজ্যুয়াল এবং ৩ডি গেমিফাইড এলিমেন্ট" },
      { en: "Instant Resume PDF Generation / Download", bn: "রেজুমে সিভি ডাউনলোড ও প্রফেশনাল বায়ো" },
      { en: "Filterable Project Gallery with Live Demos", bn: "ক্যাটাগরি অনুযায়ী ফিল্টারযোগ্য প্রজেক্ট গ্যালারি" },
      { en: "Social Media & Direct Messaging Integration", bn: "সোশাল মিডিয়া ও সরাসরি মেসেজিং ব্যবস্থা" },
    ],
    typicalTimeline: "1 Week",
    suggestedTech: ["Next.js", "Three.js / R3F", "Tailwind CSS", "Framer Motion"],
    recommendedFeatures: ["Blog", "CMS", "Multi-language", "Search", "Analytics"],
    basePrice: 100,
  },
  {
    id: "school-education",
    slug: "school-education",
    title: { en: "School & Education Center", bn: "স্কুল ও এডুকেশন সেন্টার" },
    subtitle: {
      en: "Academic portals, result notice boards & LMS",
      bn: "শিক্ষা প্রতিষ্ঠান, নোটিশ বোর্ড, রেজাল্ট ও টিউটরিং হাব",
    },
    icon: "GraduationCap",
    color: "from-amber-500 to-orange-500",
    glowColor: "#f59e0b",
    description: {
      en: "Comprehensive academic management portals with notice boards, routine publications, student registration, result lookup, and online tutoring hubs.",
      bn: "স্কুল, কলেজ, কোচিং বা টিউটরিং সেন্টারের জন্য রেজাল্ট শিট, ডিজিটাল নোটিশ বোর্ড ও স্টুডেন্ট পোর্টাল।",
    },
    targetAudience: {
      en: "Schools, Colleges, Coaching Centers, Online Tutors, EdTech Startups",
      bn: "স্কুল, কলেজ, বিশ্ববিদ্যালয়, ক্যাডেট কোচিং, প্রাইভেট টিউটর ও এডটেক",
    },
    realExamples: [
      {
        title: "Sunamganj Model College Portal",
        desc: {
          en: "Academic notice board, admission form & PDF result publishing.",
          bn: "অনলাইন এডমিশন ফর্ম, ডিজিটাল নোটিশ বোর্ড ও রেজাল্ট সিস্টেম।",
        },
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
        badge: "Academic",
      },
      {
        title: "Rahat Tutor Academy",
        desc: {
          en: "Home tutoring registration, batch routines & subject materials.",
          bn: "হোম টিউটরিং স্টুডেন্ট রেজিস্ট্রেশন ও সাবজেক্ট নোটস।",
        },
        image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop",
        badge: "Tutoring",
      },
    ],
    keyBenefits: [
      { en: "Digital Notice Board & Event Calendar", bn: "ডিজিটাল নোটিশ বোর্ড ও পরীক্ষার সময়সূচী" },
      { en: "Online Student Admission & Registration Form", bn: "অনলাইন ভর্তি আবেদন ফর্ম ও স্টুডেন্ট ট্র্যাকিং" },
      { en: "Result & PDF Document Publishing Center", bn: "রেজাল্ট পাবলিকেশন ও ক্লাস মেটেরিয়ালস পিডিএফ" },
      { en: "Guardian Contact & SMS Alert Integration", bn: "অভিভাবকদের জন্য কনটাক্ট ও অ্যালার্ট সিস্টেম" },
    ],
    typicalTimeline: "1.5–2.5 Weeks",
    suggestedTech: ["Next.js", "Supabase Database", "Tailwind CSS", "PDF Storage"],
    recommendedFeatures: ["Admin Panel", "Dashboard", "Search", "Notifications", "CMS"],
    basePrice: 160,
  },
  {
    id: "hospital-healthcare",
    slug: "hospital-healthcare",
    title: { en: "Hospital & Healthcare Lab", bn: "হাসপাতাল ও হেলথকেয়ার ল্যাব" },
    subtitle: {
      en: "Doctor appointments, medical catalogs & diagnostic labs",
      bn: "ডাক্তার অ্যাপয়েন্টমেন্ট, ডায়াগনস্টিক ল্যাব ও হেলথ কেয়ার",
    },
    icon: "Building",
    color: "from-blue-600 to-indigo-600",
    glowColor: "#2563eb",
    description: {
      en: "Healthcare portals featuring doctor schedule lookup, online appointment bookings, diagnostic test price lists, emergency contacts, and tele-consultation forms.",
      bn: "হাসপাতাল, ক্লিনিক বা ডায়াগনস্টিক সেন্টারের জন্য অনলাইন ডাক্তার অ্যাপয়েন্টমেন্ট, টেস্ট লিস্ট ও রিপোর্ট ট্র্যাকিং।",
    },
    targetAudience: {
      en: "Hospitals, Specialized Clinics, Doctors, Diagnostic Labs, Dental Centers",
      bn: "হাসপাতাল, ডায়াগনস্টিক সেন্টার, ডেন্টাল ক্লিনিক, চেম্বার ও প্রাকটিশনার ডাক্তার",
    },
    realExamples: [
      {
        title: "Sunamganj Care Hospital",
        desc: {
          en: "Doctor chamber schedule finder with instant booking form & helpline.",
          bn: "ডাক্তার সিডিউল সার্চ, অ্যাপয়েন্টমেন্ট বুকিং ও ইমার্জেন্সি হটলাইন।",
        },
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop",
        badge: "Hospital",
      },
      {
        title: "Aura Dental & Care Clinic",
        desc: {
          en: "Dental appointment manager with SMS confirmation reminders.",
          bn: "ডেন্টাল ট্রিটমেন্ট বুকিং ও কাস্টমার অ্যাপয়েন্টমেন্ট ক্যালেন্ডার।",
        },
        image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop",
        badge: "Clinic",
      },
    ],
    keyBenefits: [
      { en: "Smart Doctor Search & Slot Booking", bn: "ডাক্তারের সময়সূচী অনুযায়ী অ্যাপয়েন্টমেন্ট বুকিং" },
      { en: "Diagnostic Test Rate Calculator & Booking", bn: "ডায়াগনস্টিক পরীক্ষার তালিকা ও বুকিং" },
      { en: "24/7 Emergency Hotlines & Ambulance Locator", bn: "২৪/৭ জরুরি হটলাইন ও অ্যাম্বুলেন্স ইনকোয়ারি" },
      { en: "HIPAA-Friendly Privacy & Secure Data Handling", bn: "নিরাপদ ও গোপনীয় কাস্টমার ইনফরমেশন হ্যান্ডলিং" },
    ],
    typicalTimeline: "2 Weeks",
    suggestedTech: ["Next.js", "Supabase DB", "Booking Calendar API", "Tailwind CSS"],
    recommendedFeatures: ["Booking System", "Appointment System", "Admin Panel", "Notifications", "User Login"],
    basePrice: 200,
  },
  {
    id: "restaurant-hotel",
    slug: "restaurant-hotel",
    title: { en: "Restaurant & Hotel Studio", bn: "রেস্তোরাঁ ও হোটেল স্টুডিও" },
    subtitle: {
      en: "Digital food menus, table reservations & room booking",
      bn: "ডিজিটাল মেনু কার্ড, টেবিল রিজার্ভেশন ও হোটেল রুম বুকিং",
    },
    icon: "Utensils",
    color: "from-amber-600 to-red-500",
    glowColor: "#d97706",
    description: {
      en: "Interactive food menu showcases, table reservation engines, hotel room availability checking, online takeout order forms, and location maps.",
      bn: "রেস্তোরাঁর সুন্দর ডিজিটাল মেনু, কাস্টমার টেবিল রিজার্ভেশন এবং হোটেল রুম বুকিং সিস্টেম।",
    },
    targetAudience: {
      en: "Restaurants, Cafes, Resorts, Hotels, Food Delivery Outlets, Catering Services",
      bn: "রেস্তোরাঁ, ক্যাফে, রিসোর্ট, হোটেল, ফুড ডেলিভারি শপ ও ক্যাটারিং সার্ভিস",
    },
    realExamples: [
      {
        title: "Spice & Flame Bistro",
        desc: {
          en: "QR menu scanner view, table reservation calendar & takeaway order form.",
          bn: "ডিজিটাল ফুড মেনু, টেবিল রিজার্ভেশন ও টেকঅ্যাওয়ে অর্ডার।",
        },
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
        badge: "Bistro",
      },
      {
        title: "Haor Echo Resort",
        desc: {
          en: "Luxury cottage booking portal with room photo gallery & payment deposit.",
          bn: "হোটেল ও রিসোর্ট রুম বুকিং এবং ফটো গ্যালারি পোর্টাল।",
        },
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
        badge: "Resort",
      },
    ],
    keyBenefits: [
      { en: "Interactive Digital Menu Card with QR Code Support", bn: "কিউআর কোড স্ক্যান সহ আকর্ষণীয় ডিজিটাল মেনু" },
      { en: "Instant Table & Room Booking Calendar", bn: "রিয়েলটাইম টেবিল ও রিসোর্ট রুম বুকিং সিস্টেম" },
      { en: "Online Takeaway / Delivery Order Engine", bn: "অনলাইন খাবার অর্ডার ও হোম ডেলিভারি সিস্টেম" },
      { en: "Google Maps & Tourist Location Guide", bn: "লোকেশন ম্যাপস ও কাস্টমার রিভিউ ডিসপ্লে" },
    ],
    typicalTimeline: "1.5 Weeks",
    suggestedTech: ["Next.js", "Supabase", "Cloudinary Images", "Tailwind CSS"],
    recommendedFeatures: ["Booking System", "Payment Gateway", "Admin Panel", "Live Chat"],
    basePrice: 120,
  },
  {
    id: "custom-software",
    slug: "custom-software",
    title: { en: "Custom Software Center", bn: "কাস্টম সফটওয়্যার সেন্টার" },
    subtitle: {
      en: "Tailored SaaS platforms, CRM/ERP & internal dashboards",
      bn: "কাস্টম ড্যাশবোর্ড, সিআরএম/ইআরপি সফটওয়্যার ও সাাস পোর্টাল",
    },
    icon: "Code",
    color: "from-violet-600 to-purple-600",
    glowColor: "#7c3aed",
    description: {
      en: "Bespoke SaaS applications, internal workflow management tools, client dashboards, complex database systems, and custom automated logic.",
      bn: "আপনার বিজনেস প্রসসের জন্য সম্পূর্ণ কাস্টমাইজড ওয়েব অ্যাপ্লিকেশন, সিআরএম, ইনভয়েসিং বা ইন্টারনাল সফটওয়্যার সমাধান।",
    },
    targetAudience: {
      en: "Tech SaaS Founders, Enterprise Companies, Logistics Providers, Large Teams",
      bn: "স্টার্টআপ ফাউন্ডার, লজিস্টিকস কোম্পানি, বড় টিম ও প্রসেস অটোমেশন প্রজেক্ট",
    },
    realExamples: [
      {
        title: "PulseFlow SaaS Platform",
        desc: {
          en: "Multi-tenant client management portal with real-time analytics & team roles.",
          bn: "মাল্টি-ইউজার সিআরএম ড্যাশবোর্ড এবং রিয়েলটাইম অ্যানালিটিক্স।",
        },
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
        badge: "SaaS",
      },
      {
        title: "OmniTrack Logistics ERP",
        desc: {
          en: "Custom delivery dispatch manager with vehicle logs & automated billing.",
          bn: "ইন্টারনাল লজিস্টিকস ইনভেন্টরি ও বিলিং ম্যানেজমেন্ট সফটওয়্যার।",
        },
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
        badge: "ERP",
      },
    ],
    keyBenefits: [
      { en: "Role-Based Access Control (RBAC)", bn: "রোল ভিত্তিক ইউজার পারমিশন (এডমিন, স্টাফ, ক্লায়েন্ট)" },
      { en: "Complex Database Schema & Supabase RLS Security", bn: "উচ্চমানের সিকিউরিটি ও ব্যাকএন্ড ডাটাবেস আর্কিটেকচার" },
      { en: "Custom Analytics & Visual Charts", bn: "গ্রাফ ও চার্ট সহ কাস্টম অ্যানালিটিক্স রিপোর্ট" },
      { en: "Third-Party API Integrations (CRM, Email, SMS)", bn: "থার্ডপার্টি এপিআই ও মেসেজিং অটোমেশন" },
    ],
    typicalTimeline: "3–4 Weeks",
    suggestedTech: ["Next.js App Router", "Supabase DB / Auth / Edge", "Tailwind CSS", "TypeScript"],
    recommendedFeatures: ["Admin Panel", "Dashboard", "Authentication", "User Login", "API Integration"],
    basePrice: 400,
  },
  {
    id: "ai-automation",
    slug: "ai-automation",
    title: { en: "AI Automation Center", bn: "এআই অটোমেশন সেন্টার" },
    subtitle: {
      en: "AI chatbots, smart content generators & LLM integrations",
      bn: "কৃত্রিম বুদ্ধিমত্তা (AI) চ্যাটবট, কনটেন্ট জেনারেটর ও স্মার্ট সিস্টেম",
    },
    icon: "Cpu",
    color: "from-fuchsia-500 to-pink-500",
    glowColor: "#d946ef",
    description: {
      en: "State-of-the-art AI integration into web portals: custom trained chatbots, automated document summaries, image AI pipelines, and intelligent recommendation systems.",
      bn: "ওয়েবসাইটে কৃত্রিম বুদ্ধিমত্তার সংযোজন: ২৪/৭ স্মার্ট এআই কাস্টমার সাপোর্ট চ্যাটবট, কনটেন্ট মেকিং ও ডাটা প্রসেসিং।",
    },
    targetAudience: {
      en: "Modern Digital Businesses, Customer Support Desks, EdTech, Content Creators",
      bn: "স্মার্ট ডিজিটাল এজেন্সি, কাস্টমার সাপোর্ট টিম, এডটেক ও উদ্ভাবনী স্টার্টআপ",
    },
    realExamples: [
      {
        title: "OmniAI Support Assistant",
        desc: {
          en: "Embedded customer support agent trained on site FAQs and product catalog.",
          bn: "ওয়েবসাইটে ২৪/৭ সক্রিয় কাস্টমার হেল্পডেস্ক এআই অ্যাসিস্ট্যান্ট।",
        },
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
        badge: "AI Support",
      },
      {
        title: "NeuroWriter Engine",
        desc: {
          en: "Automated blog writer and marketing copy generator web tool.",
          bn: "স্বয়ংক্রিয় ব্লগ ও সোশ্যাল কন্টেন্ট তৈরি করার এআই ওয়েব সফটওয়্যার।",
        },
        image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop",
        badge: "LLM App",
      },
    ],
    keyBenefits: [
      { en: "24/7 Intelligent AI Customer Assistant", bn: "২৪/৭ কাস্টমার সাপোর্ট ও অটো-রেসপন্স এআই" },
      { en: "OpenAI / Claude / Gemini API Integration", bn: "বিশ্বমানের এআই মডেলের সরাসরি সংযোগ" },
      { en: "Automated Content & Translation Pipelines", bn: "স্বয়ংক্রিয় কন্টেন্ট তৈরি ও অনুবাদ সুবিধা" },
      { en: "Predictive Analytics & Smart Recommendations", bn: "স্মার্ট রিকমেন্ডেশন ও ডাটা প্রেডিকশন" },
    ],
    typicalTimeline: "3–4 Weeks",
    suggestedTech: ["Next.js", "OpenAI / Claude API", "Supabase Vector DB", "Tailwind CSS"],
    recommendedFeatures: ["AI Integration", "API Integration", "Live Chat", "Admin Panel", "Dashboard"],
    basePrice: 500,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   AI CONSULTANT QUESTIONS DATA
   ───────────────────────────────────────────────────────────────────────────── */

export interface QuestionOption {
  id: string;
  label: BilingualText;
  description?: BilingualText;
  recommendBuilding?: string;
  addFeatures?: string[];
  recommendPackage?: "starter" | "professional" | "business" | "enterprise";
}

export interface ConsultantQuestion {
  id: string;
  question: BilingualText;
  options: QuestionOption[];
}

export const AI_CONSULTANT_QUESTIONS: ConsultantQuestion[] = [
  {
    id: "business_type",
    question: {
      en: "What type of business or project are you launching?",
      bn: "আপনার ব্যবসা বা প্রজেক্টের ধরন কী?",
    },
    options: [
      {
        id: "corporate",
        label: { en: "Company / Business Services", bn: "কোম্পানি / সার্ভিস বিজনেস" },
        recommendBuilding: "business-website",
        recommendPackage: "professional",
      },
      {
        id: "ecommerce",
        label: { en: "Online Shop / E-commerce Store", bn: "অনলাইন শপ / ই-কমার্স স্টোর" },
        recommendBuilding: "ecommerce-studio",
        recommendPackage: "business",
        addFeatures: ["Payment Gateway", "User Login", "Dashboard"],
      },
      {
        id: "personal",
        label: { en: "Personal Portfolio / Brand Showcase", bn: "পার্সোনাল পোর্টফোলিও / প্রফেশনাল বায়ো" },
        recommendBuilding: "personal-portfolio",
        recommendPackage: "starter",
      },
      {
        id: "charity",
        label: { en: "NGO / Social Organization / Charity", bn: "এনজিও / সামাজিক সংস্থা / চ্যারিটি" },
        recommendBuilding: "ngo-charity-hub",
        recommendPackage: "starter",
        addFeatures: ["Donation System"],
      },
      {
        id: "school",
        label: { en: "School / College / Tutors", bn: "শিক্ষা প্রতিষ্ঠান / প্রাইভেট টিউটরিং" },
        recommendBuilding: "school-education",
        recommendPackage: "professional",
      },
      {
        id: "hospital",
        label: { en: "Hospital / Clinic / Doctors", bn: "হাসপাতাল / ক্লিনিক / ডাক্তার" },
        recommendBuilding: "hospital-healthcare",
        recommendPackage: "business",
        addFeatures: ["Booking System", "Appointment System"],
      },
      {
        id: "restaurant",
        label: { en: "Restaurant / Cafe / Hotel", bn: "রেস্তোরাঁ / ক্যাফে / হোটেল ও রিসোর্ট" },
        recommendBuilding: "restaurant-hotel",
        recommendPackage: "professional",
        addFeatures: ["Booking System"],
      },
      {
        id: "saas",
        label: { en: "Custom Software / SaaS / ERP", bn: "কাস্টম সফটওয়্যার / সাাস পোর্টাল" },
        recommendBuilding: "custom-software",
        recommendPackage: "enterprise",
        addFeatures: ["Admin Panel", "Dashboard", "Authentication", "API Integration"],
      },
      {
        id: "ai_tool",
        label: { en: "AI Tools & Smart Automation", bn: "এআই টুলস ও স্মার্ট অটোমেশন" },
        recommendBuilding: "ai-automation",
        recommendPackage: "enterprise",
        addFeatures: ["AI Integration", "API Integration"],
      },
    ],
  },
  {
    id: "existing_site",
    question: {
      en: "Do you currently have an existing website?",
      bn: "আপনার কি বর্তমানে কোন ওয়েবসাইট আছে?",
    },
    options: [
      {
        id: "no_site",
        label: { en: "No, starting brand new from scratch", bn: "না, সম্পূর্ণ নতুনভাবে তৈরি করতে চাই" },
      },
      {
        id: "outdated_site",
        label: { en: "Yes, but it is outdated and slow", bn: "হ্যাঁ, তবে সেটি পুরনো ও ধীরগতির" },
        addFeatures: ["SEO Package"],
      },
      {
        id: "redesign_site",
        label: { en: "Yes, need a complete dynamic overhaul", bn: "হ্যাঁ, রি-ডিজাইন ও মডার্ন ফিচারস যুক্ত করতে চাই" },
        addFeatures: ["SEO Package", "Maintenance Plan"],
      },
    ],
  },
  {
    id: "primary_goal",
    question: {
      en: "What is the primary goal of your new website?",
      bn: "এই ওয়েবসাইট থেকে আপনার মূল লক্ষ্য কী?",
    },
    options: [
      {
        id: "leads",
        label: { en: "Capture client inquiries & phone leads", bn: "কাস্টমার এনকোয়ারি ও লিড সংগ্রহ করা" },
        addFeatures: ["SEO Package"],
      },
      {
        id: "sales",
        label: { en: "Sell products/services directly online", bn: "অনলাইনে সরাসরি পণ্য বা সেবা বিক্রি করা" },
        addFeatures: ["Payment Gateway", "User Login"],
        recommendPackage: "business",
      },
      {
        id: "branding",
        label: { en: "Build trust, brand authority & credibility", bn: "ব্র্যান্ড ভ্যালু ও গ্রহণযোগ্যতা বাড়ানো" },
      },
      {
        id: "automation",
        label: { en: "Automate internal operations & client portals", bn: "ব্যবসায়িক কাজ ও ক্লায়েন্ট সিস্টেম অটোমেট করা" },
        addFeatures: ["Admin Panel", "Dashboard"],
        recommendPackage: "business",
      },
    ],
  },
  {
    id: "admin_needed",
    question: {
      en: "Do you need a Content Admin Panel to manage text, orders or photos?",
      bn: "আপনার কি কন্টেন্ট, অর্ডার বা ছবি এডিট করার জন্য এডমিন প্যানেল দরকার?",
    },
    options: [
      {
        id: "admin_yes",
        label: { en: "Yes, I want total control over content", bn: "হ্যাঁ, ওয়েবসাইট এডিট করার জন্য এডমিন প্যানেল চাই" },
        addFeatures: ["Admin Panel", "CMS"],
      },
      {
        id: "admin_no",
        label: { en: "No, simple static showcase is enough", bn: "না, সহজ স্ট্যাটিক ডিজাইন হলেই চলবে" },
      },
    ],
  },
  {
    id: "payments_needed",
    question: {
      en: "Will your website collect online payments (bKash, Nagad, Card, Stripe)?",
      bn: "ওয়েবসাইটে কি অনলাইন পেমেন্ট (বিকাশ, নগদ, কার্ড, স্ট্রাইপ) প্রয়োজন?",
    },
    options: [
      {
        id: "pay_yes",
        label: { en: "Yes, online digital checkout is required", bn: "হ্যাঁ, অনলাইন পেমেন্ট প্রয়োজন" },
        addFeatures: ["Payment Gateway"],
      },
      {
        id: "pay_no",
        label: { en: "No online payments required right now", bn: "না, এখন পেমেন্ট গেটওয়ে লাগবে না" },
      },
    ],
  },
  {
    id: "ai_needed",
    question: {
      en: "Do you want AI features (Smart chatbot, auto content generation)?",
      bn: "আপনার কি এআই চ্যাটবট বা এআই ফিচারস প্রয়োজন?",
    },
    options: [
      {
        id: "ai_yes",
        label: { en: "Yes! I want futuristic AI capabilities", bn: "হ্যাঁ! স্মার্ট এআই ফিচারস যুক্ত করতে চাই" },
        addFeatures: ["AI Features"],
      },
      {
        id: "ai_no",
        label: { en: "Not required at the moment", bn: "না, এখন প্রয়োজন নেই" },
      },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   BUILDER FEATURES LIST & PRICING
   ───────────────────────────────────────────────────────────────────────────── */

export interface BuilderFeature {
  id: string;
  name: string;
  nameBn: string;
  category: "core" | "auth" | "business" | "advanced";
  cost: number;
  icon: string;
  description: BilingualText;
}

export const BUILDER_FEATURES: BuilderFeature[] = [
  {
    id: "admin-panel",
    name: "Admin Panel",
    nameBn: "এডমিন প্যানেল",
    category: "core",
    cost: 50,
    icon: "ShieldCheck",
    description: {
      en: "Full CMS dashboard to manage products, blogs, settings and inquiries.",
      bn: "কন্টেন্ট, অর্ডার ও সেটিংস নিয়ন্ত্রণ করার ব্যাকএন্ড সিস্টেম।",
    },
  },
  {
    id: "user-login",
    name: "User Login & Auth",
    nameBn: "ইউজার লগইন ও মেম্বারশিপ",
    category: "auth",
    cost: 40,
    icon: "Lock",
    description: {
      en: "Secure registration, login, password recovery and user profile management.",
      bn: "নিরাপদ সাইন আপ, পাসওয়ার্ড রিকভারি ও কাস্টমার প্রোফাইল।",
    },
  },
  {
    id: "dashboard",
    name: "Client Dashboard",
    nameBn: "ক্লায়েন্ট ড্যাশবোর্ড",
    category: "auth",
    cost: 60,
    icon: "LayoutDashboard",
    description: {
      en: "Dedicated client portal for project status, invoices, and file downloads.",
      bn: "কাস্টমারের নিজস্ব অর্ডার ট্র্যাকিং ও বিলিং ড্যাশবোর্ড।",
    },
  },
  {
    id: "blog-cms",
    name: "Blog & Article CMS",
    nameBn: "ব্লগ ও আর্টিকেল সিএমএস",
    category: "core",
    cost: 40,
    icon: "Rss",
    description: {
      en: "Publish news, updates, articles with rich formatting and category filters.",
      bn: "নিয়মিত খবর, টিপস ও আর্টিকেল পাবলিশ করার ব্লগ হাব।",
    },
  },
  {
    id: "booking-system",
    name: "Booking / Appointment",
    nameBn: "বুকিং ও অ্যাপয়েন্টমেন্ট",
    category: "business",
    cost: 70,
    icon: "Calendar",
    description: {
      en: "Interactive calendar for table, doctor, meeting or room reservations.",
      bn: "সময় ও ডেট সিলেক্ট করে অনলাইন অ্যাপয়েন্টমেন্ট নেওয়া।",
    },
  },
  {
    id: "donation-system",
    name: "Donation & Charity Engine",
    nameBn: "ডোনেশন ও চ্যারিটি গেটওয়ে",
    category: "business",
    cost: 60,
    icon: "Heart",
    description: {
      en: "Public progress tracking bars, donor logs, and one-click donations.",
      bn: "অনলাইন অনুদান সংগ্রহ ও সাহায্য ফান্ড ট্র্যাক করার ব্যবস্থা।",
    },
  },
  {
    id: "payment-gateway",
    name: "Payment Gateway",
    nameBn: "পেমেন্ট গেটওয়ে (bKash/Stripe)",
    category: "business",
    cost: 80,
    icon: "CreditCard",
    description: {
      en: "bKash, Nagad, Credit Cards, SSLCommerz and Stripe payment processing.",
      bn: "অনলাইন দ্রুত ও নিরাপদ পেমেন্ট সার্ভিস সংযুক্তকরণ।",
    },
  },
  {
    id: "ai-features",
    name: "AI Features & Chatbot",
    nameBn: "এআই ফিচারস ও স্মার্ট চ্যাটবট",
    category: "advanced",
    cost: 120,
    icon: "Sparkles",
    description: {
      en: "24/7 custom trained AI support bot, auto-content and AI translation.",
      bn: "ওয়েবসাইটে কৃত্রিম বুদ্ধিমত্তাসম্পন্ন চ্যাটবট ও অটোমেশন।",
    },
  },
  {
    id: "custom-integrations",
    name: "API & CRM Integrations",
    nameBn: "এপিআই ও কাস্টম ইন্টিগ্রেশন",
    category: "advanced",
    cost: 60,
    icon: "Workflow",
    description: {
      en: "Connect WhatsApp, Google Sheet, Mailchimp, SMS API or external databases.",
      bn: "হোয়াটসঅ্যাপ, গুগল শিট, ক্লাউডিনারি ও এসএমএস এপিআই যুক্তকরণ।",
    },
  },
  {
    id: "seo-package",
    name: "Advanced SEO Package",
    nameBn: "অ্যাডভান্সড এসইও প্যাকেজ",
    category: "core",
    cost: 50,
    icon: "Search",
    description: {
      en: "On-page Schema markup, Google Search Console indexing, sitemaps & speed.",
      bn: "গুগল সার্চে র‍্যাঙ্ক করার জন্য গুগল সাইটম্যাপ ও মেটাডেটা।",
    },
  },
  {
    id: "maintenance-plan",
    name: "Maintenance & Security",
    nameBn: "সিকিউরিটি ও ব্যাকআপ মেইনটেন্যান্স",
    category: "advanced",
    cost: 50,
    icon: "ShieldAlert",
    description: {
      en: "Monthly cloud backups, security patches, bug fixes and tech assistance.",
      bn: "মাসিক ক্লাউড ব্যাকআপ, সাইট সিকিউরিটি ও মেইনটেন্যান্স।",
    },
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   4 FUTURISTIC PORTALS (PACKAGE EXPERIENCE)
   ───────────────────────────────────────────────────────────────────────────── */

export interface PortalPackage {
  id: "starter" | "professional" | "business" | "enterprise";
  title: string;
  titleBn: string;
  badge: string;
  priceRange: string;
  priceValue: number;
  deliveryTime: string;
  color: string;
  glowColor: string;
  description: BilingualText;
  recommendedAudience: BilingualText;
  features: BilingualText[];
  scalability: string;
  upgradePath: BilingualText;
}

export const PORTAL_PACKAGES: PortalPackage[] = [
  {
    id: "starter",
    title: "Starter Portal",
    titleBn: "স্টার্টার পোর্টাল",
    badge: "Essential",
    priceRange: "$100 – $250",
    priceValue: 120,
    deliveryTime: "3–7 Days",
    color: "from-cyan-500 to-blue-600",
    glowColor: "#06b6d4",
    description: {
      en: "Perfect launchpad for single page landing pages, portfolios, personal showcases or simple charity sites.",
      bn: "ল্যান্ডিং পেজ, পার্সোনাল পোর্টফোলিও বা সাধারণ সামাজিক সংগঠনের জন্য দ্রুততম স্টার্টার অপশন।",
    },
    recommendedAudience: {
      en: "Students, Freelancers, Solopreneurs, Single Product Launches",
      bn: "স্টুডেন্ট, নতুন ফ্রিল্যান্সার, ইন্ডি উদ্ভাবক ও একক পণ্য শোকেস",
    },
    features: [
      { en: "Up to 3 Interactive Pages", bn: "৩ টি পর্যন্ত ইন্টারেক্টিভ পেজ" },
      { en: "Responsive Ultra-Fast Mobile Design", bn: "১০০% রেসপন্সিভ মোবাইল ডিজাইন" },
      { en: "Direct Contact Form & Social Links", bn: "সরাসরি কনটাক্ট ফর্ম ও সোশ্যাল আইকন" },
      { en: "Basic SEO & Google Indexing", bn: "গুগল ইনডেক্সিং ও মেটাডেটা" },
      { en: "1 Month Tech Guarantee", bn: "১ মাসের টেকনিক্যাল ওয়ারেন্টি" },
    ],
    scalability: "Level 1 — Lightweight & Fast",
    upgradePath: {
      en: "Upgrade seamlessly to Professional Portal as your user base expands.",
      bn: "ইউজার বৃদ্ধি পেলে সহজেই প্রফেশনাল পোর্তালে আপগ্রেড করা যাবে।",
    },
  },
  {
    id: "professional",
    title: "Professional Portal",
    titleBn: "প্রফেশনাল পোর্টাল",
    badge: "Most Popular",
    priceRange: "$250 – $500",
    priceValue: 300,
    deliveryTime: "1–2 Weeks",
    color: "from-purple-500 to-indigo-600",
    glowColor: "#8b5cf6",
    description: {
      en: "Complete business growth solution with CMS admin panel, blog engine, multilingual support, and analytics.",
      bn: "সিএমএস এডমিন প্যানেল, মাল্টি-ল্যাঙ্গুয়েজ, ব্লগ ও এনালিটিক্স সহ সম্পূর্ণ ব্যবসায়িক পোর্টাল।",
    },
    recommendedAudience: {
      en: "Small Businesses, Agencies, Schools, Clinics, Consultancies",
      bn: "মাঝারি ব্যবসা, এজেন্সি, স্কুল-কলেজ, ক্লিনিক ও কনসালটেন্সি ফার্ম",
    },
    features: [
      { en: "Up to 8 Custom Dynamic Pages", bn: "৮ টি পর্যন্ত কাস্টম পেজ" },
      { en: "Full CMS Admin Panel Control", bn: "সম্পূর্ণ সিএমএস এডমিন প্যানেল" },
      { en: "Bilingual Support (English & Bangla)", bn: "বাংলা ও ইংরেজি উভ্য ভাষার সুবিধা" },
      { en: "Blog Publishing & Category System", bn: "ব্লগ ও পাবলিকেশন সিস্টেম" },
      { en: "Advanced SEO & OpenGraph Optimizations", bn: "অ্যাডভান্সড এসইও ও সোশ্যাল শেয়ারিং" },
      { en: "3 Months Maintenance Support", bn: "৩ মাসের ফ্রি ব্যাকআপ ও মেইনটেন্যান্স" },
    ],
    scalability: "Level 3 — Dynamic Cloud Ready",
    upgradePath: {
      en: "Integrate Payment Gateways or Booking Systems to transition to Business Portal.",
      bn: "পেমেন্ট বা বুকিং সিস্টেম যোগ করে বিজনেস পোর্টালে উন্নীত করা যাবে।",
    },
  },
  {
    id: "business",
    title: "Business Pro Portal",
    titleBn: "বিজনেস প্রো পোর্টাল",
    badge: "High Growth",
    priceRange: "$500 – $1,200",
    priceValue: 650,
    deliveryTime: "2–3 Weeks",
    color: "from-emerald-500 to-teal-600",
    glowColor: "#10b981",
    description: {
      en: "Full e-commerce stores, appointment booking engines, digital payment checkouts and customer dashboards.",
      bn: "ই-কমার্স অনলাইন শপ, পেমেন্ট গেটওয়ে, বুকিং অ্যালগরিদম ও কাস্টমার ড্যাশবোর্ড সমাধান।",
    },
    recommendedAudience: {
      en: "E-Commerce Brands, Hotels, Hospitals, Multi-branch Companies",
      bn: "অনলাইন ই-কমার্স ব্র্যান্ড, রিসোর্ট, হাসপাতাল ও বহুমাত্রিক প্রতিষ্ঠান",
    },
    features: [
      { en: "Up to 15 Dynamic Complex Pages", bn: "১৫ টি পর্যন্ত ডায়নামিক পেজ" },
      { en: "Payment Gateway (bKash/Nagad/Cards/Stripe)", bn: "বিকাশ, নগদ, ডেবিট/ক্রেডিট কার্ড ও স্ট্রাইপ" },
      { en: "Customer Login & Order Tracking Dashboard", bn: "ইউজার একাউন্ট ও কাস্টমার ইনভয়েস ড্যাশবোর্ড" },
      { en: "Booking or Inventory Engine", bn: "ইনভেন্টরি বা অ্যাপয়েন্টমেন্ট বুকিং ইঞ্জিন" },
      { en: "Automated PDF Invoices & Email/SMS Alerts", bn: "অটোমেটেড ইনভয়েস ও মেসেজিং সিস্টেম" },
      { en: "6 Months Priority Support", bn: "৬ মাসের প্রায়োরিটি মেইনটেন্যান্স" },
    ],
    scalability: "Level 4 — High Concurrent Capacity",
    upgradePath: {
      en: "Add AI automated support nodes to enter Enterprise Portal.",
      bn: "এআই সাপোর্ট অ্যাসিস্ট্যান্ট যোগ করে এন্টারপ্রাইজ লেভেলে আপগ্রেড করুন।",
    },
  },
  {
    id: "enterprise",
    title: "Enterprise AI Portal",
    titleBn: "এন্টারপ্রাইজ এআই পোর্টাল",
    badge: "Futuristic",
    priceRange: "$1,200+",
    priceValue: 1200,
    deliveryTime: "3–4 Weeks",
    color: "from-fuchsia-500 to-pink-600",
    glowColor: "#d946ef",
    description: {
      en: "Custom SaaS applications, AI automated chatbots, complex internal ERPs, and high-scale cloud infrastructure.",
      bn: "কাস্টম সাাস, এআই চ্যাটবট, ইন্টারনাল সিআরএম ও উচ্চক্ষমতাসম্পন্ন ক্লাউড সিস্টেম।",
    },
    recommendedAudience: {
      en: "Tech SaaS Startups, Large Organizations, AI Ventures, High-Traffic Apps",
      bn: "আইটি স্টার্টআপ, বড় কর্পোরেট হাউস, এআই ভেনচার ও গ্লোবাল ব্র্যান্ড",
    },
    features: [
      { en: "Unlimited Scalable Pages & Custom Routes", bn: "আনলিমিটেড স্কেলেবল পেজ ও ব্যাকএন্ড আর্কিটেকচার" },
      { en: "AI Support Agent Trained on Your Data", bn: "আপনার তথ্যে ট্রেইন্ড এআই সাপোর্ট অ্যাসিস্ট্যান্ট" },
      { en: "Custom API & External System Integrations", bn: "থার্ডপার্টি এপিআই ও গ্লোবাল সিস্টেম কানেক্টিভিটি" },
      { en: "Role-Based Multi-Level Admin Control (RBAC)", bn: "মাল্টি-লেভেল ইউজার ও পারমিশন কন্ট্রোল" },
      { en: "24/7 Dedicated Developer & SLA Guarantee", bn: "২৪/৭ ডেডিকেটেড সাপোর্ট ও এসএলএ গ্যারান্টি" },
      { en: "1 Year Enterprise Security & Cloud Backups", bn: "১ বছরের সিকিউরিটি সিকিউর ব্যাকআপ" },
    ],
    scalability: "Level 5 — Unlimited Infinite Scale",
    upgradePath: {
      en: "Continuous dedicated feature sprints and AI model fine-tuning.",
      bn: "নিয়মিত কাস্টম ফিচার স্প্রিন্ট ও এআই মডেল রিফাইনমেন্ট।",
    },
  },
];
