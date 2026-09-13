import type { Metadata } from "next";
import { AssetsView } from "@/components/views/assets-view";

export const metadata: Metadata = {
  title: "Asset Lab · Syndao",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function LabAssetsPage() {
  return <AssetsView />;
}
