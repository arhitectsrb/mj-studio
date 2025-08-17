import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '../_guard'
import { sendMail } from '@/lib/mail'
export async function POST(req: Request){
  try{requireAdmin()}catch{ return NextResponse.json({error:'unauth'},{status:401}) }
  const {id}=await req.json()
  const res=await prisma.reservation.update({where:{id},data:{status:'REJECTED'}})
  await sendMail(res.email,'Termin nije potvrđen - MJ Studio',`<p>Nažalost termin nije moguće potvrditi. Molimo izaberite drugi datum/vreme.</p>`)
  return NextResponse.json({ok:true})
}
