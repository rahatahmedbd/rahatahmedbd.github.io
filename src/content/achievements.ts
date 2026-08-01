import type { Bilingual } from "@/types";

export const achievements = {
  eyebrow: { bn: "স্বীকৃতি ও পুরস্কার", en: "Recognition & Awards" } as Bilingual,
  title: { bn: "অর্জনসমূহ", en: "Achievements" } as Bilingual,
  subtitle: {
    bn: "বিজ্ঞান, শিক্ষা এবং সমাজসেবায় অর্জিত সম্মাননা ও পুরস্কারসমূহ",
    en: "Awards and recognition earned in science, education, and community service",
  } as Bilingual,
  stats: [
    { value: 12, suffix: true, label: { bn: "মোট অর্জন", en: "Total Achievements" } },
    { value: 6, suffix: true, label: { bn: "১ম স্থান", en: "1st Positions" } },
    { value: 2, suffix: false, label: { bn: "GPA 5.00 (A+)", en: "GPA 5.00 (A+)" } },
  ] as Array<{ value: number; suffix: boolean; label: Bilingual }>,
  featured: {
    badge: { bn: "বিশেষ অর্জন", en: "Featured Achievement" } as Bilingual,
    date: { bn: "১০ জুলাই, ২০২৫", en: "July 10, 2025" } as Bilingual,
    title: { bn: "SSC পরীক্ষায় GPA 5.00 (A+)", en: "SSC Examination GPA 5.00 (A+)" } as Bilingual,
    desc: {
      bn: "সাতগাঁও জীবদাড়া উচ্চ বিদ্যালয় থেকে বিজ্ঞান বিভাগে GPA 5.00 (A+) অর্জন। এই সাফল্যের জন্য শান্তিচক্র ব্লাড সোসাইটি এবং বিদ্যালয় কর্তৃপক্ষ কর্তৃক বিশেষ সম্মাননা প্রদান করা হয়।",
      en: "Achieved GPA 5.00 (A+) in Science group from Satgaon Jibdara High School. Received special honors from Shantichakra Blood Society and school authorities for this success.",
    } as Bilingual,
    tags: [
      "GPA 5.00",
      "A+",
      { bn: "বিজ্ঞান বিভাগ", en: "Science Group" },
      { bn: "সংবর্ধিত", en: "Honored" },
    ] as Array<string | Bilingual>,
  },
  cards: [
    {
      icon: "🎖️",
      year: { bn: "২০১৯", en: "2019" },
      title: { bn: "PSC — GPA 5.00", en: "PSC — GPA 5.00" },
      desc: {
        bn: "জীবদাড়া সরকারি প্রাথমিক বিদ্যালয় থেকে জিপিএ ৫.০০ পেয়ে উত্তীর্ণ",
        en: "Passed with GPA 5.00 from Jibdara Government Primary School",
      },
      badge: "GPA 5.00",
      tone: "success",
    },
    {
      icon: "🥇",
      year: { bn: "২০২০", en: "2020" },
      title: { bn: "৪২তম বিজ্ঞান মেলা — ১ম স্থান", en: "42nd Science Fair — 1st Place" },
      desc: {
        bn: "৪২তম জাতীয় বিজ্ঞান ও প্রযুক্তি সপ্তাহে উপজেলা পর্যায়ে প্রথম স্থান অর্জন",
        en: "Achieved 1st place at Upazila level in the 42nd National Science & Technology Week",
      },
      badge: "🏆 1st Place",
      tone: "default",
    },
    {
      icon: "🥇",
      year: { bn: "২০২৩", en: "2023" },
      title: { bn: "৪৫তম বিজ্ঞান মেলা", en: "45th Science Fair" },
      desc: {
        bn: "বিজ্ঞান কুইজে ১ম স্থান, উপস্থিত বক্তৃতায় ২য় স্থান এবং বিজ্ঞান প্রজেক্টে ৩য় স্থান অর্জন",
        en: "1st in Science Quiz, 2nd in Impromptu Speech, and 3rd in Science Project",
      },
      badges: ["🥇 1st", "🥈 2nd", "🥉 3rd"],
      tone: "default",
    },
    {
      icon: "🏆",
      year: { bn: "২০২৪", en: "2024" },
      title: { bn: "৪৪তম বিজ্ঞান প্রদর্শনী — ১ম স্থান", en: "44th Science Exhibition — 1st Place" },
      desc: {
        bn: "৪৪তম জাতীয় বিজ্ঞান ও প্রযুক্তি সপ্তাহের বিজ্ঞান প্রদর্শনীতে দ্বিতীয়বারের মতো প্রথম স্থান অর্জন",
        en: "Achieved 1st place for the second time in Science Exhibition of 44th National Science & Technology Week",
      },
      badge: "🏆 1st Place",
      tone: "default",
    },
    {
      icon: "🧠",
      year: { bn: "২০২৪", en: "2024" },
      title: { bn: "সৃজনশীল মেধা অন্বেষণ — ১ম স্থান", en: "Creative Talent Search — 1st Place" },
      desc: {
        bn: "সৃজনশীল মেধা অন্বেষণ প্রতিযোগিতায় বিজ্ঞান বিষয়ে প্রথম স্থান অর্জন",
        en: "Achieved 1st position in Science in the Creative Talent Search Competition",
      },
      badge: "🏆 1st in Science",
      tone: "default",
    },
    {
      icon: "🥇",
      year: { bn: "২০২৫", en: "2025" },
      title: { bn: "৪৬তম বিজ্ঞান মেলা", en: "46th Science Fair" },
      desc: {
        bn: "বিজ্ঞান কুইজে ১ম স্থান, বিজ্ঞান প্রজেক্টে ৩য় স্থান এবং বিজ্ঞান অলিম্পিয়াডে ৪র্থ স্থান",
        en: "1st in Science Quiz, 3rd in Science Project, and 4th in Science Olympiad",
      },
      badges: ["🥇 1st Quiz", "🥉 3rd Project"],
      tone: "default",
    },
    {
      icon: "🎗️",
      year: { bn: "২০২৫", en: "2025" },
      title: { bn: "কৃতী শিক্ষার্থী সংবর্ধনা", en: "Meritorious Student Honor" },
      desc: {
        bn: "সাতগাঁও জীবদাড়া উচ্চ বিদ্যালয়ে A+ প্রাপ্ত তিনজন কৃতী শিক্ষার্থীর অন্যতম হিসেবে সম্মাননা ক্রেস্ট ও আর্থিক সহায়তা প্রদান",
        en: "Honored with crest and financial support as one of three A+ achievers at Satgaon Jibdara High School",
      },
      badge: { bn: "বিদ্যালয় সম্মাননা", en: "School Honor" },
      tone: "gold",
    },
    {
      icon: "🩸",
      year: { bn: "২০২৫", en: "2025" },
      title: { bn: "শান্তিচক্র সম্মাননা ক্রেস্ট", en: "Shantichakra Recognition Crest" },
      desc: {
        bn: "SSC-তে A+ অর্জনের জন্য শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ কর্তৃক সম্মাননা স্মারক প্রদান",
        en: "Received honor memorial crest from Shantichakra Blood Society Sunamganj for achieving A+ in SSC",
      },
      badge: { bn: "সংগঠন কর্তৃক", en: "From Organization" },
      tone: "default",
    },
  ] as Array<{
    icon: string;
    year: Bilingual;
    title: Bilingual;
    desc: Bilingual;
    badge?: string | Bilingual;
    badges?: string[];
    tone: "default" | "success" | "gold";
  }>,
  cta: {
    bn: "প্রতিটি অর্জনই একটি নতুন অনুপ্রেরণা — সামনে আরও অনেক পথ পাড়ি দেওয়ার",
    en: "Every achievement is a new inspiration — many more paths ahead to travel",
  } as Bilingual,
};
