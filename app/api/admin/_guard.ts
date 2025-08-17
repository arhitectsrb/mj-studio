import { cookies } from 'next/headers'
export function requireAdmin(){const v=cookies().get('admin')?.value; if(v!=='1') throw new Error('unauth')}
