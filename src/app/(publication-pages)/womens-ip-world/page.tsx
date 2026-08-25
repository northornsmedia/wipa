import type { Metadata } from "next";
import PublicationDetailPage from "@/components/publications/PublicationDetailPage";
import { getPublication } from "@/lib/publications";

export const metadata: Metadata = {
  title: "Women’s IP World | WIPA Publications",
  description: "Explore the exclusive Women’s IP World opportunity for Women’s IP Alliance members.",
};

export default function WomensIPWorldPage() {
  return <PublicationDetailPage publication={getPublication("womens-ip-world")!} />;
}
