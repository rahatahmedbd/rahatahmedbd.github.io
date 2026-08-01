import type { Bilingual } from "@/types";

export interface Initiative {
  icon: string;
  status: Bilingual;
  date: Bilingual;
  title: Bilingual;
  role: Bilingual;
  desc: Bilingual;
  details: Array<{ label: Bilingual; value: Bilingual }>;
  note?: Bilingual;
  link?: { label: Bilingual; href: string };
}

export const experience = {
  eyebrow: { bn: "কর্মজীবন ও উদ্যোগ", en: "Career & Initiatives" } as Bilingual,
  title: { bn: "অভিজ্ঞতা ও প্রতিষ্ঠান", en: "Experience & Initiatives" } as Bilingual,
  subtitle: {
    bn: "শিক্ষা, সমাজসেবা এবং প্রযুক্তির ক্ষেত্রে আমার প্রতিষ্ঠিত সংগঠন ও ভূমিকাসমূহ",
    en: "Organizations I founded and roles I hold in education, community service, and technology",
  } as Bilingual,
  rolesDivider: { bn: "বর্তমান ভূমিকাসমূহ", en: "Current Roles" } as Bilingual,
  initiatives: [
    {
      icon: "🏫",
      status: { bn: "সাময়িক বন্ধ", en: "Temporarily Paused" },
      date: { bn: "প্রতিষ্ঠিত ৩১ ডিসেম্বর, ২০২৪", en: "Founded Dec 31, 2024" },
      title: { bn: "FS কোচিং সেন্টার", en: "FS Coaching Center" },
      role: { bn: "প্রতিষ্ঠাতা ও পরিচালক", en: "Founder & Director" },
      desc: {
        bn: "গ্রামের গরিব, দরিদ্র ও অসহায় মেধাবী শিক্ষার্থীদের অত্যন্ত সুলভ মূল্যে মানসম্মত শিক্ষা প্রদানের লক্ষ্যে জীবদাড়া বাজার, শান্তিগঞ্জ, সুনামগঞ্জে FS কোচিং সেন্টার প্রতিষ্ঠা করি। ষষ্ঠ থেকে দশম শ্রেণির শিক্ষার্থীদের একাডেমিক পাঠদান করা হয়।",
        en: "Established FS Coaching Center at Jibdara Bazar, Shantiganj, Sunamganj to provide quality education at affordable prices to underprivileged talented students. Academic coaching was provided from Class 6 to 10.",
      },
      details: [
        {
          label: { bn: "ঠিকানা:", en: "Location:" },
          value: { bn: "জীবদাড়া বাজার, শান্তিগঞ্জ, সুনামগঞ্জ", en: "Jibdara Bazar, Shantiganj, Sunamganj" },
        },
        {
          label: { bn: "শ্রেণি:", en: "Classes:" },
          value: { bn: "৬ষ্ঠ — ১০ম শ্রেণি", en: "Class 6 — 10" },
        },
        {
          label: { bn: "সময়কাল:", en: "Duration:" },
          value: { bn: "প্রায় ১ বছর সফল পরিচালনা", en: "Successfully ran for ~1 year" },
        },
      ],
      note: {
        bn: "ইনশাআল্লাহ, সঠিক সুযোগ পেলে আবার চালু করা হবে।",
        en: "InshaAllah, will be reopened when the right opportunity comes.",
      },
    },
    {
      icon: "🤝",
      status: { bn: "সাময়িক বন্ধ", en: "Temporarily Paused" },
      date: { bn: "প্রতিষ্ঠিত ২০২৩", en: "Founded 2023" },
      title: { bn: "হেল্পিং হ্যান্ড অর্গানাইজেশন", en: "Helping Hand Organization" },
      role: { bn: "প্রতিষ্ঠাতা", en: "Founder" },
      desc: {
        bn: "গরিব, দুঃখী ও অসহায় মানুষের পাশে দাঁড়ানোর লক্ষ্যে ২০২৩ সালের শেষের দিকে হেল্পিং হ্যান্ড অর্গানাইজেশন প্রতিষ্ঠা করি। প্রতিষ্ঠানটি বেশ কিছু মানুষকে সাহায্য করতে সক্ষম হয়েছিল।",
        en: "Founded Helping Hand Organization in late 2023 with the aim of standing beside the poor, distressed, and helpless people. The organization managed to help several people during its active period.",
      },
      details: [
        {
          label: { bn: "উদ্দেশ্য:", en: "Mission:" },
          value: { bn: "দরিদ্র ও অসহায় মানুষদের সহায়তা", en: "Support for poor & helpless people" },
        },
        {
          label: { bn: "ভূমিকা:", en: "Role:" },
          value: { bn: "সমস্ত কার্যক্রম পরিচালনা ও ব্যবস্থাপনা", en: "Managed all operations & coordination" },
        },
        {
          label: { bn: "ভবিষ্যত পরিকল্পনা:", en: "Future Plan:" },
          value: { bn: "পুনরায় সক্রিয় করা", en: "Reactivate the organization" },
        },
      ],
      link: {
        label: { bn: "ফেসবুকে দেখুন", en: "View on Facebook" },
        href: "https://www.facebook.com/share/p/1JDAkxehvJ/",
      },
    },
  ] as Initiative[],
  roles: [
    {
      icon: "📚",
      title: { bn: "শিক্ষক", en: "Tutor" },
      since: { bn: "২০২৩ থেকে", en: "Since 2023" },
      desc: {
        bn: "ক্লাস নাইন থেকে শুরু করে ৭ম, ৮ম এবং ৯ম শ্রেণির শিক্ষার্থীদের একাডেমিক পাঠদান করি।",
        en: "Started in Class 9, teaching students of Class 7, 8 and 9 in academic subjects.",
      },
      status: { bn: "সক্রিয়", en: "Active" },
      tone: "default",
    },
    {
      icon: "🎖️",
      title: { bn: "BNCC ক্যাডেট", en: "BNCC Cadet" },
      since: { bn: "Cadet #25071152", en: "Cadet #25071152" },
      desc: {
        bn: "বাংলাদেশ ন্যাশনাল ক্যাডেট কোরের একজন সক্রিয় ক্যাডেট হিসেবে শৃঙ্খলা, নেতৃত্ব ও দেশপ্রেমের চর্চা করছি।",
        en: "Practicing discipline, leadership, and patriotism as an active cadet of Bangladesh National Cadet Corps.",
      },
      status: { bn: "সক্রিয়", en: "Active" },
      tone: "default",
    },
    {
      icon: "🩸",
      title: { bn: "রক্তদাতা", en: "Blood Donor" },
      since: { bn: "A+ গ্রুপ · ৪ বার দান", en: "A+ Group · 4 Times Donated" },
      desc: {
        bn: "নিয়মিত স্বেচ্ছায় রক্তদানের মাধ্যমে জীবন বাঁচানোর ক্ষুদ্র প্রয়াস চালিয়ে যাচ্ছি।",
        en: "Continuing the small effort of saving lives through regular voluntary blood donation.",
      },
      status: { bn: "নিয়মিত দাতা", en: "Regular Donor" },
      tone: "blood",
    },
    {
      icon: "🎥",
      title: { bn: "কনটেন্ট ক্রিয়েটর", en: "Content Creator" },
      since: { bn: "YouTube · TikTok", en: "YouTube · TikTok" },
      desc: {
        bn: "শিক্ষা, প্রযুক্তি ও সামাজিক সচেতনতা নিয়ে বিভিন্ন প্ল্যাটফর্মে কনটেন্ট তৈরি করি।",
        en: "Creating educational, tech, and social awareness content across multiple platforms.",
      },
      status: { bn: "সক্রিয়", en: "Active" },
      tone: "default",
    },
  ] as Array<{
    icon: string;
    title: Bilingual;
    since: Bilingual;
    desc: Bilingual;
    status: Bilingual;
    tone: "default" | "blood";
  }>,
  services: {
    icon: "💻",
    title: { bn: "ওয়েব ডেভেলপমেন্ট সার্ভিস", en: "Web Development Services" } as Bilingual,
    subtitle: {
      bn: "আধুনিক, দ্রুতগতির ও Responsive ওয়েবসাইট",
      en: "Modern, Fast & Responsive Websites",
    } as Bilingual,
    desc: {
      bn: "AI-এর সহায়তায় আমি দ্রুত, নিরাপদ, আকর্ষণীয় এবং সম্পূর্ণ Responsive ওয়েবসাইট তৈরি করি। আমার লক্ষ্য এমন একটি ডিজিটাল পরিচয় তৈরি করা যা আপনার কাজকে আরও বেশি মানুষের কাছে পৌঁছে দেয়।",
      en: "With the help of AI, I build fast, secure, attractive, and fully responsive websites. My goal is to create a digital identity that helps reach your work to more people.",
    } as Bilingual,
    typesLabel: { bn: "যেসব ওয়েবসাইট তৈরি করি:", en: "Types of websites I build:" } as Bilingual,
    types: [
      { bn: "পোর্টফোলিও", en: "Portfolio" },
      { bn: "ব্যবসায়িক", en: "Business" },
      { bn: "ই-কমার্স", en: "E-Commerce" },
      { bn: "শিক্ষা প্রতিষ্ঠান", en: "Educational" },
      { bn: "রক্ত সংগঠন", en: "Blood Organizations" },
      { bn: "স্থানীয় সরকার", en: "Local Government" },
      { bn: "NGO", en: "NGO" },
      { bn: "নিউজ পোর্টাল", en: "News Portal" },
      { bn: "ল্যান্ডিং পেজ", en: "Landing Page" },
      { bn: "ইভেন্ট", en: "Event" },
    ] as Bilingual[],
    features: [
      { icon: "⚡", label: { bn: "দ্রুতগতির লোডিং", en: "Fast Loading" } },
      { icon: "📱", label: { bn: "সব ডিভাইসে রেসপনসিভ", en: "Fully Responsive" } },
      { icon: "🔍", label: { bn: "SEO ফ্রেন্ডলি", en: "SEO Friendly" } },
      { icon: "💰", label: { bn: "সাশ্রয়ী মূল্য", en: "Affordable Pricing" } },
    ] as Array<{ icon: string; label: Bilingual }>,
    cta: { bn: "প্রজেক্টের জন্য যোগাযোগ করুন", en: "Contact for Projects" } as Bilingual,
  },
};
