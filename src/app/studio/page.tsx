import type { Metadata } from "next";
import { StudioView } from "@/components/views/studio-view";

export const metadata: Metadata = {
  title: "Studio · Syndao",
  description:
    "Syndao Studio builds the strategic layer: positioning, identity, visual systems, and copywriting that make your business the evident choice.",
};

export default function StudioPage() {
  return <StudioView />;
}
