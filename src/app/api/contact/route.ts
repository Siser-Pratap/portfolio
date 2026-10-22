import { NextRequest, NextResponse } from "next/server"
import { escapeHtml, getTransporter } from "@/lib/mailer"
import { readJson, RequestError } from "@/lib/server/request"
import { contactSchema, verifyContactToken } from "@/lib/server/contact"
import { rateLimit } from "@/lib/server/rate-limit"

export async function POST(req: NextRequest) {
  let input: unknown
  try { input = await readJson(req, 16 * 1024) } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request" }, { status: error instanceof RequestError ? error.status : 400 })
  }
  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) return NextResponse.json({ error: "Invalid contact details" }, { status: 400 })
  if (parsed.data.honeypot) return NextResponse.json({ success: true })
  try {
    const limit = await rateLimit(req.headers, "contact", 3, 60)
    if (!limit.allowed) return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } })
    if (!await verifyContactToken(parsed.data.turnstileToken)) return NextResponse.json({ error: "Please complete the spam check again." }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Contact is temporarily unavailable. Please email me directly." }, { status: 503 })
  }
  const { name, email, phone, company, message } = parsed.data
  try {
    const transporter = getTransporter()

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `Portfolio contact from ${name}${company ? ` @ ${company}` : ""}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "—"}\nCompany: ${company || "—"}\n\n${message}`,
      html: `
        <h2>New contact from your portfolio</h2>
        <table>
          <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${escapeHtml(phone || "—")}</td></tr>
          <tr><td><strong>Company</strong></td><td>${escapeHtml(company || "—")}</td></tr>
        </table>
        <h3>Message</h3>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Contact form error:", err)
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
  }
}

