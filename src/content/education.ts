import type { Bilingual } from "@/types";

export interface EducationMilestone {
  icon: string;
  period: Bilingual;
  title: Bilingual;
  institution: Bilingual;
  desc: Bilingual;
  badge?: string;
  active?: boolean;
  tags?: Bilingual[];
}

export const education = {
  eyebrow: { bn: "একাডেমিক যাত্রা", en: "Academic Journey" } as Bilingual,
  title: { bn: "শিক্ষাজীবন", en: "Education" } as Bilingual,
  subtitle: {
    bn: "সিলেটের স্কলারসহোম থেকে সুনামগঞ্জ সরকারি কলেজ পর্যন্ত — শিক্ষার একটি অবিরাম যাত্রা",
    en: "From Scholarshome Sylhet to Sunamganj Govt. College — a continuous journey of learning",
  } as Bilingual,
  milestones: [
    {
      icon: "🏫",
      period: { bn: "২০১৬ — ২০১৯", en: "2016 — 2019" },
      title: { bn: "প্রাথমিক পড়াশোনা (সিলেট)", en: "Primary Education (Sylhet)" },
      institution: {
        bn: "স্কলারসহোম মেজরটিলা কলেজ, সিলেট",
        en: "Scholarshome Majortila College, Sylhet",
      },
      desc: {
        bn: "চতুর্থ শ্রেণি পর্যন্ত পরিবারসহ সিলেটে থেকে পড়াশোনা করেছি। শহরের বৈচিত্র্যপূর্ণ পরিবেশে নতুন অভিজ্ঞতা অর্জন করি।",
        en: "Studied up to Class 4 while living with family in Sylhet. Gained diverse experiences in the vibrant city environment.",
      },
    },
    {
      icon: "📜",
      period: { bn: "২০১৯", en: "2019" },
      title: { bn: "PSC — প্রাথমিক শিক্ষা সমাপনী", en: "PSC — Primary Certificate" },
      institution: {
        bn: "জীবদাড়া সরকারি প্রাথমিক বিদ্যালয়",
        en: "Jibdara Government Primary School",
      },
      desc: {
        bn: "পঞ্চম শ্রেণিতে গ্রামে ফিরে এসে PSC পরীক্ষায় জিপিএ ৫.০০ পেয়ে উত্তীর্ণ হই। এটি ছিল আমার শিক্ষাজীবনের প্রথম বড় অর্জন।",
        en: "Returned to the village in Class 5 and passed PSC with GPA 5.00. This was my first major academic achievement.",
      },
      badge: "GPA 5.00",
    },
    {
      icon: "📚",
      period: { bn: "২০২০ — ২০২৫", en: "2020 — 2025" },
      title: {
        bn: "মাধ্যমিক শিক্ষা (৬ষ্ঠ — ১০ম শ্রেণি)",
        en: "Secondary Education (Class 6 — 10)",
      },
      institution: {
        bn: "সাতগাঁও জীবদাড়া উচ্চ বিদ্যালয়",
        en: "Satgaon Jibdara High School",
      },
      desc: {
        bn: "এই সময়ে একাধিক জাতীয় বিজ্ঞান মেলায় প্রথম স্থান অর্জন, শিক্ষকতা শুরু, হেল্পিং হ্যান্ড অর্গানাইজেশন প্রতিষ্ঠা এবং FS কোচিং সেন্টার প্রতিষ্ঠা করি।",
        en: "During this period, achieved 1st positions in multiple national science fairs, started teaching, founded Helping Hand Organization, and established FS Coaching Center.",
      },
    },
    {
      icon: "🎓",
      period: { bn: "১০ জুলাই, ২০২৫", en: "July 10, 2025" },
      title: { bn: "SSC — মাধ্যমিক স্কুল সার্টিফিকেট", en: "SSC — Secondary School Certificate" },
      institution: {
        bn: "সাতগাঁও জীবদাড়া উচ্চ বিদ্যালয়, বিজ্ঞান বিভাগ",
        en: "Satgaon Jibdara High School, Science Group",
      },
      desc: {
        bn: "বিজ্ঞান বিভাগ থেকে জিপিএ ৫.০০ (A+) অর্জন করি। শান্তিচক্র ব্লাড সোসাইটি এবং বিদ্যালয় থেকে বিশেষ সম্মাননা প্রদান করা হয়।",
        en: "Achieved GPA 5.00 (A+) from Science group. Received special honors from Shantichakra Blood Society and the school.",
      },
      badge: "GPA 5.00 (A+)",
    },
    {
      icon: "⭐",
      period: { bn: "বর্তমান", en: "Current" },
      title: { bn: "HSC ২য় বর্ষ — বিজ্ঞান বিভাগ", en: "HSC 2nd Year — Science Group" },
      institution: { bn: "সুনামগঞ্জ সরকারি কলেজ", en: "Sunamganj Government College" },
      desc: {
        bn: "বর্তমানে সুনামগঞ্জ সরকারি কলেজে উচ্চ মাধ্যমিক ২য় বর্ষে বিজ্ঞান বিভাগে অধ্যয়নরত। পড়াশোনার পাশাপাশি সমাজসেবা, শিক্ষকতা ও ওয়েব ডেভেলপমেন্ট চালিয়ে যাচ্ছি।",
        en: "Currently studying in HSC 2nd year, Science group at Sunamganj Government College. Alongside studies, continuing community service, teaching, and web development.",
      },
      active: true,
      tags: [
        { bn: "পদার্থবিজ্ঞান", en: "Physics" },
        { bn: "রসায়ন", en: "Chemistry" },
        { bn: "জীববিজ্ঞান", en: "Biology" },
        { bn: "গণিত", en: "Mathematics" },
      ],
    },
  ] as EducationMilestone[],
};
