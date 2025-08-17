import { NextResponse } from 'next/server'
import { getAvailableSlots } from '@/lib/slots'
import { Service } from '@prisma/client'
export async function GET(req: Request){
  const {searchParams}=new URL(req.url)
  const date=searchParams.get('date')||''
  const service=(searchParams.get('service')||'').toUpperCase()
  if(!['NOKTI','SMINKA'].includes(service)) return NextResponse.json({error:'Bad service'},{status:400})
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({error:'Bad date'},{status:400})
  const slots=await getAvailableSlots(date, service as Service)
  return NextResponse.json({slots})
}
