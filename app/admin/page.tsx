"use client";

import { useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  async function handleLogin() {
    setError("");
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!r.ok) {
        setError("Pogrešna lozinka");
        return;
      }
      setLoggedIn(true);
    } catch (e) {
      setError("Greška pri prijavi, pokušaj ponovo.");
    }
  }

  if (!loggedIn) {
    return (
      <div style={{maxWidth:420, margin:"80px auto", fontFamily:"Inter, Arial"}}>
        <h1 style={{fontSize:24, marginBottom:12}}>Admin prijava</h1>
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{width:"100%", padding:12, border:"1px solid #ddd", borderRadius:8}}
        />
        <button
          onClick={handleLogin}
          style={{marginTop:10, padding:"12px 16px", borderRadius:8, border:"none", background:"#111", color:"#fff", cursor:"pointer", fontWeight:600}}
        >
          Prijavi se
        </button>
        {error && <div style={{color:"#c00", marginTop:8}}>{error}</div>}
        <p style={{fontSize:12, color:"#666", marginTop:8}}>
          Saveti: proveri da je MY_ADMIN_PASS postavljen na Vercel-u i da je redeploy urađen.
        </p>
      </div>
    );
  }

  return (
    <div style={{maxWidth:960, margin:"40px auto", fontFamily:"Inter, Arial"}}>
      <h1 style={{fontSize:24, marginBottom:12}}>Admin panel</h1>
      <p>Uspešno si prijavljen. (Sledeći korak: prikaz i potvrda rezervacija.)</p>
      <p>
        Ako želiš, mogu odmah dodati listanje termina iz baze i dugmad{" "}
        <b>Potvrdi / Odbij</b>.
      </p>
    </div>
  );
}
