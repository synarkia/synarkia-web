import type { Metadata } from "next";
import { LegalView } from "@/components/views/legal-view";

export const metadata: Metadata = {
  title: "Privacy — Syndao",
};

export default function PrivacyPage() {
  return <LegalView type="privacy" />;
}
