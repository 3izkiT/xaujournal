import dynamic from "next/dynamic";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { LandingPageSkeleton } from "@/components/landing/LandingPageSkeleton";
import { homePageMetadata } from "@/lib/seo-home";

export const metadata = homePageMetadata;

const LandingExperience = dynamic(
  () => import("@/components/landing/LandingExperience").then((m) => m.LandingExperience),
  { loading: () => <LandingPageSkeleton /> }
);

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <LandingExperience />
    </>
  );
}
