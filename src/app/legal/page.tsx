import type { Metadata } from "next";
import { LegalView } from "@/components/views/legal-view";

export const metadata: Metadata = {
  title: "Legal notice · Syndao",
};

export default function LegalPage() {
  return <LegalView type="legal" />;
}
