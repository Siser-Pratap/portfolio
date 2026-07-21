import { NextRequest, NextResponse } from "next/server"
import { escapeHtml, getTransporter } from "@/lib/mailer"

export async function POST(req: NextRequest) {
  const transporter = getTransporter()
  try {
    const { name, email, phone, company, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 })
    }

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
