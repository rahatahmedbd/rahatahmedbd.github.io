import type { Metadata } from "next";
import { ServiceDistrictMain } from "@/components/service-district/ServiceDistrictMain";

export const metadata: Metadata = {
  title: "Service District & Web Development Services | Rahat Ahmed",
  description:
    "Explore Rahat Ahmed's interactive Service District with 9 service buildings, AI consultant, 3D visual website builder, and package portals.",
};

export default function ServicesPage() {
  return (
    <div className="relative min-h-screen py-6 sm:py-12">
      <ServiceDistrictMain />
    </div>
  );
}
