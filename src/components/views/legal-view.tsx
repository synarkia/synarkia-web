"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CursorLight } from "@/components/ui/cursor-light";
import { useLang } from "@/i18n/language-provider";
import { EMAIL } from "@/lib/links";

/**
 * Bilingual legal pages. Company-specific fields are marked [TO COMPLETE] /
 * [À COMPLÉTER] — fill these before promoting to production.
 */

type Block = { h: string; body: string };
type Doc = { title: string; updated: string; blocks: Block[] };

const content: Record<"legal" | "privacy", { en: Doc; fr: Doc }> = {
  legal: {
    en: {
      title: "Legal notice",
      updated: "Last updated: June 2026",
      blocks: [
        { h: "Publisher", body: "This site is published by Syndao — [TO COMPLETE: legal name / status], headquartered at [TO COMPLETE: address]. [TO COMPLETE: registration / SIRET number]." },
        { h: "Publication director", body: "Leï Zagato." },
        { h: "Contact", body: `Email: ${EMAIL}.` },
        { h: "Hosting", body: "This site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA — vercel.com." },
        { h: "Intellectual property", body: "All content on this site (text, visuals, code, identity) is the property of Syndao unless otherwise stated, and may not be reproduced without prior written permission." },
      ],
    },
    fr: {
      title: "Mentions légales",
      updated: "Dernière mise à jour : juin 2026",
      blocks: [
        { h: "Éditeur", body: "Ce site est édité par Syndao — [À COMPLÉTER : raison sociale / statut], dont le siège est situé [À COMPLÉTER : adresse]. [À COMPLÉTER : numéro SIRET / immatriculation]." },
        { h: "Directeur de la publication", body: "Leï Zagato." },
        { h: "Contact", body: `E-mail : ${EMAIL}.` },
        { h: "Hébergeur", body: "Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA — vercel.com." },
        { h: "Propriété intellectuelle", body: "L'ensemble des contenus de ce site (textes, visuels, code, identité) est la propriété de Syndao sauf mention contraire, et ne peut être reproduit sans autorisation écrite préalable." },
      ],
    },
  },
  privacy: {
    en: {
      title: "Privacy",
      updated: "Last updated: June 2026",
      blocks: [
        { h: "What we collect", body: "When you use the contact form or write to us, we receive the information you provide (name, email, company, message). We do not sell or share it." },
        { h: "Why", body: "Solely to respond to your enquiry and, if relevant, to work together. We keep it no longer than necessary." },
        { h: "Analytics", body: "We use privacy-friendly, cookieless analytics to understand traffic in aggregate. No advertising trackers, no personal profiling." },
        { h: "Your rights", body: `Under the GDPR you can request access, correction, or deletion of your data at any time — just email ${EMAIL}.` },
        { h: "Bookings", body: "Scheduling a call uses Calendly, which processes your booking details under its own privacy policy." },
      ],
    },
    fr: {
      title: "Confidentialité",
      updated: "Dernière mise à jour : juin 2026",
      blocks: [
        { h: "Ce que nous collectons", body: "Lorsque vous utilisez le formulaire de contact ou nous écrivez, nous recevons les informations que vous fournissez (nom, e-mail, entreprise, message). Nous ne les vendons ni ne les partageons." },
        { h: "Pourquoi", body: "Uniquement pour répondre à votre demande et, le cas échéant, travailler ensemble. Nous ne les conservons pas plus longtemps que nécessaire." },
        { h: "Mesure d'audience", body: "Nous utilisons une mesure d'audience respectueuse de la vie privée, sans cookies, pour comprendre le trafic de façon agrégée. Aucun traceur publicitaire, aucun profilage." },
        { h: "Vos droits", body: `Conformément au RGPD, vous pouvez à tout moment demander l'accès, la rectification ou la suppression de vos données — écrivez simplement à ${EMAIL}.` },
        { h: "Réservations", body: "La prise de rendez-vous passe par Calendly, qui traite vos informations de réservation selon sa propre politique de confidentialité." },
      ],
    },
  },
};

export function LegalView({ type }: { type: "legal" | "privacy" }) {
  const { lang } = useLang();
  const doc = content[type][lang];

  return (
    <>
      <CursorLight />
      <Navbar />
      <main id="top" className="min-h-screen bg-ink">
        <section className="pt-40 pb-24 md:pt-48 md:pb-28">
          <div className="mx-auto w-full max-w-[760px] px-5 sm:px-8">
            <h1 className="kl-h1 mb-3">{doc.title}</h1>
            <p className="kl-eyebrow mb-16">{doc.updated}</p>
            <div className="space-y-12">
              {doc.blocks.map((b) => (
                <div key={b.h} className="pt-7 border-t border-[rgba(244,241,233,0.12)]">
                  <h2 className="kl-h3 text-light mb-4">{b.h}</h2>
                  <p className="kl-body">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
