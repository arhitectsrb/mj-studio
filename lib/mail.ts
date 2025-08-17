import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY!)
export async function sendMail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) { console.warn('RESEND_API_KEY not set; skipping email'); return }
  await resend.emails.send({
    from: process.env.MAIL_FROM || 'MJ Studio <no-reply@example.com>',
    to, subject, html
  })
}
