'use client';

import React, { useState } from 'react';
import { DistrictPanel } from './DistrictPanel';

const districtsData = [
  {
    id: 'website-store',
    title: 'Website Store',
    icon: '🏢',
    description: 'Order premium, modern, and mobile-first websites starting from ৳8,000.',
    stats: [
      { label: 'Starting Price', value: '৳8,000' },
      { label: 'Delivery', value: '5-12 days' },
    ],
    exploreLink: '/order',
  },
  {
    id: 'about',
    title: 'About Me Center',
    icon: '👤',
    description: 'Student, Teacher, Blood Donor, BNCC Cadet & Web Developer from Sunamganj.',
    stats: [
      { label: 'Born', value: '2006' },
      { label: 'Location', value: 'Sunamganj' },
    ],
  },
  {
    id: 'education',
    title: 'Education Academy',
    icon: '🏫',
    description: 'HSC 2nd Year Science at Sunamganj Government College. SSC GPA 5.00.',
    stats: [
      { label: 'SSC', value: 'GPA 5.00' },
      { label: 'Current', value: 'HSC 2nd Year' },
    ],
  },
  {
    id: 'achievements',
    title: 'Achievement Tower',
    icon: '🏆',
    description: 'Multiple 1st place wins in National Science Fairs and academic excellence.',
    stats: [
      { label: '1st Places', value: '6+' },
      { label: 'Achievements', value: '12+' },
    ],
  },
  {
    id: 'portfolio',
    title: 'Portfolio Hub',
    icon: '💼',
    description: 'Modern web development projects built with Next.js, React & TypeScript.',
    stats: [
      { label: 'Projects', value: 'Multiple' },
      { label: 'Focus', value: 'Modern Web' },
    ],
  },
  {
    id: 'blood',
    title: 'Blood Donation Center',
    icon: '❤️',
    description: 'Co-Founder & General Secretary of Shantichakra Blood Society, Sunamganj.',
    stats: [
      { label: 'Donations', value: '4×' },
      { label: 'Role', value: 'General Secretary' },
    ],
  },
  {
    id: 'gallery',
    title: 'Gallery Museum',
    icon: '🖼️',
    description: 'Memorable moments from academic achievements, blood donation, and community work.',
    stats: [
      { label: 'Photos', value: '11+' },
      { label: 'Categories', value: '4' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact Center',
    icon: '📞',
    description: 'Get in touch for website orders, collaboration, or any inquiry.',
    stats: [
      { label: 'Response', value: '24h' },
      { label: 'WhatsApp', value: 'Available' },
    ],
    exploreLink: '#contact',
  },
];

interface SmartDistrictsProps {
  onDistrictSelect?: (districtId: string) => void;
}

export function SmartDistricts({ onDistrictSelect }: SmartDistrictsProps) {
  interface District {
    id: string;
    title: string;
    icon: string;
    description: string;
    stats?: Array<{ label: string; value: string }>;
    exploreLink?: string;
  }

  const [activeDistrict, setActiveDistrict] = useState<District | null>(null);

  const handleDistrictClick = (district: District) => {
    setActiveDistrict(district);
    onDistrictSelect?.(district.id);
  };

  const handleClose = () => {
    setActiveDistrict(null);
  };

  const handleExplore = () => {
    if (activeDistrict?.exploreLink) {
      window.location.href = activeDistrict.exploreLink;
    }
    handleClose();
  };

  return (
    <>
      {/* District Hotspots (simplified visual markers) */}
      <div className="fixed inset-0 pointer-events-none z-[55]">
        {districtsData.map((district, index) => (
          <button
            key={index}
            onClick={() => handleDistrictClick(district)}
            className="pointer-events-auto absolute px-4 py-1.5 text-xs bg-black/70 border border-white/30 rounded-full hover:bg-[#22d3ee] hover:text-black transition-all active:scale-95"
            style={{
              left: `${25 + (index % 4) * 18}%`,
              top: `${35 + Math.floor(index / 4) * 28}%`,
            }}
          >
            {district.icon} {district.title.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* District Information Panel */}
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
