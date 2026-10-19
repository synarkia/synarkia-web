import type { Metadata } from "next";
import { LegalView } from "@/components/views/legal-view";

export const metadata: Metadata = {
  title: "Terms & Conditions · Syndao",
};

export default function TermsPage() {
  return <LegalView type="terms" />;
}
