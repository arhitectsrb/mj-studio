import { Resend } from 'resend'

const resendKey = process.env.MY_RESEND_KEY
const fromAddr  = process.env.MY_MAIL_FROM || 'MJ Studio <onboarding@resend.dev>'

export async function sendMail(to: string, subject: string, html: string) {
  if (!resendKey) {
    console.error('[MAIL] MY_RESEND_KEY not set')
    return
  }
  const resend = new Resend(resendKey)
  try {
    const res = await resend.emails.send({ from: fromAddr, to, subject, html })
    console.log('[MAIL] Sent:', res?.id || res)
  } catch (err: any) {
    console.error('[MAIL] Error:', err?.message || err)
  }
}
