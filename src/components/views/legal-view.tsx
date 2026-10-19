"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CursorLight } from "@/components/ui/cursor-light";
import { useLang } from "@/i18n/language-provider";
import { EMAIL } from "@/lib/links";

type Block = { h: string; body: string };
type Doc = { title: string; updated: string; blocks: Block[] };

const content: Record<"legal" | "privacy" | "terms", { en: Doc; fr: Doc }> = {
  legal: {
    en: {
      title: "Legal notice",
      updated: "Last updated: July 2026",
      blocks: [
        { h: "Publisher", body: "This site is published by Leï Zagato (ZAGATO Alexander, Danny, Leï, Mikhaël), trading as Syndao, a French sole proprietorship (entreprise individuelle) registered with the Alençon Trade and Companies Register (RCS Alençon) under number 822 996 807. Registered address: 20 Route d'Heloup, 61000 Saint-Germain-du-Corbéis, France. VAT: not applicable (Art. 293 B of the French General Tax Code)." },
        { h: "Publication director", body: "Leï Zagato." },
        { h: "Contact", body: `Email: ${EMAIL}.` },
        { h: "Hosting", body: "This site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA (vercel.com)." },
        { h: "Intellectual property", body: "All content on this site (text, visuals, code, identity) is the property of Syndao unless otherwise stated, and may not be reproduced without prior written permission." },
      ],
    },
    fr: {
      title: "Mentions légales",
      updated: "Dernière mise à jour : juillet 2026",
      blocks: [
        { h: "Éditeur", body: "Ce site est édité par Leï Zagato (ZAGATO Alexander, Danny, Leï, Mikhaël), exerçant sous le nom commercial Syndao, entreprise individuelle immatriculée au Registre du Commerce et des Sociétés d'Alençon (RCS Alençon) sous le numéro 822 996 807. Siège : 20 Route d'Heloup, 61000 Saint-Germain-du-Corbéis. TVA non applicable (art. 293 B du Code général des impôts)." },
        { h: "Directeur de la publication", body: "Leï Zagato." },
        { h: "Contact", body: `E-mail : ${EMAIL}.` },
        { h: "Hébergeur", body: "Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA (vercel.com)." },
        { h: "Propriété intellectuelle", body: "L'ensemble des contenus de ce site (textes, visuels, code, identité) est la propriété de Syndao sauf mention contraire, et ne peut être reproduit sans autorisation écrite préalable." },
      ],
    },
  },
  privacy: {
    en: {
      title: "Privacy",
      updated: "Last updated: July 2026",
      blocks: [
        { h: "Data controller", body: "Your data is controlled by Leï Zagato, trading as Syndao (RCS Alençon 822 996 807), 20 Route d'Heloup, 61000 Saint-Germain-du-Corbéis, France." },
        { h: "What we collect", body: "When you use the contact or audit-request form or write to us, we receive the information you provide (name, email, company, message). We do not sell or share it." },
        { h: "Why", body: "Solely to respond to your enquiry, prepare the audit you requested, and, if relevant, to work together. We keep it no longer than necessary." },
        { h: "Analytics", body: "We use privacy-friendly, cookieless analytics to understand traffic in aggregate. No advertising trackers, no personal profiling." },
        { h: "Your rights", body: `Under the GDPR you can request access, correction, or deletion of your data at any time. Just email ${EMAIL}.` },
        { h: "Bookings", body: "Scheduling a call uses Calendly, which processes your booking details under its own privacy policy." },
      ],
    },
    fr: {
      title: "Confidentialité",
      updated: "Dernière mise à jour : juillet 2026",
      blocks: [
        { h: "Responsable du traitement", body: "Vos données sont traitées par Leï Zagato, exerçant sous le nom commercial Syndao (RCS Alençon 822 996 807), 20 Route d'Heloup, 61000 Saint-Germain-du-Corbéis." },
        { h: "Ce que nous collectons", body: "Lorsque vous utilisez le formulaire de contact / demande d'audit ou nous écrivez, nous recevons les informations que vous fournissez (nom, e-mail, entreprise, message). Nous ne les vendons ni ne les partageons." },
        { h: "Pourquoi", body: "Uniquement pour répondre à votre demande, préparer l'audit demandé et, le cas échéant, travailler ensemble. Nous ne les conservons pas plus longtemps que nécessaire." },
        { h: "Mesure d'audience", body: "Nous utilisons une mesure d'audience respectueuse de la vie privée, sans cookies, pour comprendre le trafic de façon agrégée. Aucun traceur publicitaire, aucun profilage." },
        { h: "Vos droits", body: `Conformément au RGPD, vous pouvez à tout moment demander l'accès, la rectification ou la suppression de vos données. Écrivez simplement à ${EMAIL}.` },
        { h: "Réservations", body: "La prise de rendez-vous passe par Calendly, qui traite vos informations de réservation selon sa propre politique de confidentialité." },
      ],
    },
  },
  terms: {
    en: {
      title: "Terms & Conditions",
      updated: "Last updated: July 2026",
      blocks: [
        { h: "Scope", body: "These Terms & Conditions (\"Terms\") govern any engagement with Syndao, the trading name of Leï Zagato (ZAGATO Alexander, Danny, Leï, Mikhaël), a French sole proprietorship registered with the RCS Alençon under number 822 996 807. By requesting a proposal, signing a quote, or using this site, you accept these Terms." },
        { h: "Services", body: "Syndao provides brand strategy, web design and development, internal tools, AI automation, and go-to-market consulting. The exact scope, deliverables, and timeline for each engagement are defined in a written quote or proposal, which forms part of the contract." },
        { h: "Quotes & engagement", body: "Quotes are valid for 30 days unless stated otherwise. Work begins once the quote is accepted and, where applicable, the deposit is received. Any request outside the agreed scope is treated as additional work and quoted separately." },
        { h: "Pricing & payment", body: "Prices are in euros. Unless agreed otherwise, projects are invoiced 50% upfront and 50% on delivery; ongoing engagements are invoiced monthly. Invoices are payable within 15 days. Late payment incurs interest at three times the French legal rate plus a fixed €40 recovery fee, as provided by French law." },
        { h: "Timelines", body: "Delivery dates are estimates and depend on timely feedback, content, and access from the client. Delays caused by the client do not extend Syndao's liability for the original timeline." },
        { h: "Intellectual property", body: "Ownership of deliverables (code, designs, copy) transfers to the client upon full payment. Until then, all work remains the property of Syndao. Syndao retains the right to showcase completed work in its portfolio unless the client requests otherwise in writing." },
        { h: "Liability", body: "Syndao provides services on a best-efforts basis. Syndao is not liable for indirect damages, loss of profit, or outages of third-party platforms (hosting, APIs, payment providers) used in a project." },
        { h: "Cancellation", body: "Either party may end an engagement with 14 days' written notice. Work completed and hours spent up to that point are due. Deposits are non-refundable once work has started." },
        { h: "Confidentiality", body: "Both parties agree to keep confidential information shared during the engagement private, and not to disclose it to third parties without consent." },
        { h: "Governing law", body: "These Terms are governed by French law. In the event of a dispute that cannot be resolved amicably, the competent courts are those with jurisdiction over Alençon, France." },
        { h: "Contact", body: `Questions about these Terms can be sent to ${EMAIL}.` },
      ],
    },
    fr: {
      title: "Conditions générales de vente",
      updated: "Dernière mise à jour : juillet 2026",
      blocks: [
        { h: "Champ d'application", body: "Les présentes conditions générales de vente (« CGV ») régissent toute prestation réalisée par Syndao, nom commercial de Leï Zagato (ZAGATO Alexander, Danny, Leï, Mikhaël), entreprise individuelle immatriculée au RCS d'Alençon sous le numéro 822 996 807. En demandant un devis, en signant une proposition, ou en utilisant ce site, vous acceptez les présentes CGV." },
        { h: "Prestations", body: "Syndao propose du conseil en stratégie de marque, de la conception et du développement web, des outils internes, de l'automatisation IA et du conseil go-to-market. Le périmètre exact, les livrables et le calendrier de chaque mission sont définis dans un devis ou une proposition écrite, qui fait partie intégrante du contrat." },
        { h: "Devis & engagement", body: "Les devis sont valables 30 jours sauf mention contraire. La mission démarre à l'acceptation du devis et, le cas échéant, à la réception de l'acompte. Toute demande hors du périmètre convenu est traitée comme un travail supplémentaire et fait l'objet d'un devis séparé." },
        { h: "Tarifs & paiement", body: "Les prix sont exprimés en euros. Sauf accord contraire, les projets sont facturés 50 % à la commande et 50 % à la livraison ; les missions récurrentes sont facturées mensuellement. Les factures sont payables sous 15 jours. Tout retard de paiement entraîne des pénalités au taux de trois fois le taux d'intérêt légal, ainsi qu'une indemnité forfaitaire de 40 € pour frais de recouvrement, conformément à la loi française." },
        { h: "Délais", body: "Les délais de livraison sont indicatifs et dépendent des retours, contenus et accès fournis à temps par le client. Les retards imputables au client ne prolongent pas la responsabilité de Syndao sur le délai initialement prévu." },
        { h: "Propriété intellectuelle", body: "La propriété des livrables (code, créations, textes) est transférée au client après paiement intégral. Jusqu'à cette date, l'ensemble des travaux reste la propriété de Syndao. Syndao conserve le droit de présenter les réalisations dans son portfolio, sauf demande contraire écrite du client." },
        { h: "Responsabilité", body: "Syndao intervient dans le cadre d'une obligation de moyens. Syndao ne saurait être tenu responsable des dommages indirects, pertes de profit, ou interruptions de plateformes tierces (hébergement, API, prestataires de paiement) utilisées dans un projet." },
        { h: "Résiliation", body: "Chaque partie peut mettre fin à une mission moyennant un préavis écrit de 14 jours. Les travaux réalisés et le temps passé jusqu'à cette date restent dus. Les acomptes ne sont pas remboursables une fois la mission commencée." },
        { h: "Confidentialité", body: "Les deux parties s'engagent à garder confidentielles les informations échangées durant la mission, et à ne pas les divulguer à des tiers sans accord préalable." },
        { h: "Droit applicable", body: "Les présentes CGV sont soumises au droit français. En cas de litige non résolu à l'amiable, les tribunaux compétents seront ceux du ressort d'Alençon." },
        { h: "Contact", body: `Toute question relative à ces CGV peut être adressée à ${EMAIL}.` },
      ],
    },
  },
};

export function LegalView({ type }: { type: "legal" | "privacy" | "terms" }) {
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
