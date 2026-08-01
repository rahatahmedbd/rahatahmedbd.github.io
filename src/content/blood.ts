import type { Bilingual } from "@/types";

export const blood = {
  eyebrow: { bn: "রক্তই জীবন", en: "Blood is Life" } as Bilingual,
  title: { bn: "শান্তিচক্র ব্লাড সোসাইটি", en: "Shantichakra Blood Society" } as Bilingual,
  subtitle: {
    bn: "সুনামগঞ্জ ভিত্তিক একটি স্বেচ্ছাসেবী রক্তদান সংগঠন — যেখানে প্রতিটি ফোঁটা রক্ত একটি জীবন বাঁচায়",
    en: "A Sunamganj-based voluntary blood donation organization — where every drop of blood saves a life",
  } as Bilingual,
  logoSrc: "/images/logo.png",
  logoAlt: "শান্তিচক্র ব্লাড সোসাইটি লোগো",
  roleBadge: { bn: "আমার ভূমিকা", en: "My Role" } as Bilingual,
  roleTitle: {
    bn: "সহ-প্রতিষ্ঠাতা ও সাধারণ সম্পাদক",
    en: "Co-Founder & General Secretary",
  } as Bilingual,
  roleDesc: {
    bn: "২০২৫ সালে শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ প্রতিষ্ঠায় সক্রিয় ভূমিকা রাখি এবং বর্তমানে সাধারণ সম্পাদক হিসেবে রক্তদাতা ব্যবস্থাপনা, স্বেচ্ছাসেবক সমন্বয় ও সচেতনতামূলক কার্যক্রম পরিচালনার দায়িত্ব পালন করছি।",
    en: "Played an active role in founding Shantichakra Blood Society Sunamganj in 2025 and currently serving as General Secretary — managing donors, coordinating volunteers, and organizing awareness campaigns.",
  } as Bilingual,
  stats: [
    { count: 4, label: { bn: "বার রক্তদান", en: "Times Donated" } },
    { literal: "A+", label: { bn: "আমার রক্তের গ্রুপ", en: "My Blood Group" } },
    { literal: "2025", label: { bn: "প্রতিষ্ঠার সাল", en: "Founded Year" } },
    { literal: "∞", label: { bn: "জীবন বাঁচানোর অঙ্গীকার", en: "Lives Saving Mission" } },
  ] as Array<{ count?: number; literal?: string; label: Bilingual }>,
  servicesTitle: { bn: "আমাদের কার্যক্রম", en: "What We Do" } as Bilingual,
  services: [
    {
      icon: "🩸",
      title: { bn: "রক্তদাতা ব্যবস্থাপনা", en: "Donor Management" },
      desc: { bn: "জরুরি মুহূর্তে দ্রুত রক্তদাতা খুঁজে পাওয়া নিশ্চিত করা", en: "Ensuring quick access to blood donors during emergencies" },
    },
    {
      icon: "🤝",
      title: { bn: "স্বেচ্ছাসেবক সমন্বয়", en: "Volunteer Coordination" },
      desc: { bn: "সংগঠনের স্বেচ্ছাসেবকদের কার্যক্রম পরিচালনা ও প্রশিক্ষণ", en: "Managing and training organizational volunteers" },
    },
    {
      icon: "📢",
      title: { bn: "সচেতনতা প্রচারাভিযান", en: "Awareness Campaigns" },
      desc: { bn: "রক্তদানের গুরুত্ব সম্পর্কে জনসাধারণকে সচেতন করা", en: "Educating the public about the importance of blood donation" },
    },
    {
      icon: "🚨",
      title: { bn: "জরুরি সহায়তা", en: "Emergency Support" },
      desc: { bn: "২৪/৭ জরুরি রক্তের প্রয়োজনে সহায়তা প্রদান", en: "24/7 emergency blood support services" },
    },
    {
      icon: "💉",
      title: { bn: "ব্লাড ক্যাম্প", en: "Blood Camps" },
      desc: { bn: "নিয়মিত রক্তদান ক্যাম্প আয়োজন ও পরিচালনা", en: "Organizing regular blood donation camps" },
    },
    {
      icon: "📊",
      title: { bn: "ডোনার ডেটাবেস", en: "Donor Database" },
      desc: { bn: "নিয়মিত দাতাদের তথ্য সংগ্রহ ও ব্যবস্থাপনা", en: "Collecting and managing regular donor information" },
    },
  ] as Array<{ icon: string; title: Bilingual; desc: Bilingual }>,
  quote: {
    bn: "একটি রক্তদান তিনটি জীবন বাঁচাতে পারে। আপনার একটু সাহায্য কারো পরিবারের হাসি ফিরিয়ে আনতে পারে। আজই রক্তদানের সিদ্ধান্ত নিন।",
    en: "One blood donation can save three lives. Your small help can bring back the smile to someone's family. Decide to donate blood today.",
  } as Bilingual,
  cta: {
    join: { bn: "ফেসবুক গ্রুপে জয়েন করুন", en: "Join Facebook Group" } as Bilingual,
    donate: { bn: "রক্তদানে আগ্রহী?", en: "Interested to Donate?" } as Bilingual,
  },
};
