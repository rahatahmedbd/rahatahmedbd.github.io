import type { Bilingual } from "@/types";

export const about = {
  eyebrow: { bn: "পরিচয়", en: "Introduction" } as Bilingual,
  title: { bn: "আমার সম্পর্কে", en: "About Me" } as Bilingual,
  subtitle: {
    bn: "গ্রাম থেকে শহর, স্বপ্ন থেকে বাস্তব — একটি অবিরাম যাত্রার গল্প",
    en: "From village to city, dream to reality — a story of relentless journey",
  } as Bilingual,
  badge: {
    title: { bn: "HSC ২য় বর্ষ", en: "HSC 2nd Year" } as Bilingual,
    sub: { bn: "বিজ্ঞান বিভাগ", en: "Science Group" } as Bilingual,
  },
  quote: {
    bn: "মানুষের পাশে দাঁড়ানো, শেখা এবং শেখানো — এই তিনটি জিনিস আমাকে এগিয়ে নিয়ে যায়।",
    en: "Standing by people, learning, and teaching — these three things drive me forward.",
  } as Bilingual,
  story: [
    {
      bn: "আমি রাহাত আহমেদ। ২০০৬ সালের ২১ জুন সুনামগঞ্জ জেলার শান্তিগঞ্জ উপজেলার জীবদাড়া গ্রামে আমার জন্ম। প্রকৃতির কোলে বেড়ে ওঠা এই গ্রামই আমাকে শিখিয়েছে স্বপ্ন দেখতে এবং লড়াই করতে।",
      en: "I am Rahat Ahmed. I was born on June 21, 2006, in Jibdara village of Shantiganj upazila, Sunamganj district. Growing up in this village amidst nature taught me to dream and to fight.",
    },
    {
      bn: "বর্তমানে আমি সুনামগঞ্জ সরকারি কলেজে HSC ২য় বর্ষে বিজ্ঞান বিভাগের শিক্ষার্থী। পড়াশোনার পাশাপাশি আমি একজন গৃহশিক্ষক, শান্তিচক্র ব্লাড সোসাইটির সহ-প্রতিষ্ঠাতা ও সাধারণ সম্পাদক, FS কোচিং সেন্টারের প্রতিষ্ঠাতা এবং BNCC-এর একজন সক্রিয় ক্যাডেট।",
      en: "Currently, I am a 2nd year HSC student in Science group at Sunamganj Government College. Alongside my studies, I am a home tutor, co-founder and General Secretary of Shantichakra Blood Society, founder of FS Coaching Center, and an active BNCC cadet.",
    },
    {
      bn: "ওয়েব ডেভেলপমেন্ট, আর্টিফিশিয়াল ইন্টেলিজেন্স, কনটেন্ট ক্রিয়েশন এবং সামাজিক সেবা — এই বিষয়গুলো নিয়ে কাজ করতে ভালোবাসি। আমার লক্ষ্য শিক্ষা ও প্রযুক্তির মাধ্যমে সমাজে ইতিবাচক পরিবর্তন আনা।",
      en: "I love working with web development, artificial intelligence, content creation, and community service. My goal is to bring positive change to society through education and technology.",
    },
  ] as Bilingual[],
  cta: {
    bn: "আমার শিক্ষাজীবন দেখুন",
    en: "See my education journey",
  } as Bilingual,
  facts: [
    {
      icon: "📅",
      label: { bn: "জন্ম তারিখ", en: "Date of Birth" },
      value: { bn: "২১ জুন, ২০০৬", en: "June 21, 2006" },
    },
    {
      icon: "📍",
      label: { bn: "অবস্থান", en: "Location" },
      value: { bn: "সুনামগঞ্জ, বাংলাদেশ", en: "Sunamganj, Bangladesh" },
    },
    {
      icon: "🩸",
      label: { bn: "রক্তের গ্রুপ", en: "Blood Group" },
      value: { bn: "A+ Positive", en: "A+ Positive" },
    },
    {
      icon: "🎖️",
      label: { bn: "BNCC ক্যাডেট নম্বর", en: "BNCC Cadet Number" },
      value: { bn: "25071152", en: "25071152" },
    },
    {
      icon: "🎓",
      label: { bn: "বর্তমান পড়াশোনা", en: "Current Education" },
      value: { bn: "HSC ২য় বর্ষ (বিজ্ঞান)", en: "HSC 2nd Year (Science)" },
    },
    {
      icon: "🏫",
      label: { bn: "প্রতিষ্ঠান", en: "Institution" },
      value: { bn: "সুনামগঞ্জ সরকারি কলেজ", en: "Sunamganj Govt. College" },
    },
    {
      icon: "🤝",
      label: { bn: "ভূমিকা", en: "Role" },
      value: { bn: "সাধারণ সম্পাদক, শান্তিচক্র", en: "General Secretary, Shantichakra" },
    },
    {
      icon: "🌐",
      label: { bn: "ভাষা", en: "Languages" },
      value: { bn: "বাংলা, English", en: "Bengali, English" },
    },
  ] as Array<{ icon: string; label: Bilingual; value: Bilingual }>,
};
