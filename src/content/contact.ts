import type { Bilingual } from "@/types";

export const contact = {
  eyebrow: { bn: "চলুন কথা বলি", en: "Let's Talk" } as Bilingual,
  title: { bn: "যোগাযোগ করুন", en: "Get in Touch" } as Bilingual,
  subtitle: {
    bn: "পড়াশোনা, রক্তদান কার্যক্রম, ওয়েব ডেভেলপমেন্ট বা যেকোনো সহযোগিতার জন্য নির্দ্বিধায় যোগাযোগ করুন",
    en: "Feel free to reach out for studies, blood donation, web development, or any collaboration",
  } as Bilingual,
  methodsTitle: { bn: "দ্রুত যোগাযোগ", en: "Quick Contact" } as Bilingual,
  socialTitle: { bn: "সোশ্যাল মিডিয়া", en: "Social Media" } as Bilingual,
  response: {
    title: {
      bn: "সাধারণত ২৪ ঘণ্টার মধ্যে উত্তর দিই",
      en: "Usually respond within 24 hours",
    },
    sub: {
      bn: "জরুরি প্রয়োজনে সরাসরি হোয়াটসঅ্যাপ করুন",
      en: "For urgent matters, please WhatsApp directly",
    },
  },
  form: {
    title: { bn: "বার্তা পাঠান", en: "Send a Message" } as Bilingual,
    subtitle: {
      bn: "নিচের ফর্ম পূরণ করে সরাসরি আমাকে বার্তা পাঠান",
      en: "Fill in the form below to send me a message directly",
    } as Bilingual,
    fields: {
      name: { label: { bn: "আপনার নাম", en: "Your Name" }, placeholder: "e.g. Karim Uddin" },
      email: { label: { bn: "আপনার ইমেইল", en: "Your Email" }, placeholder: "example@email.com" },
      phone: { label: { bn: "ফোন (ঐচ্ছিক)", en: "Phone (Optional)" }, placeholder: "+880 1XXXXXXXXX" },
      subject: { label: { bn: "বিষয়", en: "Subject" } },
      message: {
        label: { bn: "আপনার বার্তা", en: "Your Message" },
        placeholder: { bn: "আপনার বার্তা এখানে লিখুন...", en: "Write your message here..." },
        helper: {
          bn: "বিস্তারিত লিখুন যাতে দ্রুত সঠিক উত্তর দিতে পারি",
          en: "Please provide details for a quick and accurate reply",
        },
      },
    },
    subjectPlaceholder: { bn: "-- একটি বিষয় বেছে নিন --", en: "-- Select a subject --" } as Bilingual,
    subjects: [
      { value: "web-development", bn: "ওয়েব ডেভেলপমেন্ট", en: "Web Development" },
      { value: "tutoring", bn: "টিউশন / পড়াশোনা", en: "Tutoring / Studies" },
      { value: "blood-donation", bn: "রক্তদান সংক্রান্ত", en: "Blood Donation" },
      { value: "collaboration", bn: "সহযোগিতা / পার্টনারশিপ", en: "Collaboration" },
      { value: "general", bn: "সাধারণ জিজ্ঞাসা", en: "General Inquiry" },
      { value: "other", bn: "অন্যান্য", en: "Other" },
    ] as Array<{ value: string; bn: string; en: string }>,
    submit: { bn: "বার্তা পাঠান", en: "Send Message" } as Bilingual,
    privacy: {
      bn: "🔒 আপনার তথ্য সম্পূর্ণ গোপনীয় এবং শুধুমাত্র উত্তর দেওয়ার জন্য ব্যবহৃত হবে।",
      en: "🔒 Your information is completely private and will only be used to reply.",
    } as Bilingual,
    status: {
      sending: { bn: "পাঠানো হচ্ছে...", en: "Sending..." },
      success: { bn: "✅ ধন্যবাদ! আপনার বার্তা পাঠানো হয়েছে।", en: "✅ Thank you! Your message has been sent." },
      error: {
        bn: "❌ একটি সমস্যা হয়েছে। সরাসরি ইমেইল করুন rahatbd20505@gmail.com",
        en: "❌ Something went wrong. Please email rahatbd20505@gmail.com directly.",
      },
      unconfigured: {
        bn: "⚠️ যোগাযোগ ফর্মটি এখনো কনফিগার করা হয়নি। সরাসরি ইমেইল করুন rahatbd20505@gmail.com",
        en: "⚠️ The contact form is not configured yet. Please email rahatbd20505@gmail.com directly.",
      },
    },
  },
};

export const footer = {
  tagline: {
    bn: "একজন শিক্ষার্থী, শিক্ষক, রক্তদাতা ও উদীয়মান ওয়েব ডেভেলপার — শিক্ষা ও সমাজসেবার মাধ্যমে ইতিবাচক পরিবর্তনের পথে।",
    en: "A student, teacher, blood donor, and aspiring web developer — on the path to positive change through education and community service.",
  } as Bilingual,
  quickLinksTitle: { bn: "দ্রুত লিংক", en: "Quick Links" } as Bilingual,
  contactTitle: { bn: "যোগাযোগ", en: "Contact" } as Bilingual,
  socialTitle: { bn: "সোশ্যাল মিডিয়া", en: "Follow Me" } as Bilingual,
  socialText: { bn: "যুক্ত থাকুন সব platform-এ", en: "Stay connected across platforms" } as Bilingual,
  bloodLink: { bn: "শান্তিচক্র গ্রুপে যোগ দিন", en: "Join Shantichakra Group" } as Bilingual,
  rights: { bn: "· সর্বস্বত্ব সংরক্ষিত", en: "· All rights reserved" } as Bilingual,
  madeWith: {
    bn: "সুনামগঞ্জ, বাংলাদেশ থেকে ❤️ দিয়ে তৈরি",
    en: "Made with ❤️ from Sunamganj, Bangladesh",
  } as Bilingual,
  backToTop: { bn: "উপরে ফিরে যান", en: "Back to Top" } as Bilingual,
};
