import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const { password } = await req.json()
  const adminPass = process.env.MY_ADMIN_PASS
  if (!adminPass || password !== adminPass) {
    return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  }
  cookies().set('admin', '1', { httpOnly: true, sameSite: 'lax', secure: true, path: '/' })
  return NextResponse.json({ ok:true })
}
