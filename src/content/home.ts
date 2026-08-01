import type { Bilingual } from "@/types";

export const hero = {
  eyebrow: {
    bn: "বিসমিল্লাহির রাহমানির রাহিম",
    en: "In the name of Allah, the Most Gracious, the Most Merciful",
  } as Bilingual,
  name: { bn: "রাহাত আহমেদ", en: "Rahat Ahmed" } as Bilingual,
  subtitle: {
    bn: "আমি একজন শিক্ষার্থী, গৃহশিক্ষক, রক্তদাতা, BNCC ক্যাডেট এবং উদীয়মান ওয়েব ডেভেলপার। শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য।",
    en: "I am a student, home tutor, blood donor, BNCC cadet, and aspiring web developer. My goal is to support people through education, community service, and technology.",
  } as Bilingual,
  chips: [
    { bn: "HSC শিক্ষার্থী", en: "HSC Student", tone: "default" },
    { bn: "শিক্ষক", en: "Tutor", tone: "default" },
    { bn: "A+ রক্তদাতা", en: "A+ Blood Donor", tone: "blood" },
    { bn: "BNCC ক্যাডেট", en: "BNCC Cadet", tone: "default" },
    { bn: "ওয়েব ডেভেলপার", en: "Web Developer", tone: "default" },
  ] as Array<{ bn: string; en: string; tone: "default" | "blood" }>,
  primaryCta: { bn: "আমার অর্জন দেখুন", en: "View My Achievements" } as Bilingual,
  secondaryCta: { bn: "যোগাযোগ করুন", en: "Contact Me" } as Bilingual,
  badges: {
    blood: { bn: "রক্তের গ্রুপ: A+", en: "Blood Group: A+" } as Bilingual,
    donor: { bn: "৪ বার রক্তদান", en: "4 Times Blood Donor" } as Bilingual,
  },
  scrollHint: { bn: "নিচে দেখুন", en: "Scroll Down" } as Bilingual,
};
