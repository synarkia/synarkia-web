"use client";

import { useState } from "react";
import { Calendar, Mail, Linkedin, ArrowRight, Send, Check } from "lucide-react";
import { useLang } from "@/i18n/language-provider";

const BOOKING_URL = "https://calendly.com/leizagato/clarity-call-1";
const EMAIL = "connect@synarkia.com";

export function Contact() {
  const { t } = useLang();
  const c = t.contact;
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", message: "" });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`New enquiry — ${form.service || "Syndao"} — ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nService: ${form.service}\n\n${form.message}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" className="relative py-28 md:py-40 overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] kl-glow opacity-50" />

      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <span className="kl-eyebrow">{c.eyebrow}</span>
          <h2 className="kl-h1 mt-6 mb-6">{c.h}</h2>
          <p className="kl-body max-w-xl mx-auto">{c.intro}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* LEFT — booking + direct */}
          <div className="space-y-6">
            <div className="kl-card p-8 md:p-10">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-light" strokeWidth={1.4} />
                <h3 className="kl-h3 text-light">{c.bookTitle}</h3>
              </div>
              <p className="kl-body mb-8">{c.bookDesc}</p>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="kl-cta-solid w-full">
                {c.schedule} <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div>
              <p className="kl-eyebrow mb-4">{c.direct}</p>
              <div className="space-y-3">
                <a href={`mailto:${EMAIL}`} className="kl-card flex items-center gap-4 p-5 group">
                  <span className="flex items-center justify-center w-11 h-11 rounded-full border border-[rgba(244,241,233,0.12)] group-hover:border-[rgba(244,241,233,0.3)] transition-colors">
                    <Mail className="w-4 h-4 text-ash group-hover:text-light transition-colors" strokeWidth={1.4} />
                  </span>
                  <span>
                    <span className="kl-eyebrow block mb-1">{c.emailLabel}</span>
                    <span className="kl-body text-light">{EMAIL}</span>
                  </span>
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="kl-card flex items-center gap-4 p-5 group">
                  <span className="flex items-center justify-center w-11 h-11 rounded-full border border-[rgba(244,241,233,0.12)] group-hover:border-[rgba(244,241,233,0.3)] transition-colors">
                    <Linkedin className="w-4 h-4 text-ash group-hover:text-light transition-colors" strokeWidth={1.4} />
                  </span>
                  <span>
                    <span className="kl-eyebrow block mb-1">{c.linkedinLabel}</span>
                    <span className="kl-body text-light">{c.linkedinValue}</span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT — message form */}
          <div className="kl-card p-8 md:p-10">
            <h3 className="kl-h3 text-light mb-2">{c.formTitle}</h3>
            <p className="kl-body-sm mb-8">{c.formDesc}</p>

            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <span className="flex items-center justify-center w-14 h-14 rounded-full border border-[rgba(244,241,233,0.3)] mb-6 kl-breathe">
                  <Check className="w-6 h-6 text-light" strokeWidth={1.4} />
                </span>
                <p className="kl-h3 text-light mb-2">{c.sentTitle}</p>
                <p className="kl-body-sm max-w-xs">
                  {c.sentBody} {EMAIL}.{" "}
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-light underline underline-offset-4">{c.sentBook}</a>
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label={c.fName}>
                    <input required value={form.name} onChange={update("name")} placeholder={c.fNameP} className="kl-field w-full px-4 py-3 text-[15px]" />
                  </Field>
                  <Field label={c.fEmail}>
                    <input required type="email" value={form.email} onChange={update("email")} placeholder={c.fEmailP} className="kl-field w-full px-4 py-3 text-[15px]" />
                  </Field>
                </div>
                <Field label={c.fCompany}>
                  <input value={form.company} onChange={update("company")} placeholder={c.fCompanyP} className="kl-field w-full px-4 py-3 text-[15px]" />
                </Field>
                <Field label={c.fService}>
                  <div className="relative">
                    <select value={form.service} onChange={update("service")} className="kl-field w-full px-4 py-3 text-[15px] appearance-none cursor-pointer">
                      <option value="" className="bg-graphite">{c.fServiceP}</option>
                      {c.services.map((s) => (
                        <option key={s} value={s} className="bg-graphite">{s}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-smoke">▾</span>
                  </div>
                </Field>
                <Field label={c.fMessage}>
                  <textarea required rows={4} value={form.message} onChange={update("message")} placeholder={c.fMessageP} className="kl-field w-full px-4 py-3 text-[15px] resize-none" />
                </Field>
                <button type="submit" className="kl-cta-solid w-full">
                  {c.send} <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="kl-eyebrow block mb-2.5">{label}</span>
      {children}
    </label>
  );
}
