import type { Metadata } from "next";
import { ServiceDistrictMain } from "@/components/service-district/ServiceDistrictMain";

export const metadata: Metadata = {
  title: "Service District & Interactive Website Order Journey | Rahat Ahmed",
  description:
    "Explore Rahat Ahmed's Service District. Interactive service building hubs, AI Consultant, 3D visual website builder, package portals, and live mission launch.",
};

export default function ServiceDistrictPage() {
  return <ServiceDistrictMain />;
}
