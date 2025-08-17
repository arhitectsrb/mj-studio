# MJ Studio (Next.js + Prisma + Neon + Resend)
## Lokalno
npm i
npx prisma generate
npx prisma migrate dev
npm run dev

## Vercel
Set ENV: DATABASE_URL, RESEND_API_KEY, MAIL_FROM, ADMIN_PASSWORD, TZ=Europe/Vienna
Cron: POST /api/jobs/reminders
