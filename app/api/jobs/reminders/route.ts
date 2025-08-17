import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendMail } from '@/lib/mail'
const toUTC=(dateStr:string,timeStr:string)=>{const [Y,M,D]=dateStr.split('-').map(Number);const [h,m]=timeStr.split(':').map(Number);return new Date(Date.UTC(Y,M-1,D,h,m))}
export async function POST(){
  const now=new Date()
  const rows=await prisma.reservation.findMany({where:{status:'CONFIRMED'}})
  for(const r of rows){
    const dateStr=r.date.toISOString().slice(0,10)
    const when=toUTC(dateStr,r.time)
    const diffMin=Math.floor((when.getTime()-now.getTime())/60000)
    if(diffMin===1440||diffMin===120){
      await sendMail(r.email,'Podsetnik za termin - MJ Studio',`<p>Podsetnik: ${dateStr} u ${r.time} — ${r.service.toLowerCase()}.</p>`)
    }
  }
  return NextResponse.json({ok:true})
}
