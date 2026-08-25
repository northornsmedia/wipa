import type { Metadata } from "next";
import PublicationDetailPage from "@/components/publications/PublicationDetailPage";
import { getPublication } from "@/lib/publications";

export const metadata: Metadata = {
  title: "The Global IP Magazine | WIPA Publications",
  description: "Explore The Global IP Magazine’s exclusive editorial and advertising offer for Alliance members.",
};

export default function GlobalIPMagazinePage() {
  return <PublicationDetailPage publication={getPublication("global-ip-magazine")!} />;
}
