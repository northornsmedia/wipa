import type { Metadata } from "next";
import PublicationDetailPage from "@/components/publications/PublicationDetailPage";
import { getPublication } from "@/lib/publications";

export const metadata: Metadata = {
  title: "IP Tech & Innovation Services Annual | WIPA Publications",
  description: "Explore the 2027 IP Tech & Innovation Services Annual opportunity for Alliance members.",
};

export default function IPTechInnovationAnnualPage() {
  return <PublicationDetailPage publication={getPublication("ip-tech-innovation-annual")!} />;
}
