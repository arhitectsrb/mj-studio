import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '../_guard'
import { sendMail } from '@/lib/mail'
export async function POST(req: Request){
  try{requireAdmin()}catch{ return NextResponse.json({error:'unauth'},{status:401}) }
  const {id}=await req.json()
  const res=await prisma.reservation.update({where:{id},data:{status:'CONFIRMED'}})
  const dateStr=res.date.toISOString().slice(0,10)
  await sendMail(res.email,'Termin potvrđen - MJ Studio',`<p>Poštovani/na ${res.customerName},</p><p>Vaš termin je potvrđen: <b>${res.service.toLowerCase()}</b> ${dateStr} u ${res.time}.</p>`)
  return NextResponse.json({ok:true})
}
