import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { H1, Text, Label } from "@/components/ui/typography";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MentorsGrid } from "@/components/kingdom/mentors-grid";

export const metadata: Metadata = {
  title: "Mentors & Lineage — SYNARKIA",
  description:
    "The wisdom streams behind SYNARKIA — visionary thinkers, mentors, and guides who have illuminated the path of sovereign co-creation.",
};

export default function Mentors() {
  return (
    <>
      <Navbar />
      <main className="bg-void min-h-screen pt-20">
        <Section className="py-24 md:py-32">
          <Container size="xl">
            <Label className="text-lavender mb-6 block">Lineage & Inspirations</Label>
            <H1 className="type-hero mb-8 max-w-4xl">We stand on the shoulders of giants.</H1>
            <Text className="type-body text-stone max-w-3xl mb-0">
              Synarkia weaves together wisdom streams from these visionary thinkers, mentors, and
              guides who have illuminated the path of sovereign co-creation.
            </Text>
          </Container>
        </Section>

        <Section className="pt-0 pb-32">
          <Container size="xl">
            <MentorsGrid />
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
