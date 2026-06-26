import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ ok: false, error: "Email is not configured." }, { status: 500 });
  }
  const TO = process.env.CONTACT_TO || "connect@synarkia.com";
  // Resend test sender works without domain verification (delivers to your own
  // account email). Swap to a verified-domain address once syndao.com is set up.
  const FROM = process.env.CONTACT_FROM || "Syndao <onboarding@resend.dev>";

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { name, email, company, service, message, website } = body;

  // honeypot — bots fill this hidden field; drop silently
  if (website) return Response.json({ ok: true });

  if (!name || !email || !message) {
    return Response.json({ ok: false, error: "Please fill in your name, email, and message." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111;line-height:1.6">
      <h2 style="margin:0 0 16px">New enquiry — Syndao</h2>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 16px 4px 0;color:#666">Name</td><td><strong>${esc(name)}</strong></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#666">Email</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#666">Company</td><td>${esc(company) || "—"}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#666">Service</td><td>${esc(service) || "—"}</td></tr>
      </table>
      <p style="margin:20px 0 6px;color:#666">Message</p>
      <p style="white-space:pre-wrap;margin:0;padding:14px 16px;background:#f6f6f6;border-radius:8px">${esc(message)}</p>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject: `New enquiry — ${service || "Syndao"} — ${name}`,
      html,
    });
    if (error) {
      console.error("Resend error:", error);
      return Response.json({ ok: false, error: "Could not send right now." }, { status: 502 });
    }
    return Response.json({ ok: true, id: data?.id });
  } catch (e) {
    console.error("Contact route error:", e);
    return Response.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}
