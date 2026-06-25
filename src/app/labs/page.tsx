import type { Metadata } from "next";
import { LabsView } from "@/components/views/labs-view";

export const metadata: Metadata = {
  title: "Lab — Syndao",
  description:
    "Syndao Lab builds the infrastructure that captures, qualifies, and converts — so you stop doing manually what a machine should be doing for you.",
};

export default function LabsPage() {
  return <LabsView />;
}
