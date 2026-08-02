"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { about } from "@/content/about";
import { experience } from "@/content/experience";
import { education } from "@/content/education";
import { achievements } from "@/content/achievements";
import { tribute } from "@/content/tribute";
import { blood } from "@/content/blood";
import { site, socials } from "@/lib/site";
import {
  Building2,
  Sparkles,
  User,
  GraduationCap,
  Award,
  Briefcase,
  Heart,
  BookOpen,
  Cpu,
  Layers,
  Code,
  Globe,
  Terminal,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  ChevronRight,
  ChevronLeft,
  X,
  HelpCircle,
  Eye,
  CheckCircle2,
  Play,
  Maximize2,
  Minimize2,
  Compass,
  ArrowRight,
  ShieldCheck,
  Flame,
  Zap,
  Star,
  Search,
  Check,
  Send,
  ExternalLink,
} from "lucide-react";

type RoomId =
  | "lobby"
  | "about_hall"
  | "timeline"
  | "mission_vision"
  | "skills_lab"
  | "ai_process"
  | "achievements_gallery"
  | "philosophy"
  | "qa_station"
  | "secret_future"
  | "exit";

export function AgencyHeadquarters({
  onClose,
  initialRoom = "lobby",
}: {
  onClose?: () => void;
  initialRoom?: RoomId;
}) {
  const { t, lang } = useLanguage();
  const [activeRoom, setActiveRoom] = useState<RoomId>(initialRoom);
  const [unlockedSecret, setUnlockedSecret] = useState<boolean>(false);
  const [visitedRooms, setVisitedRooms] = useState<Set<RoomId>>(new Set(["lobby"]));
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechMuted, setSpeechMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Avatar Speech State
  const [avatarMessage, setAvatarMessage] = useState<string>(
    t({
      bn: "আসসালামু আলাইকুম! রাহাতভার্স এজেন্সি হেডকোয়ার্টার্সে আপনাকে স্বাগতম। আমি রাহাতের ডিজিটাল অবতার। আসুন, আমি আপনাকে আমার এই ডিজিট্যাল রাজত্ব ঘুরিয়ে দেখাই!",
      en: "Assalamu Alaikum! Welcome to RahatVerse Agency Headquarters. I am Rahat's Digital Avatar. Let me guide you through my digital realm!",
    })
  );

  // Active Interactive Demo states for Skills Lab
  const [skillDemoTab, setSkillDemoTab] = useState<"frontend" | "backend" | "ai" | "design" | "perf" | "seo" | "deploy">("frontend");
  const [demoState, setDemoState] = useState<{
    count: number;
    theme: "neon" | "cyan" | "gold";
    queryResult: string | null;
    aiPrompt: string;
    aiGenerating: boolean;
    aiOutput: string;
    seoTitle: string;
    seoDesc: string;
    buildProgress: number;
    building: boolean;
  }>({
    count: 1,
    theme: "neon",
    queryResult: null,
    aiPrompt: "Create a modern hero banner with glassmorphism in React",
    aiGenerating: false,
    aiOutput: "",
    seoTitle: "Rahat Ahmed — Web Developer & AI Pioneer",
    seoDesc: "Building high-performance, secure, and beautiful websites using AI workflows.",
    buildProgress: 0,
    building: false,
  });

  // AI Development Process Active Step
  const [aiStep, setAiStep] = useState<number>(0);

  // Timeline selected index
  const [selectedTimelineIdx, setSelectedTimelineIdx] = useState<number>(0);

  // Q&A active selection
  const [qaIndex, setQaIndex] = useState<number | null>(null);

  // Speech synthesis reference
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speakText = (text: string) => {
    if (speechMuted || !synthRef.current) return;
    try {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = lang === "bn" ? "bn-BD" : "en-US";
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  const handleRoomChange = (room: RoomId) => {
    setActiveRoom(room);
    setVisitedRooms((prev) => {
      const next = new Set(prev);
      next.add(room);
      if (next.size >= 5) setUnlockedSecret(true);
      return next;
    });

    let msg = "";
    switch (room) {
      case "lobby":
        msg = t({
          bn: "আপনি রিসেপশন লবিতে আছেন। এখান থেকে আপনি সদরদপ্তরের সমস্ত কক্ষে যেতে পারেন।",
          en: "You are in the Entrance Lobby. From here, you can navigate to all rooms of the Headquarters.",
        });
        break;
      case "about_hall":
        msg = t({
          bn: "আমার পরিচয় এবং জীবন গল্পের কক্ষে আপনাকে স্বাগতম। আমার গ্রামের বাড়ি থেকে সুনামগঞ্জ সরকারি কলেজ পর্যন্ত সম্পূর্ণ গল্প এখানে পাবেন।",
          en: "Welcome to my About Me Hall. Here you will discover my full story from my village roots to Sunamganj Govt. College.",
        });
        break;
      case "timeline":
        msg = t({
          bn: "এটি আমার জীবন ও অর্জনের ইন্টারেক্টিভ টাইমলাইন। সময়রেখা ধরে হেঁটে প্রতিটি মাইলেস্টোন এক্সপ্লোর করুন।",
          en: "This is my interactive Journey Timeline. Walk along the timeline to explore every milestone.",
        });
        break;
      case "mission_vision":
        msg = t({
          bn: "আমার ভিশন ও মিশন কক্ষে আপনাকে স্বাগতম। কেন আমি এই ওয়েব এজেন্সি গড়ে তুলেছি তার মূল উদ্দেশ্য এখানে ব্যাখ্য করা হয়েছে।",
          en: "Welcome to the Mission & Vision Room. Learn why I founded this agency and my long-term goals.",
        });
        break;
      case "skills_lab":
        msg = t({
          bn: "স্কিলস ল্যাবরেটরিতে স্বাগতম! কোনো পার্সেন্টেজ বার নেই — প্রতিটি টেকনোলজি স্টেশনের লাইভ ডেমো পরীক্ষা করে দেখুন।",
          en: "Welcome to the Skills Laboratory! No boring progress bars — test live demonstrations for every tech station.",
        });
        break;
      case "ai_process":
        msg = t({
          bn: "এআই ডেভেলপমেন্ট প্রসেস রুম! আমি পেশাদারভাবে কীভাবে এআই ব্যবহার করে দ্রুত ও মানসম্মত ওয়েবসাইট তৈরি করি, তা ধাপে ধাপে দেখুন।",
          en: "AI Development Process Room! Discover step-by-step how I professionally leverage AI to engineer high-end websites.",
        });
        break;
      case "achievements_gallery":
        msg = t({
          bn: "অর্জন ও স্মরণীয় উদ্যোগের গ্যালারি। আমার শিক্ষাজীবন, পুরস্কার, এবং আমার শ্রদ্ধেয় মরহুম পিতা ফরিদ আহমেদের প্রতি শ্রদ্ধাঞ্জলি এখানে প্রদর্শিত।",
          en: "Achievement Gallery & Honor Hall. Displaying my awards, education, initiatives, and tribute to my late father Md. Farid Ahmed.",
        });
        break;
      case "philosophy":
        msg = t({
          bn: "ব্যক্তিগত দর্শন কক্ষে আপনাকে স্বাগতম। আমার কর্মনীতি, ডিজাইনের নিয়মাবলী এবং নিখুঁত কোডিং অঙ্গীকার সম্পর্কে জানুন।",
          en: "Welcome to the Personal Philosophy Room. Learn about my work ethics, design principles, and quality commitments.",
        });
        break;
      case "qa_station":
        msg = t({
          bn: "ইন্টারেক্টিভ কিউ-এন্ড-এ স্টেশন। আপনার মনে থাকা প্রশ্ন বেছে নিন, আমি বিস্তারিত উত্তর দেব!",
          en: "Interactive Q&A Station. Ask me any question, and I will share my detailed response!",
        });
        break;
      case "secret_future":
        msg = t({
          bn: "অভিনন্দন! আপনি গোপন কক্ষটি আনলক করেছেন: 'আমার ভবিষ্যৎ পরিকল্পনা'। আমার দূরদর্শী ভাবনাগুলো আবিষ্কার করুন!",
          en: "Congratulations! You unlocked the secret room: 'My Future Vision'. Discover my vision for the future!",
        });
        break;
      case "exit":
        msg = t({
          bn: "এখন আপনি আমার সম্পর্কে বিস্তারিত জেনেছেন। চলুন এবার আপনাকে দেখাই আমি কী তৈরি করেছি!",
          en: "Now that you know who I am, let me show you what I have built!",
        });
        break;
    }
    setAvatarMessage(msg);
    speakText(msg);
  };

  // Rooms definition
  const roomsList: Array<{ id: RoomId; title: { bn: string; en: string }; icon: any; accent: string }> = [
    { id: "lobby", title: { bn: "প্রবেশ লবি", en: "Entrance Lobby" }, icon: Building2, accent: "from-rose-500 to-pink-600" },
    { id: "about_hall", title: { bn: "আমার পরিচয় হল", en: "About Me Hall" }, icon: User, accent: "from-cyan-500 to-blue-600" },
    { id: "timeline", title: { bn: "জীবন সময়রেখা", en: "My Journey Timeline" }, icon: Compass, accent: "from-amber-500 to-orange-600" },
    { id: "mission_vision", title: { bn: "মিশন ও ভিশন", en: "Mission & Vision" }, icon: Sparkles, accent: "from-violet-500 to-purple-600" },
    { id: "skills_lab", title: { bn: "স্কিলস ল্যাবরেটরি", en: "Skills Laboratory" }, icon: Cpu, accent: "from-emerald-500 to-teal-600" },
    { id: "ai_process", title: { bn: "এআই প্রসেস রুম", en: "AI Development Process" }, icon: Zap, accent: "from-sky-500 to-cyan-600" },
    { id: "achievements_gallery", title: { bn: "অর্জন ও শ্রদ্ধা গ্যালারি", en: "Achievement Gallery" }, icon: Award, accent: "from-yellow-500 to-amber-600" },
    { id: "philosophy", title: { bn: "ব্যক্তিগত দর্শন", en: "Personal Philosophy" }, icon: Heart, accent: "from-indigo-500 to-purple-600" },
    { id: "qa_station", title: { bn: "প্রশ্নোত্তর স্টেশন", en: "Interactive Q&A" }, icon: HelpCircle, accent: "from-fuchsia-500 to-rose-600" },
    ...(unlockedSecret
      ? [{ id: "secret_future" as RoomId, title: { bn: "🔮 ভবিষ্যৎ পরিকল্পনা", en: "🔮 Hidden Story" }, icon: Lock, accent: "from-amber-400 to-yellow-500" }]
      : []),
    { id: "exit", title: { bn: "প্রস্থান স্থান", en: "Exit Experience" }, icon: ArrowRight, accent: "from-emerald-400 to-green-600" },
  ];

  // Timeline events dataset
  const timelineEvents = [
    {
      year: "2006",
      date: "21 June 2006",
      title: { bn: "শুভ জন্মকথা", en: "Birth in Jibdara" },
      desc: {
        bn: "সুনামগঞ্জ জেলার শান্তিগঞ্জ উপজেলার জীবদাড়া গ্রামে প্রকৃতির কোলে জন্ম। এই গ্রামের মাটি আমাকে স্বপ্ন দেখতে শিখিয়েছে।",
        en: "Born in Jibdara village of Shantiganj, Sunamganj. Growing up amidst nature taught me to dream and strive.",
      },
      tag: "Origins",
      icon: "🌱",
    },
    {
      year: "2020",
      date: "26 Nov 2020",
      title: { bn: "৪২তম জাতীয় বিজ্ঞান মেলা — ১ম জয়", en: "42nd Science Fair — First Victory" },
      desc: {
        bn: "বিজ্ঞানের প্রতি প্রবল আগ্রহ থেকে বিজ্ঞান মেলায় অংশগ্রহণ এবং উপজেলা পর্যায়ে প্রথম স্থান অর্জন।",
        en: "Entered the Science Fair driven by passion and achieved 1st place at Shantiganj Upazila level.",
      },
      tag: "Science & Tech",
      icon: "🥇",
    },
    {
      year: "2023",
      date: "3 May 2023",
      title: { bn: "শ্রদ্ধেয় পিতার প্রয়াণ ও সামাজিক সূচনা", en: "Father's Legacy & Social Initiatives" },
      desc: {
        bn: "শ্রদ্ধেয় পিতা মরহুম ফরিদ আহমেদের (সাবেক ইউপি চেয়ারম্যান) প্রয়াণ। তাঁর আদর্শে অনুপ্রাণিত হয়ে হেল্পিং হ্যান্ড অর্গানাইজেশন প্রতিষ্ঠা এবং টিউশন শুরু।",
        en: "Passed away of my father Late Md. Farid Ahmed (Former UP Chairman). Inspired by his leadership, founded Helping Hand Organization & started tutoring.",
      },
      tag: "Legacy & Leadership",
      icon: "🕊️",
    },
    {
      year: "2024",
      date: "2024",
      title: { bn: "সৃজনশীল মেধা অন্বেষণ ও FS কোচিং", en: "Creative Talent Search & FS Coaching" },
      desc: {
        bn: "সৃজনশীল মেধা অন্বেষণ ২০২৪-এ বিজ্ঞানে ১ম স্থান। গ্রামের গরিব শিক্ষার্থীদের জন্য জীবদাড়া বাজারে FS কোচিং সেন্টার প্রতিষ্ঠা।",
        en: "1st place in Science at Creative Talent Search 2024. Founded FS Coaching Center at Jibdara Bazar for underprivileged students.",
      },
      tag: "Education & Honor",
      icon: "🏫",
    },
    {
      year: "2025",
      date: "10 July 2025",
      title: { bn: "SSC 2025 GPA 5.00 A+ অর্জন", en: "SSC 2025 GPA 5.00 (A+) Achievement" },
      desc: {
        bn: "সাতগাঁও জীবদাড়া উচ্চ বিদ্যালয় থেকে SSC পরীক্ষায় জিপিএ ৫.০০ প্রাপ্তি ও বিদ্যালয় সম্মাননা।",
        en: "Achieved GPA 5.00 (A+) in SSC 2025 from Satgaon Jibdara High School and received school honor crest.",
      },
      tag: "Academic Excellence",
      icon: "🎓",
    },
    {
      year: "2025",
      date: "2025",
      title: { bn: "শান্তিচক্র ব্লাড সোসাইটি প্রতিষ্ঠা ও BNCC ক্যাডেট", en: "Shantichakra Blood Society & BNCC Cadet" },
      desc: {
        bn: "সহ-প্রতিষ্ঠাতা ও সাধারণ সম্পাদক হিসেবে শান্তিচক্র ব্লাড সোসাইটি গঠন। সক্রিয় BNCC ক্যাডেট (Cadet #25071152) হিসেবে দায়িত্ব পালন।",
        en: "Co-founded Shantichakra Blood Society as General Secretary. Active BNCC Cadet (#25071152) practicing leadership & service.",
      },
      tag: "Community & Blood",
      icon: "🩸",
    },
    {
      year: "Present",
      date: "2026",
      title: { bn: "HSC ২য় বর্ষ ও রাহাতভার্স এজেন্সি গঠন", en: "HSC 2nd Year & RahatVerse Web Agency" },
      desc: {
        bn: "সুনামগঞ্জ সরকারি কলেজে HSC ২য় বর্ষে বিজ্ঞানে অধ্যয়নরত। আধুনিক AI ওয়ার্কফ্লো ব্যবহার করে বিশ্বমানের ওয়েব এজেন্সি পরিচালনা।",
        en: "HSC 2nd year Science at Sunamganj Govt. College. Operating an AI-powered Web Agency delivering world-class digital platforms.",
      },
      tag: "Innovation & Future",
      icon: "💻",
    },
  ];

  // AI Process 8 Steps
  const aiProcessSteps = [
    {
      step: "01",
      title: { bn: "ধারণা ও চাহিদা বিশ্লেষণ (Idea)", en: "Idea & Requirement Analysis" },
      desc: {
        bn: "গ্রাহকের লক্ষ্য, ব্যবসার উদ্দেশ্য ও কাঙ্ক্ষিত বৈশিষ্ট্যাবলী গভীরভাবে বোঝা ও ভিজ্যুয়ালাইজ করা।",
        en: "Deeply understanding client goals, business objectives, and desired feature specs.",
      },
      tools: ["Client Brief", "AI Brainstorming", "Requirement Matrix"],
    },
    {
      step: "02",
      title: { bn: "গবেষণা ও কৌশল (Research)", en: "Research & Competitive Strategy" },
      desc: {
        bn: "প্রতিযোগী বিশ্লেষণ, বাজার ট্রেন্ড এবং সঠিক টেকনোলজি স্ট্যাক নির্বাচন।",
        en: "Analyzing competitors, market trends, and selecting the optimal tech stack.",
      },
      tools: ["ChatGPT-4o", "Claude 3.5 Sonnet", "Perplexity AI"],
    },
    {
      step: "03",
      title: { bn: "পরিকল্পনা ও আর্কিটেকচার (Planning)", en: "Architecture & Data Planning" },
      desc: {
        bn: "ডাটাবেজ স্কিমা (Supabase RLS), UI ফ্লো এবং প্রজেক্ট মাইলস্টোন ম্যাপ তৈরি করা।",
        en: "Designing Supabase RLS schema, site structure, and execution milestones.",
      },
      tools: ["ER Diagrams", "Zod Schemas", "Next.js App Router Structure"],
    },
    {
      step: "04",
      title: { bn: "ডিজাইন ও প্রোটোটাইপ (Design)", en: "UI/UX & Glassmorphic Design" },
      desc: {
        bn: "গ্লাসফিজিজিম, রেসপন্সিভ গ্রিড ও প্রিমিয়াম ডার্ক থিমের ইন্টারেক্টিভ ইন্টারফেস ডিজাইন।",
        en: "Crafting glassmorphic, responsive, dark-mode futuristic web design systems.",
      },
      tools: ["Figma", "TailwindCSS", "v0.dev Component Generator"],
    },
    {
      step: "05",
      title: { bn: "স্মার্ট কোডিং ও ডেভেলপমেন্ট (Development)", en: "AI-Accelerated Development" },
      desc: {
        bn: "Cursor IDE, React Server Components ও TypeScript দিয়ে দ্রুত ও নিরাপদ কোডিং।",
        en: "Rapid type-safe fullstack coding using Cursor IDE, Next.js 14, and TypeScript.",
      },
      tools: ["Cursor IDE", "React 18 / Next.js 14", "TypeScript", "Tailwind"],
    },
    {
      step: "06",
      title: { bn: "পরীক্ষণ ও সিকিউরিটি (Testing)", en: "Quality & Security Audit" },
      desc: {
        bn: "টাইপ চেক, ক্রস-ব্রাউজার রেসপন্সিভনেস, আরএলএস পারমিশন এবং সিকিউরিটি টেস্ট।",
        en: "Strict TypeScript checks, cross-device testing, and Supabase RLS security audit.",
      },
      tools: ["Jest", "ESLint", "Supabase Security Rules", "WCAG Audit"],
    },
    {
      step: "07",
      title: { bn: "পারফরম্যান্স ও এসইও (Optimization)", en: "Performance & SEO Polish" },
      desc: {
        bn: "লাইটহাউস ১০০ স্কোরের জন্য অ্যাসেট কম্প্রেশন, ডাইনামিক এসইও ম্যাটা এবং ক্যাশিং।",
        en: "Optimizing bundle size, dynamic OpenGraph meta, and target 100/100 Lighthouse score.",
      },
      tools: ["Next Image", "Lighthouse", "Schema.org", "Dynamic Sitemaps"],
    },
    {
      step: "08",
      title: { bn: "জিরো-ডাউনটাইম ডিপ্লয়মেন্ট (Deployment)", en: "Zero-Downtime Deployment" },
      desc: {
        bn: "Vercel global edge network, Cloudinary CDN এবং স্বয়ংক্রিয় জিটহাব সিআই/সিডি।",
        en: "Instant global launch via Vercel Edge Network, Cloudinary CDN, and GitHub Actions.",
      },
      tools: ["Vercel", "Cloudinary CDN", "GitHub Actions CI/CD"],
    },
  ];

  // Predefined Q&A
  const qaPairs = [
    {
      q: { bn: "আপনি কে এবং আপনার পরিচয় কী?", en: "Who are you and what is your background?" },
      a: {
        bn: "আমি রাহাত আহমেদ। সুনামগঞ্জ জেলার শান্তিগঞ্জ উপজেলার জীবদাড়া গ্রামে ২০০৬ সালের ২১ জুন আমার জন্ম। বর্তমানে আমি সুনামগঞ্জ সরকারি কলেজে HSC ২য় বর্ষে বিজ্ঞান বিভাগে পড়াশোনা করছি। পাশাপাশি একজন গৃহশিক্ষক, শান্তিচক্র ব্লাড সোসাইটির সহ-প্রতিষ্ঠাতা ও সাধারণ সম্পাদক, FS কোচিং সেন্টারের প্রতিষ্ঠাতা, BNCC ক্যাডেট (Cadet #25071152) এবং ওয়েব ডেভেলপার।",
        en: "I am Rahat Ahmed, born June 21, 2006, in Jibdara village, Shantiganj, Sunamganj. Currently studying in HSC 2nd Year Science at Sunamganj Govt. College. Alongside my studies, I am a home tutor, co-founder & General Secretary of Shantichakra Blood Society, founder of FS Coaching Center, active BNCC Cadet (#25071152), and web developer.",
      },
    },
    {
      q: { bn: "কেন আপনার কাছ থেকে ওয়েবসাইট তৈরি করাব?", en: "Why should clients hire you to build their website?" },
      a: {
        bn: "আমি শুধুমাত্র সুন্দর ডিজাইন তৈরি করি না — আমি একটি সম্পূর্ণ ডিজিটাল সমাধান গড়ে তুলি। AI প্রযুক্তি ব্যবহার করায় প্রজেক্টের কাজ অতি দ্রুত এবং নির্ভুলভাবে সম্পন্ন হয়। সিকিউরিটি, উচ্চ পারফরম্যান্স (Lighthouse 100/100), সম্পূর্ণ রেসপন্সিভ মোবাইল ফ্রেন্ডলি ইন্টারফেস এবং যুক্তিসঙ্গত মূল্যই আমার প্রধান বৈশিষ্ট্য।",
        en: "I don't just build designs — I craft complete digital solutions. Leveraging AI acceleration allows me to deliver flawless projects rapidly. High security, 100/100 Lighthouse performance, full mobile responsiveness, and affordable investment are my core promises.",
      },
    },
    {
      q: { bn: "আপনি কীভাবে এআই ব্যবহার করে কাজ করেন?", en: "How do you professionally use AI in development?" },
      a: {
        bn: "আমি এআই-কে অলসতার জন্য নয়, বরং কাজের গতি এবং গুণমান বহুগুণ বাড়াতে ব্যবহার করি। আইডিয়া জেনারেশন, আর্কিটেকচার প্ল্যানিং, সিকিউরিটি অডিট, ফাস্ট টাইপ-সেফ কোডিং এবং এসইও অপটিমাইজেশনের প্রতি ধাপে সেরা AI টুলস (Cursor, Claude 3.5, ChatGPT, v0) ব্যবহার করা হয়।",
        en: "I use AI not to bypass hard work, but to amplify human creativity, speed, and standard. From concept mapping to security auditing, fast TypeScript engineering, and SEO polish, I utilize top AI tools (Cursor, Claude 3.5, ChatGPT, v0).",
      },
    },
    {
      q: { bn: "আপনার শিক্ষা ও সামাজিক কার্যক্রম সম্পর্কে বলবেন?", en: "Can you tell me about your social and education work?" },
      a: {
        bn: "আমি গ্রামে গরিব শিক্ষার্থীদের সাহায্যের জন্য ২০২৩ সালে 'হেল্পিং হ্যান্ড অর্গানাইজেশন' এবং ২০২৪ সালের ৩১ ডিসেম্বর 'FS কোচিং সেন্টার' গড়ে তুলি। এছাড়া সুনামগঞ্জের সর্ববৃহৎ স্বেচ্ছাসেবী সংগঠন 'শান্তিচক্র ব্লাড সোসাইটি'-এর সহ-প্রতিষ্ঠাতা ও সাধারণ সম্পাদক হিসেবে প্রতিনিয়ত রক্তের প্রয়োজনে মানুষের পাশে দাঁড়াচ্ছি। আমি নিজেও A+ রক্তদাতা (৪ বার দান করেছি)।",
        en: "I founded 'Helping Hand Organization' in 2023 and 'FS Coaching Center' on Dec 31, 2024, to support village students. As Co-Founder & General Secretary of 'Shantichakra Blood Society', I manage emergency blood donation networks in Sunamganj. I am an A+ donor myself with 4 voluntary donations.",
      },
    },
    {
      q: { bn: "আপনার বাবার স্মৃতির প্রতি আপনার অনুভূতি কী?", en: "What is your tribute to your late father?" },
      a: {
        bn: "আমার শ্রদ্ধেয় পিতা মরহুম জনাব ফরিদ আহমেদ ছিলেন শিমুলবাঁক ইউনিয়ন পরিষদের ৯ বছরের সফল চেয়ারম্যান, স্কুল ও মাদ্রাসার সভাপতি এবং প্রখ্যাত সমাজসেবক। তাঁর সততা, জনগণের প্রতি ভালোবাসা এবং উন্নয়নমূলক কাজ আমাকে প্রতিদিন মানুষের সেবায় কাজ করতে অনুপ্রেরণা জোগায়।",
        en: "My beloved father Late Md. Farid Ahmed was a legend — former Chairman of Shimulbank UP for 9 consecutive years, school/madrasa president, and renowned arbitrator. His honesty, love for people, and legacy inspire everything I do.",
      },
    },
  ];

  return (
    <div
      className={`relative w-full rounded-3xl border border-white/15 bg-[#09111e] text-white shadow-2xl transition-all duration-300 overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen" : "min-h-[750px]"
      }`}
    >
      {/* Dynamic Background FX */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#09111e] via-[#0e1c2e] to-[#080d19] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-black/40 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-pink-500 font-extrabold text-white shadow-glow">
            RA
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">
                AGENCY HEADQUARTERS
              </span>
              <span className="rounded-full bg-brand-500/20 px-2.5 py-0.5 text-[10px] font-bold text-brand-400 border border-brand-500/30">
                CH. 4
              </span>
            </div>
            <div className="text-xs text-cyan-200/80 font-mono">
              RAHATVERSE · THE COMMAND CENTER
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSpeechMuted(!speechMuted)}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold hover:bg-white/10 transition-colors"
          >
            {speechMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
            <span>{speechMuted ? "Muted" : "Voice Guide"}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full border border-rose-500/30 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
              title="Close Headquarters"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Layout: Sidebar Nav + Avatar Box + Room View */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[280px_1fr] min-h-[660px]">
        {/* Sidebar Navigation */}
        <aside className="border-r border-white/10 bg-black/30 p-4 flex flex-col justify-between gap-4">
          <div className="space-y-1.5">
            <div className="px-3 text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
              Headquarters Rooms
            </div>
            {roomsList.map((rm) => {
              const Icon = rm.icon;
              const isActive = activeRoom === rm.id;
              const isVisited = visitedRooms.has(rm.id);
              return (
                <button
                  key={rm.id}
                  onClick={() => handleRoomChange(rm.id)}
                  className={`w-full flex items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${rm.accent} text-white shadow-glow scale-[1.02]`
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{t(rm.title)}</span>
                  </div>
                  {isVisited && !isActive && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Progress / Secret Meter */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-white/70">Exploration Progress</span>
              <span className="text-cyan-300 font-mono">
                {Math.round((visitedRooms.size / 9) * 100)}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (visitedRooms.size / 9) * 100)}%` }}
              />
            </div>
            {unlockedSecret ? (
              <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-semibold">
                <Sparkles className="h-3 w-3" /> Secret Vision Room Unlocked!
              </div>
            ) : (
              <div className="text-[10px] text-white/40">
                Visit 5 rooms to unlock the Hidden Story.
              </div>
            )}
          </div>
        </aside>

        {/* Content Area */}
        <main className="p-6 overflow-y-auto max-h-[82vh] space-y-6">
          {/* Avatar Guidance Box */}
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-black/50 to-purple-950/30 p-4 shadow-lift backdrop-blur-md">
            {/* Avatar Visual */}
            <div className="relative shrink-0">
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-glow bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/profile.jpg" alt="Rahat Avatar" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-cyan-500/10" />
              </div>
              <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#09111e] ${isSpeaking ? "bg-emerald-400 animate-ping" : "bg-cyan-400"}`} />
            </div>

            {/* Avatar Dialogue Bubble */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  RAHAT&rsquo;S DIGITAL AVATAR
                </span>
                <span className="text-[10px] font-mono text-white/50">GUIDE SYSTEM v4.0</span>
              </div>
              <p className="text-sm leading-relaxed text-white/90 font-medium">
                “{avatarMessage}”
              </p>
            </div>
          </div>

          {/* ROOM 1: Entrance Lobby */}
          {activeRoom === "lobby" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-950/40 via-surface/40 to-slate-900/60 p-8 text-center space-y-6 shadow-2xl">
                {/* 3D Hologram Billboard */}
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl border-2 border-brand-400/50 bg-brand-500/10 shadow-glow animate-pulse">
                  <Building2 className="h-14 w-14 text-brand-400" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gradient-brand">
                    AGENCY HEADQUARTERS
                  </h1>
                  <p className="text-base font-medium text-cyan-200/90 max-w-xl mx-auto">
                    {t({
                      bn: "রাহাতভার্সের সবচেয়ে উঁচু ও দৃষ্টিনন্দন ডিজিটাল আইকন। এটি কেবল একটি স্পেস নয় — এটি বিশ্বাস ও শ্রেষ্ঠত্বের প্রতীক।",
                      en: "The tallest and most impressive digital landmark in RahatVerse. Not just an about page — a fortress of trust and capability.",
                    })}
                  </p>
                </div>

                {/* Reception Quick Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-1">
                    <div className="text-brand-400 text-lg font-bold">🤖 AI Reception Desk</div>
                    <p className="text-xs text-white/70">
                      Welcome assistance, room guidance, and interactive Q&A response engine.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-1">
                    <div className="text-cyan-400 text-lg font-bold">🔮 Holographic Exhibits</div>
                    <p className="text-xs text-white/70">
                      Explore every section through interactive 3D stations and visual panels.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-1">
                    <div className="text-amber-400 text-lg font-bold">📜 Complete Authenticity</div>
                    <p className="text-xs text-white/70">
                      100% complete story, life achievements, and tribute preserved without summary.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleRoomChange("about_hall")}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-pink-500 px-8 py-3.5 font-bold text-white shadow-glow transition-transform hover:scale-105"
                  >
                    <span>Start Tour: Enter About Me Hall</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ROOM 2: About Me Hall */}
          {activeRoom === "about_hall" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <User className="h-6 w-6 text-cyan-400" />
                    {t(about.title)} — Exhibition Hall
                  </h2>
                  <p className="text-xs text-cyan-200/80">{t(about.subtitle)}</p>
                </div>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/30">
                  {t(about.badge.title)} ({t(about.badge.sub)})
                </span>
              </div>

              {/* Story Paragraphs in Holographic Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {about.story.map((st, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-5 space-y-3 hover:border-cyan-400/40 transition-all shadow-lift"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                      <span>PANEL #{idx + 1}</span>
                      <span>STORY CHAPTER</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/90 font-medium">
                      {t(st)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quote Banner */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center space-y-2">
                <div className="text-amber-300 text-lg font-bold">“{t(about.quote)}”</div>
                <div className="text-xs text-white/60">— Rahat Ahmed&rsquo;s Driving Philosophy</div>
              </div>

              {/* Personal Facts Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Verified Personal Facts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {about.facts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-3.5 hover:border-brand-500/30 transition-colors"
                    >
                      <span className="text-2xl p-2 rounded-xl bg-white/5">{fact.icon}</span>
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase font-bold text-white/50 truncate">
                          {t(fact.label)}
                        </div>
                        <div className="text-xs font-bold text-white truncate">
                          {t(fact.value)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ROOM 3: Journey Timeline */}
          {activeRoom === "timeline" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Compass className="h-6 w-6 text-amber-400" />
                  My Journey Timeline
                </h2>
                <p className="text-xs text-white/60">Walk along the milestones of my life and growth.</p>
              </div>

              {/* Horizontal / Grid Timeline Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {timelineEvents.map((evt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTimelineIdx(idx)}
                    className={`rounded-xl p-3 text-center border transition-all ${
                      selectedTimelineIdx === idx
                        ? "border-amber-400 bg-amber-500/20 text-white scale-105 shadow-glow"
                        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-xl mb-1">{evt.icon}</div>
                    <div className="text-xs font-bold font-mono">{evt.year}</div>
                  </button>
                ))}
              </div>

              {/* Milestone Detail Card */}
              {timelineEvents[selectedTimelineIdx] && (
                <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-amber-950/30 via-black/50 to-slate-900/60 p-6 space-y-4 shadow-2xl">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{timelineEvents[selectedTimelineIdx].icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {t(timelineEvents[selectedTimelineIdx].title)}
                        </h3>
                        <div className="text-xs font-mono text-amber-300">
                          {timelineEvents[selectedTimelineIdx].date}
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-200 border border-amber-400/30">
                      {timelineEvents[selectedTimelineIdx].tag}
                    </span>
                  </div>
                  <p className="text-base leading-relaxed text-white/90">
                    {t(timelineEvents[selectedTimelineIdx].desc)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ROOM 4: Mission & Vision */}
          {activeRoom === "mission_vision" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-violet-400" />
                  Mission & Vision Room
                </h2>
                <p className="text-xs text-white/60">The core driving forces behind the agency.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mission Card */}
                <div className="rounded-3xl border border-violet-500/40 bg-gradient-to-b from-violet-950/40 to-black/60 p-6 space-y-4 shadow-lift">
                  <div className="flex items-center gap-3 text-violet-400">
                    <Flame className="h-7 w-7" />
                    <h3 className="text-xl font-bold">OUR MISSION</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-white/90 font-medium">
                    {t({
                      bn: "মানুষের পাশে দাঁড়ানো, শেখে ও অন্যকে শেখানো। মানসম্মত আধুনিক ওয়েব প্ল্যাটফর্ম তৈরির মাধ্যমে ছোট-বড় উদ্যোগসমূহকে ডিজিটালি ক্ষমতায়ন করা এবং অর্জিত জ্ঞান ও আয়ের একাংশ দিয়ে সমাজে শিক্ষার আলো ছড়িয়ে দেওয়া।",
                      en: "Standing by people, learning, and teaching. Empowering businesses digitally with modern web platforms and utilizing knowledge and earnings to uplift society through education.",
                    })}
                  </p>
                </div>

                {/* Vision Card */}
                <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/40 to-black/60 p-6 space-y-4 shadow-lift">
                  <div className="flex items-center gap-3 text-cyan-400">
                    <Globe className="h-7 w-7" />
                    <h3 className="text-xl font-bold">OUR VISION</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-white/90 font-medium">
                    {t({
                      bn: "একটি বিশ্বমানের এআই-সহায়তাচালিত ওয়েব ডেভেলপমেন্ট এজেন্সি গড়ে তোলা যা বিশ্বজুড়ে সর্বোচ্চ গতি, নিরাপত্তা এবং নান্দনিক ওয়েব অ্যাপ্লিকেশন সরবরাহ করবে। সুনামগঞ্জের মাটি থেকে সারা বিশ্বে প্রযুক্তির নতুন দৃষ্টান্ত স্থাপন করা।",
                      en: "Establishing a world-class AI-powered Web Agency delivering top speed, security, and aesthetics globally, proving that high tech innovation thrives right from Sunamganj, Bangladesh.",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ROOM 5: Skills Laboratory */}
          {activeRoom === "skills_lab" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Cpu className="h-6 w-6 text-emerald-400" />
                  Skills Laboratory (Interactive Stations)
                </h2>
                <p className="text-xs text-white/60">No static percentages — test interactive demonstrations for each capability.</p>
              </div>

              {/* Station Nav Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
                {[
                  { id: "frontend", label: "Frontend Station", icon: Code },
                  { id: "backend", label: "Backend & DB Station", icon: Terminal },
                  { id: "ai", label: "AI Prompt Generator", icon: Zap },
                  { id: "design", label: "UI/UX Station", icon: Layers },
                  { id: "perf", label: "Performance Benchmark", icon: Flame },
                  { id: "seo", label: "SEO Auditor", icon: Search },
                  { id: "deploy", label: "CI/CD Pipeline", icon: ExternalLink },
                ].map((st) => {
                  const Icon = st.icon;
                  const isActive = skillDemoTab === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setSkillDemoTab(st.id as any)}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                        isActive
                          ? "bg-emerald-500 text-black shadow-glow"
                          : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {st.label}
                    </button>
                  );
                })}
              </div>

              {/* Station Demo Content */}
              <div className="rounded-3xl border border-emerald-500/30 bg-black/60 p-6 space-y-4 min-h-[280px]">
                {skillDemoTab === "frontend" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-emerald-400">
                        Frontend Interactive Playground (React 18 / Next.js 14)
                      </h3>
                      <span className="text-xs font-mono text-white/50">Live React State Demo</span>
                    </div>
                    <p className="text-xs text-white/70">
                      Test live reactive component state, dynamic theme styling, and micro-interactions.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5">
                      <button
                        onClick={() => setDemoState((p) => ({ ...p, count: p.count + 1 }))}
                        className="rounded-xl bg-emerald-500 px-4 py-2 font-bold text-black hover:bg-emerald-400 transition-transform active:scale-95"
                      >
                        Click Counter: {demoState.count}
                      </button>

                      <div className="flex items-center gap-2 text-xs">
                        <span>Theme:</span>
                        {(["neon", "cyan", "gold"] as const).map((th) => (
                          <button
                            key={th}
                            onClick={() => setDemoState((p) => ({ ...p, theme: th }))}
                            className={`px-3 py-1 rounded-lg uppercase font-bold text-[10px] border ${
                              demoState.theme === th
                                ? "bg-white text-black border-white"
                                : "border-white/20 text-white/60"
                            }`}
                          >
                            {th}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-2xl border transition-all ${
                        demoState.theme === "neon"
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                          : demoState.theme === "cyan"
                          ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-200"
                          : "border-amber-500/50 bg-amber-500/10 text-amber-200"
                      }`}
                    >
                      <div className="text-sm font-bold">Dynamic Component Output</div>
                      <div className="text-xs opacity-80 mt-1 font-mono">
                        Rendering {demoState.count} reactive instances in {demoState.theme} mode with 0ms frame drop.
                      </div>
                    </div>
                  </div>
                )}

                {skillDemoTab === "backend" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-emerald-400">
                      Supabase RLS & PostgreSQL Security Simulator
                    </h3>
                    <p className="text-xs text-white/70">Test mock database query authorization and Row Level Security.</p>
                    <button
                      onClick={() =>
                        setDemoState((p) => ({
                          ...p,
                          queryResult: JSON.stringify(
                            { status: "SUCCESS 200 OK", rls_check: "PASSED", user_role: "visitor", records_fetched: 3 },
                            null,
                            2
                          ),
                        }))
                      }
                      className="rounded-xl bg-cyan-500 px-4 py-2 font-bold text-black hover:bg-cyan-400 transition-colors"
                    >
                      Execute Secure DB Query
                    </button>

                    {demoState.queryResult && (
                      <pre className="p-4 rounded-2xl bg-black border border-cyan-500/30 text-xs font-mono text-cyan-300 overflow-x-auto">
                        {demoState.queryResult}
                      </pre>
                    )}
                  </div>
                )}

                {skillDemoTab === "ai" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-emerald-400">AI Prompt-to-Code Pipeline</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={demoState.aiPrompt}
                        onChange={(e) => setDemoState((p) => ({ ...p, aiPrompt: e.target.value }))}
                        className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs text-white"
                      />
                      <button
                        onClick={() => {
                          setDemoState((p) => ({ ...p, aiGenerating: true }));
                          setTimeout(() => {
                            setDemoState((p) => ({
                              ...p,
                              aiGenerating: false,
                              aiOutput: `// Generated with RahatVerse AI Workflow
export function Hero() {
  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 shadow-glow">
      <h1 className="text-4xl font-extrabold text-gradient-brand">Future Web AI</h1>
    </div>
  );
}`,
                            }));
                          }, 1200);
                        }}
                        className="rounded-xl bg-brand-500 px-4 py-2 font-bold text-white hover:bg-brand-400"
                      >
                        {demoState.aiGenerating ? "Generating..." : "Generate Code"}
                      </button>
                    </div>

                    {demoState.aiOutput && (
                      <pre className="p-4 rounded-2xl bg-black border border-brand-500/30 text-xs font-mono text-pink-300 overflow-x-auto">
                        {demoState.aiOutput}
                      </pre>
                    )}
                  </div>
                )}

                {skillDemoTab === "design" && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-emerald-400">UI/UX Glassmorphism & Micro-Interactions</h3>
                    <p className="text-xs text-white/70">Seamless glass effects, high contrast readability, responsive grid systems.</p>
                    <div className="p-6 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl space-y-2 text-center">
                      <div className="text-xl font-bold text-white">Glassmorphic Card Sample</div>
                      <div className="text-xs text-white/70">Backdrop blur 16px · Border opacity 20%</div>
                    </div>
                  </div>
                )}

                {skillDemoTab === "perf" && (
                  <div className="space-y-4 text-center py-4">
                    <div className="text-5xl font-black text-emerald-400 animate-bounce">100 / 100</div>
                    <div className="text-sm font-bold text-white">Lighthouse Performance Target</div>
                    <p className="text-xs text-white/60">Zero layout shifts, sub-second First Contentful Paint, edge cached assets.</p>
                  </div>
                )}

                {skillDemoTab === "seo" && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-emerald-400">Live Search Snippet Auditor</h3>
                    <div className="p-4 rounded-2xl bg-white text-black space-y-1">
                      <div className="text-xs text-emerald-700 font-mono">https://rahatahmedbd.github.io › about</div>
                      <div className="text-sm font-bold text-blue-700">{demoState.seoTitle}</div>
                      <div className="text-xs text-gray-600">{demoState.seoDesc}</div>
                    </div>
                  </div>
                )}

                {skillDemoTab === "deploy" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-emerald-400">Vercel & GitHub Actions Deployment</h3>
                    <button
                      onClick={() => {
                        setDemoState((p) => ({ ...p, building: true, buildProgress: 0 }));
                        const interval = setInterval(() => {
                          setDemoState((p) => {
                            if (p.buildProgress >= 100) {
                              clearInterval(interval);
                              return { ...p, building: false };
                            }
                            return { ...p, buildProgress: p.buildProgress + 25 };
                          });
                        }, 400);
                      }}
                      className="rounded-xl bg-emerald-500 px-4 py-2 font-bold text-black"
                    >
                      {demoState.building ? `Deploying ${demoState.buildProgress}%` : "Trigger Production Deploy"}
                    </button>

                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${demoState.buildProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ROOM 6: AI Development Process */}
          {activeRoom === "ai_process" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Zap className="h-6 w-6 text-sky-400" />
                  AI Development Process Room
                </h2>
                <p className="text-xs text-white/60">How I professionally combine human expertise with AI tools.</p>
              </div>

              {/* Process Step Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {aiProcessSteps.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAiStep(idx)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      aiStep === idx
                        ? "border-sky-400 bg-sky-500/20 text-white shadow-glow scale-105"
                        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-[10px] font-mono text-sky-300 font-bold">STEP {p.step}</div>
                    <div className="text-xs font-bold truncate mt-1">{t(p.title)}</div>
                  </button>
                ))}
              </div>

              {/* Active Step Viewer */}
              {aiProcessSteps[aiStep] && (
                <div className="rounded-3xl border border-sky-400/40 bg-gradient-to-br from-sky-950/30 via-black/50 to-slate-900/60 p-6 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-xl font-bold text-white">
                      {aiProcessSteps[aiStep].step}. {t(aiProcessSteps[aiStep].title)}
                    </h3>
                    <span className="text-xs font-mono text-sky-300">Phase {aiStep + 1} of 8</span>
                  </div>
                  <p className="text-sm leading-relaxed text-white/90">
                    {t(aiProcessSteps[aiStep].desc)}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-xs font-bold text-white/50 self-center">Tools Used:</span>
                    {aiProcessSteps[aiStep].tools.map((tl, i) => (
                      <span key={i} className="rounded-lg bg-sky-500/20 px-3 py-1 text-xs font-mono text-sky-200 border border-sky-500/30">
                        {tl}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ROOM 7: Achievement Gallery & Tribute */}
          {activeRoom === "achievements_gallery" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Award className="h-6 w-6 text-yellow-400" />
                  Achievement Gallery & Honor Hall
                </h2>
                <p className="text-xs text-white/60">Academic achievements, community initiatives, and tribute to late father.</p>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {achievements.stats.map((st, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <div className="text-3xl font-black text-amber-400">{st.value}{st.suffix ? "+" : ""}</div>
                    <div className="text-xs text-white/70 mt-1 font-semibold">{t(st.label)}</div>
                  </div>
                ))}
              </div>

              {/* Featured SSC Card */}
              <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-amber-950/40 via-surface/40 to-slate-900/60 p-6 space-y-3 shadow-lift">
                <div className="flex items-center justify-between text-xs font-mono text-amber-300">
                  <span>{t(achievements.featured.badge)}</span>
                  <span>{t(achievements.featured.date)}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{t(achievements.featured.title)}</h3>
                <p className="text-xs text-white/80 leading-relaxed">{t(achievements.featured.desc)}</p>
              </div>

              {/* Tribute to Late Father Md. Farid Ahmed */}
              <div className="rounded-3xl border border-rose-500/40 bg-gradient-to-br from-rose-950/40 via-black/60 to-purple-950/30 p-6 space-y-4 shadow-2xl">
                <div className="flex items-center gap-3 text-rose-400">
                  <Heart className="h-6 w-6" />
                  <h3 className="text-xl font-bold">{t(tribute.title)} — {t(tribute.name)}</h3>
                </div>
                <div className="text-xs font-mono text-rose-300">{t(tribute.relation)} · {t(tribute.date)}</div>
                <p className="text-xs leading-relaxed text-white/90">{t(tribute.intro)}</p>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-rose-300 uppercase">{t(tribute.worksTitle)}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/80">
                    {tribute.works.slice(0, 6).map((wk, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-xl bg-white/5 p-2">
                        <span>🏛️</span> {t(wk)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ROOM 8: Personal Philosophy */}
          {activeRoom === "philosophy" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Heart className="h-6 w-6 text-indigo-400" />
                  Personal Philosophy Room
                </h2>
                <p className="text-xs text-white/60">Core values, design ethics, and quality commitments.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-indigo-500/30 bg-white/5 p-5 space-y-2">
                  <div className="text-indigo-300 font-bold">1. Work Ethics & Transparency</div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Honesty in timelines, clear communication on requirements, zero hidden costs or shortcuts.
                  </p>
                </div>
                <div className="rounded-2xl border border-indigo-500/30 bg-white/5 p-5 space-y-2">
                  <div className="text-indigo-300 font-bold">2. Design & Usability Principles</div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Clean aesthetics, fluid micro-interactions, dark mode elegance, and WCAG accessibility enforcement.
                  </p>
                </div>
                <div className="rounded-2xl border border-indigo-500/30 bg-white/5 p-5 space-y-2">
                  <div className="text-indigo-300 font-bold">3. Uncompromising Quality</div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Target 100/100 Lighthouse performance, multi-device mobile optimization, and Supabase RLS security.
                  </p>
                </div>
                <div className="rounded-2xl border border-indigo-500/30 bg-white/5 p-5 space-y-2">
                  <div className="text-indigo-300 font-bold">4. Technology with Social Impact</div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Using skills and agency success to empower education, blood donor networks, and youth technology literacy.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ROOM 9: Q&A Station */}
          {activeRoom === "qa_station" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-fuchsia-400" />
                  Interactive Q&A Station
                </h2>
                <p className="text-xs text-white/60">Ask predefined questions and listen to my response.</p>
              </div>

              <div className="space-y-3">
                {qaPairs.map((pair, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 hover:border-fuchsia-400/40 transition-all"
                  >
                    <button
                      onClick={() => {
                        setQaIndex(qaIndex === idx ? null : idx);
                        const ans = t(pair.a);
                        setAvatarMessage(ans);
                        speakText(ans);
                      }}
                      className="w-full flex items-center justify-between text-left text-sm font-bold text-white"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-fuchsia-400">Q{idx + 1}.</span> {t(pair.q)}
                      </span>
                      <ChevronRight className={`h-4 w-4 transition-transform ${qaIndex === idx ? "rotate-90 text-fuchsia-400" : "text-white/40"}`} />
                    </button>

                    {qaIndex === idx && (
                      <p className="text-xs leading-relaxed text-white/80 pt-2 border-t border-white/10">
                        {t(pair.a)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ROOM 10: Hidden Story (Secret Vision) */}
          {activeRoom === "secret_future" && unlockedSecret && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-3xl border border-amber-400/50 bg-gradient-to-br from-amber-950/50 via-black/70 to-purple-950/40 p-8 space-y-6 shadow-2xl">
                <div className="flex items-center gap-3 text-amber-300">
                  <Sparkles className="h-8 w-8" />
                  <h2 className="text-2xl font-black">MY FUTURE VISION (SECRET STORY)</h2>
                </div>
                <p className="text-sm leading-relaxed text-white/90">
                  {t({
                    bn: "আপনি রাহাতভার্স এজেন্সি হেডকোয়ার্টার্সের গোপন কক্ষ আনলক করেছেন! আমার দীর্ঘমেয়াদী স্বপ্ন হলো সুনামগঞ্জ জেলায় একটি আন্তর্জাতিক মানের টেকনোলজি ও এআই ল্যাব স্থাপন করা। যেখানে তরুণদের জন্য বিনামূল্যে কোডিং প্রশিক্ষণ দেওয়া হবে, FS কোচিং সেন্টার পুনরায় চালু হবে এবং শান্তিচক্র ব্লাড সোসাইটিকে একটি দেশব্যাপী স্মার্ট ব্লাড ডোনার ডেটাবেস অ্যাপে রূপান্তরিত করা হবে।",
                    en: "You unlocked the secret room of RahatVerse Headquarters! My long-term dream is to establish an international-grade Tech & AI Lab in Sunamganj — offering free coding education to village youth, reopening FS Coaching Center, and expanding Shantichakra Blood Society into a nationwide smart donor network app.",
                  })}
                </p>
              </div>
            </div>
          )}

          {/* ROOM 11: Exit Experience */}
          {activeRoom === "exit" && (
            <div className="space-y-6 animate-fadeIn text-center py-8">
              <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-glow">
                🏛️
              </div>
              <div className="space-y-2 max-w-lg mx-auto">
                <h2 className="text-3xl font-black text-white">Tour Complete!</h2>
                <p className="text-sm text-white/80">
                  “Now that you know who I am, let me show you what I have built.”
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <a
                  href="#achievements"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3.5 font-bold text-black shadow-glow transition-transform hover:scale-105"
                >
                  <span>Explore Portfolio & Achievements</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
