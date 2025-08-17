import { prisma } from '@/lib/db'
import { Service } from '@prisma/client'
const OPEN='11:00', CLOSE='19:00'
const LAST_START:Record<Service,string>={NOKTI:'17:00',SMINKA:'18:00'}
const DURATION:Record<Service,number>={NOKTI:120,SMINKA:60}
const toMinutes=(t:string)=>{const [h,m]=t.split(':').map(Number);return h*60+m}
const toHHMM=(n:number)=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`
const overlaps=(aS:number,aE:number,bS:number,bE:number)=>aS<bE && aE>bS
export async function getAvailableSlots(dateISO:string, service:Service){
  const d=new Date(`${dateISO}T00:00:00Z`); const day=d.getUTCDay()===0?7:d.getUTCDay(); if(day===1)return []
  const open=toMinutes(OPEN), close=toMinutes(CLOSE), last=toMinutes(LAST_START[service]), dur=DURATION[service], step=15
  const reservations=await prisma.reservation.findMany({where:{date:new Date(dateISO),status:{in:['PENDING','CONFIRMED']}},select:{time:true,service:true}})
  const blocks=await prisma.specialBlock.findMany({where:{blockDate:new Date(dateISO)},select:{startTime:true,endTime:true}})
  const taken:[number,number][]=[]
  for(const r of reservations){const s=toMinutes(r.time); taken.push([s,s+(DURATION[r.service]||dur)])}
  for(const b of blocks){taken.push([toMinutes(b.startTime),toMinutes(b.endTime)])}
  const out:string[]=[]; for(let s=open;s<=last;s+=step){const e=s+dur; if(e>close)continue; let busy=false; for(const [ts,te] of taken){if(overlaps(s,e,ts,te)){busy=true;break}} if(!busy)out.push(toHHMM(s))}
  return out
}
