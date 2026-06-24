import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { H1, Text, Label } from "@/components/ui/typography";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PsytechGrid } from "@/components/kingdom/psytech-grid";

export const metadata: Metadata = {
  title: "Psychotechnologies — SYNARKIA",
  description:
    "The family of psychotechnologies SYNARKIA works with — ways of training attention, expanding perception, deepening soul, and upgrading cognition.",
};

export default function Psychotechnologies() {
  return (
    <>
      <Navbar />
      <main className="bg-void min-h-screen pt-20">
        <Section className="py-24 md:py-32">
          <Container size="xl">
            <Label className="text-lavender mb-6 block">The Inner Toolkit</Label>
            <H1 className="type-hero mb-8 max-w-4xl">Psychotechnologies of Synarkia</H1>
            <Text className="type-body text-stone max-w-3xl mb-0">
              Synarkia works with a broad family of psychotechnologies — ways of training attention,
              expanding perception, deepening soul, and upgrading cognition. We believe that systemic
              change must be rooted in a fundamental shift in human consciousness.
            </Text>
          </Container>
        </Section>

        <Section className="pt-0 pb-32">
          <Container size="xl">
            <PsytechGrid />
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
