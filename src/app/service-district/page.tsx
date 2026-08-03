import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Interactive Service District | Rahat Ahmed",
  description:
    "Explore the 3D Service District of Rahat Ahmed: nine digital service buildings, an AI consultant, a visual project builder, portal packages and the mission launch center — then order your website.",
};

/**
 * The full interactive Service District. Self-contained (no props): it
 * renders its own tabs, modals and builder. Wrapped in a slim page shell so
 * visitors can always get back to the website or switch to RahatVerse.
 */
const ServiceDistrictMain = dynamic(
  () =>
    import("@/components/service-district/ServiceDistrictMain").then(
      (m) => m.ServiceDistrictMain
    ),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex flex-col items-center gap-3 text-sm text-fg-muted">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          Loading the Service District…
        </div>
      </div>
    ),
  }
);

export default function ServiceDistrictPage() {
  return (
    <main className="relative min-h-screen pb-16 pt-24 sm:pt-28">
      <ServiceDistrictMain />
    </main>
  );
}
