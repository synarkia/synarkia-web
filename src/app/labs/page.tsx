import type { Metadata } from "next";
import { LabsView } from "@/components/views/labs-view";

export const metadata: Metadata = {
  title: "Lab · Syndao",
  description:
    "Syndao Lab builds the internal tools, AI systems, and automations that lift your response rate, lead generation, and invoicing.",
};

export default function LabsPage() {
  return <LabsView />;
}
