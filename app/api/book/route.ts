import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAvailableSlots } from '@/lib/slots'
import { sendMail } from '@/lib/mail'
import { Service } from '@prisma/client'
export async function POST(req: Request){
  const {name,email,phone,service,date,time}=await req.json()
  if(!name||!email||!service||!date||!time) return NextResponse.json({error:'Missing'},{status:400})
  const svc=String(service).toUpperCase(); if(!['NOKTI','SMINKA'].includes(svc)) return NextResponse.json({error:'Bad service'},{status:400})
  const slots=await getAvailableSlots(date, svc as Service); if(!slots.includes(time)) return NextResponse.json({error:'Slot taken'},{status:409})
  await prisma.reservation.create({data:{customerName:name,email,phone,service:svc as Service,date:new Date(date),time,status:'PENDING'}})
  await sendMail(email,'Vaš zahtev je primljen - MJ Studio',`<p>Poštovani/na ${name},</p><p>Primili smo vaš zahtev za <b>${svc.toLowerCase()}</b> ${date} u ${time}.<br>Salon će ručno potvrditi ili predložiti drugi termin.</p>`)
  return NextResponse.json({ok:true})
}
