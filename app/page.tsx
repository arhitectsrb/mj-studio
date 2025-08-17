'use client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [service,setService]=useState('')
  const [date,setDate]=useState('')
  const [slots,setSlots]=useState<string[]>([])
  const [form,setForm]=useState({ name:'', email:'', phone:'', time:'' })
  const [msg,setMsg]=useState('')

  useEffect(()=>{
    async function load(){
      setSlots([])
      if(!service || !date) return
      const r = await fetch(`/api/slots?service=${service}&date=${date}`)
      const j = await r.json()
      setSlots(j.slots || [])
    }
    load()
  },[service,date])

  async function submit(e:any){
    e.preventDefault()
    setMsg('')
    if (!form.email) { setMsg('Email je obavezan.'); return }
    const r = await fetch('/api/book',{ method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ...form, service, date }) })
    const j = await r.json()
    if (j.ok) setMsg('Zahtev poslat. Proverite email.')
    else setMsg(j.error || 'Greška')
  }

  return (
  <main style={{fontFamily:'Inter, Arial', background:'#f8f8fb', minHeight:'100vh'}}>
    <div style={{color:'#fff', textAlign:'center', padding:'56px 16px',
      background: `linear-gradient(180deg, rgba(0,0,0,.45), rgba(0,0,0,.45)), url('/hero.jpg') center/cover no-repeat`}}>
      <h1 style={{margin:0,fontSize:28}}>MJ Studio — Rezervacija</h1>
      <p>Uto–Ned · 11–19h</p>
    </div>

    <div style={{maxWidth:520, margin:'-36px auto 24px', background:'#fff', padding:20, borderRadius:12, boxShadow:'0 10px 25px rgba(0,0,0,.08)'}}>
      <form onSubmit={submit}>
        <label>Ime i prezime</label>
        <input required value={form.name} onChange={e=>setForm({...form, name:e.target.value})} style={inp}/>

        <label>Email *</label>
        <input type="email" required value={form.email} onChange={e=>setForm({...form, email:e.target.value})} style={inp}/>
        <div style={{fontSize:12,color:'#666',marginTop:4}}>* Email je obavezan zbog potvrde i podsetnika.</div>

        <label>Telefon</label>
        <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} style={inp}/>

        <label>Usluga</label>
        <select required value={service} onChange={e=>setService(e.target.value)} style={inp}>
          <option value="">— izaberi —</option>
          <option value="NOKTI">Nokti (2h)</option>
          <option value="SMINKA">Šminka (1h)</option>
        </select>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <div>
            <label>Datum</label>
            <input type="date" required value={date} onChange={e=>setDate(e.target.value)} style={inp}/>
          </div>
          <div>
            <label>Vreme</label>
            <select required value={form.time} onChange={e=>setForm({...form, time:e.target.value})}
              disabled={!slots.length} style={inp}>
              <option value="">{slots.length? '— izaberi —' : 'nema dostupnih'}</option>
              {slots.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {msg && <div style={{marginTop:10,color:'#333'}}>{msg}</div>}
        <button type="submit" style={{...inp, background:'#111', color:'#fff', cursor:'pointer', border:'none', fontWeight:600}}>
          Pošalji zahtev
        </button>
        <div style={{fontSize:12,color:'#666',marginTop:6}}>Termin se blokira odmah po slanju; salon potvrđuje ručno.</div>
      </form>
    </div>
  </main>
  )
}
const inp: React.CSSProperties = { width:'100%', padding:'12px 14px', marginTop:6, border:'1px solid #e6e6e6', borderRadius:10 }
