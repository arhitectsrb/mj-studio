import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '../_guard'
export async function GET(){
  try{requireAdmin()}catch{ return NextResponse.json({error:'unauth'},{status:401}) }
  const rows=await prisma.reservation.findMany({orderBy:[{date:'asc'},{time:'asc'}]})
  return NextResponse.json({rows})
}
