import {
  Bot,
  Briefcase,
  Building,
  Building2,
  Code,
  Cpu,
  GraduationCap,
  Heart,
  ShoppingBag,
  Sparkles,
  Utensils,
} from "lucide-react";

/** Maps the icon name stored on each website category to a lucide icon. */
export function CategoryIcon({
  name,
  className = "h-6 w-6",
}: {
  name: string;
  className?: string;
}) {
  switch (name) {
    case "Building2":
      return <Building2 className={className} />;
    case "ShoppingBag":
      return <ShoppingBag className={className} />;
    case "Heart":
      return <Heart className={className} />;
    case "Briefcase":
      return <Briefcase className={className} />;
    case "GraduationCap":
      return <GraduationCap className={className} />;
    case "Hospital":
    case "Building":
      return <Building className={className} />;
    case "Utensils":
      return <Utensils className={className} />;
    case "Code":
      return <Code className={className} />;
    case "Cpu":
      return <Cpu className={className} />;
    case "Bot":
      return <Bot className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}
