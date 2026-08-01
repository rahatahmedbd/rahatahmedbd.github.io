import type { Bilingual } from "@/types";

export const tribute = {
  inna: {
    bn: "ইন্না লিল্লাহি ওয়া ইন্না ইলাইহি রাজিউন",
    en: "Inna lillahi wa inna ilayhi raji'un",
  } as Bilingual,
  innaTranslation: {
    bn: "নিশ্চয়ই আমরা আল্লাহর জন্য এবং নিশ্চয়ই আমরা তাঁর দিকেই ফিরে যাব",
    en: "Indeed, to Allah we belong and to Him we shall return",
  } as Bilingual,
  eyebrow: { bn: "স্মৃতিতে অম্লান", en: "In Loving Memory" } as Bilingual,
  title: { bn: "শ্রদ্ধাঞ্জলি", en: "Tribute" } as Bilingual,
  photoSrc: "/images/baba-farid-ahmed.jpg",
  photoAlt: "Late Md. Farid Ahmed",
  name: { bn: "মরহুম জনাব ফরিদ আহমেদ", en: "Late Md. Farid Ahmed" } as Bilingual,
  relation: { bn: "আমার শ্রদ্ধেয় পিতা", en: "My Beloved Father" } as Bilingual,
  date: { bn: "মৃত্যু: ৩ মে, ২০২৩", en: "Passed Away: May 3, 2023" } as Bilingual,
  intro: {
    bn: "তিনি শুধু আমার বাবা ছিলেন না — তিনি ছিলেন শিমুলবাঁক ইউনিয়নের একজন উজ্জ্বল নক্ষত্র, একজন কিংবদন্তি। তাঁর সততা, নেতৃত্ব ও মানুষের প্রতি ভালোবাসা আজও হাজারো মানুষের হৃদয়ে অম্লান।",
    en: "He was not just my father — he was a shining star and a legend of Shimulbank Union. His honesty, leadership, and love for people still remain vivid in the hearts of thousands.",
  } as Bilingual,
  identityTitle: { bn: "তাঁর পরিচয়", en: "His Identity" } as Bilingual,
  roles: [
    {
      icon: "🏛️",
      title: { bn: "সাবেক চেয়ারম্যান", en: "Former Chairman" },
      meta: { bn: "শিমুলবাঁক ইউনিয়ন পরিষদ", en: "Shimulbank Union Parishad" },
      period: { bn: "০৩/০৫/২০০৩ — ০২/০৮/২০১১ (একটানা ৯ বছর)", en: "03/05/2003 — 02/08/2011 (9 consecutive years)" },
    },
    {
      icon: "🏫",
      title: { bn: "সাবেক সভাপতি", en: "Former President" },
      meta: { bn: "সাতগাঁও জীবদাড়া উচ্চ বিদ্যালয়", en: "Satgaon Jibdara High School" },
      period: { bn: "২০/০৬/২০২০ — ০৪/০৭/২০২৩", en: "20/06/2020 — 04/07/2023" },
    },
    {
      icon: "🕌",
      title: { bn: "সভাপতি", en: "President" },
      meta: { bn: "পঞ্চগ্রাম জীবদাড়া মাদ্রাসা", en: "Panchagram Jibdara Madrasa" },
    },
    {
      icon: "📜",
      title: { bn: "ডিড রাইটার", en: "Deed Writer" },
      meta: { bn: "শান্তিগঞ্জ সাব রেজিস্ট্রার অফিস", en: "Shantiganj Sub-Registrar Office" },
    },
    {
      icon: "⚖️",
      title: { bn: "প্রখ্যাত সালিশ ব্যক্তিত্ব", en: "Renowned Arbitrator" },
      meta: { bn: "শিমুলবাঁক ইউনিয়ন ও ভাটি অঞ্চল", en: "Shimulbank Union & Bhati Region" },
    },
  ] as Array<{
    icon: string;
    title: Bilingual;
    meta: Bilingual;
    period?: Bilingual;
  }>,
  worksTitle: { bn: "উন্নয়নমূলক কাজের ঝলক", en: "Development Works" } as Bilingual,
  worksIntro: {
    bn: "৯ বছরের চেয়ারম্যান দায়িত্বকালে তিনি শিমুলবাঁক ইউনিয়নের চেহারা বদলে দিয়েছিলেন। উল্লেখযোগ্য কিছু কাজ:",
    en: "During his 9-year tenure as Chairman, he transformed the face of Shimulbank Union. Notable works include:",
  } as Bilingual,
  works: [
    { bn: "নোয়াখালী — ভীমখালী রাস্তা নির্মাণে অগ্রণী ভূমিকা", en: "Leading role in Noakhali — Bhimkhali road construction" },
    { bn: "শিমুলবাঁক ইউনিয়ন পরিষদ ভবন নির্মাণ ও বাস্তবায়ন", en: "Construction of Shimulbank Union Parishad building" },
    { bn: "ইউনিয়ন ডিজিটাল সেন্টার (ইউডিসি) চালু", en: "Launched Union Digital Center (UDC)" },
    { bn: "কান্দাগাঁও — মুক্তাখাই দৃষ্টিনন্দন সড়ক নির্মাণ", en: "Kandagaon — Muktakhai scenic road construction" },
    { bn: "মুক্তাখাই — চানপুর সড়ক নির্মাণ", en: "Muktakhai — Chanpur road construction" },
    { bn: "নুরপুর — কেশবপুর সড়ক নির্মাণ", en: "Nurpur — Keshabpur road construction" },
    { bn: "নেতাই নদীতে বাঁধ ও ব্রিজ নির্মাণে ভূমিকা", en: "Contribution to dam and bridge construction on Netai River" },
    { bn: "ধনপুর হতে জামালগঞ্জ — সুনামগঞ্জ সংযোগ রাস্তা", en: "Dhanpur to Jamalganj — Sunamganj connecting road" },
    { bn: "জীবদাড়া সিঙ্গি বিলের জাঙ্গাল নির্মাণ", en: "Jibdara Singi Bil embankment construction" },
    { bn: "জীবদাড়া — গোভিন্দপুর রাস্তা নির্মাণ", en: "Jibdara — Gobindpur road construction" },
  ] as Bilingual[],
  worksMore: {
    bn: "এবং আরও অনেক উন্নয়নমূলক কাজ...",
    en: "...and many more development works",
  } as Bilingual,
  farewell: {
    bn: "তাঁর জানাযায় হাজারো মানুষের উপস্থিতি প্রমাণ করে তিনি কতটা ভালোবাসার মানুষ ছিলেন। মানুষের মুখে মুখে তাঁর কর্মময় জীবনের গুণকীর্তন — সবকিছু বলে দিচ্ছিল তিনি সমাজের কতটা আপন ছিলেন।",
    en: "The presence of thousands at his funeral proved how loved he was. The praise for his life's work on people's lips said everything about how close he was to society.",
  } as Bilingual,
  dua: {
    bn: "আল্লাহ পাক যেন আমার বাবার সকল ভালো কাজের বিনিময়ে তাঁকে মাফ করে দেন এবং জান্নাতুল ফেরদাউস দান করেন। আমিন।",
    en: "May Allah forgive my father in return for all his good deeds and grant him Jannatul Firdaus. Ameen.",
  } as Bilingual,
  signature: {
    bn: "— শ্রদ্ধা ও ভালোবাসায়, রাহাত আহমেদ ও পরিবার",
    en: "— With love and respect, Rahat Ahmed & Family",
  } as Bilingual,
};
