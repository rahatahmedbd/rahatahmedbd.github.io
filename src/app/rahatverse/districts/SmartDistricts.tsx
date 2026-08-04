"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { rahatVerseDistricts } from "@/data/platform";
import { usePlatform } from "@/state/platform-context";
import type { RahatVerseDistrict } from "@/data/platform";
import { DistrictPanel } from "./DistrictPanel";

interface SmartDistrictsProps {
  onDistrictSelect?: (districtId: string) => void;
}

export function SmartDistricts({ onDistrictSelect }: SmartDistrictsProps) {
  const router = useRouter();
  const { setExperience } = usePlatform();
  const [activeDistrict, setActiveDistrict] = useState<RahatVerseDistrict | null>(null);

  const handleDistrictClick = (district: RahatVerseDistrict) => {
    setActiveDistrict(district);
    onDistrictSelect?.(district.id);
  };

  const handleClose = () => {
    setActiveDistrict(null);
  };

  const handleExplore = () => {
    if (!activeDistrict) return;

    // The store and every portfolio section resolve through the same Website
    // Experience routes; App Router navigation keeps the provider mounted.
    setExperience("website");
    router.push(activeDistrict.exploreRoute);
    handleClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[55] pointer-events-none">
        {rahatVerseDistricts.map((district, index) => (
          <button
            key={district.id}
            type="button"
            onClick={() => handleDistrictClick(district)}
            className="pointer-events-auto absolute rounded-full border border-white/30 bg-black/70 px-4 py-1.5 text-xs transition-all hover:bg-[#22d3ee] hover:text-black active:scale-95"
            style={{
              left: `${25 + (index % 4) * 18}%`,
              top: `${35 + Math.floor(index / 4) * 28}%`,
            }}
          >
            {district.icon} {district.title.split(" ")[0]}
          </button>
        ))}
      </div>

      {activeDistrict && (
        <DistrictPanel
          title={activeDistrict.title}
          icon={activeDistrict.icon}
          description={activeDistrict.description}
          stats={activeDistrict.stats}
          onContinue={handleClose}
          onExplore={handleExplore}
          onClose={handleClose}
        />
      )}
    </>
  );
}
