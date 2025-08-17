import { Resend } from 'resend'

// koristimo nerezerivisana imena
const resendKey = process.env.MY_RESEND_KEY
const fromAddr  = process.env.MY_MAIL_FROM || 'MJ Studio <miksi1996@gmail.com>'

export async function sendMail(to: string, subject: string, html: string) {
  if (!resendKey) {
    console.warn('MY_RESEND_KEY not set; skipping email to', to, subject)
    return
  }
  const resend = new Resend(resendKey)
  await resend.emails.send({ from: fromAddr, to, subject, html })
}
