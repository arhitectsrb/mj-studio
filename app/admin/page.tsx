"use client";

import { useEffect, useState } from "react";

type Row = {
  id: string;
  customerName: string;
  email: string;
  phone?: string | null;
  service: "NOKTI" | "SMINKA";
  date: string; // ISO od servera
  time: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

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
      load();
    } catch (e) {
      setError("Greška pri prijavi, pokušaj ponovo.");
    }
  }

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/reservations");
      if (!r.ok) throw new Error("unauth");
      const j = await r.json();
      setRows(j.rows || []);
    } catch (e) {
      setError("Sesija je istekla. Osveži stranicu i prijavi se ponovo.");
    } finally {
      setLoading(false);
    }
  }

  async function act(id: string, kind: "confirm" | "reject") {
    const ep = kind === "confirm" ? "/api/admin/confirm" : "/api/admin/reject";
    const r = await fetch(ep, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (r.ok) {
      await load();
    } else {
      alert("Akcija nije uspela.");
    }
  }

  if (!loggedIn) {
    return (
      <div style={{ maxWidth: 420, margin: "80px auto", fontFamily: "Inter, Arial" }}>
        <h1 style={{ fontSize: 24, marginBottom: 12 }}>Admin prijava</h1>
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 12, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button
          onClick={handleLogin}
          style={{
            marginTop: 10,
            padding: "12px 16px",
            borderRadius: 8,
            border: "none",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Prijavi se
        </button>
        {error && <div style={{ color: "#c00", marginTop: 8 }}>{error}</div>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 980, margin: "40px auto", fontFamily: "Inter, Arial", padding: "0 12px" }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Admin panel</h1>
      <button
        onClick={load}
        style={{
          marginBottom: 12,
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #ddd",
          background: "#fafafa",
          cursor: "pointer",
        }}
      >
        Osveži
      </button>

      {loading && <div>Učitavam…</div>}

      {!loading && rows.length === 0 && <div>Nema rezervacija.</div>}

      {!loading && rows.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                <th style={{ padding: 8 }}>Ime</th>
                <th style={{ padding: 8 }}>Email</th>
                <th style={{ padding: 8 }}>Telefon</th>
                <th style={{ padding: 8 }}>Usluga</th>
                <th style={{ padding: 8 }}>Datum</th>
                <th style={{ padding: 8 }}>Vreme</th>
                <th style={{ padding: 8 }}>Status</th>
                <th style={{ padding: 8 }}>Akcija</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const dateStr = new Date(r.date).toISOString().slice(0, 10);
                return (
                  <tr key={r.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: 8 }}>{r.customerName}</td>
                    <td style={{ padding: 8 }}>{r.email}</td>
                    <td style={{ padding: 8 }}>{r.phone || "—"}</td>
                    <td style={{ padding: 8 }}>{r.service === "NOKTI" ? "Nokti" : "Šminka"}</td>
                    <td style={{ padding: 8 }}>{dateStr}</td>
                    <td style={{ padding: 8 }}>{r.time}</td>
                    <td style={{ padding: 8 }}>
                      {r.status === "PENDING" ? "Na čekanju" : r.status === "CONFIRMED" ? "Potvrđeno" : "Odbijeno"}
                    </td>
                    <td style={{ padding: 8, whiteSpace: "nowrap" }}>
                      {r.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => act(r.id, "confirm")}
                            style={{
                              padding: "6px 10px",
                              marginRight: 6,
                              border: "none",
                              borderRadius: 6,
                              background: "#0a7",
                              color: "#fff",
                              cursor: "pointer",
                            }}
                          >
                            Potvrdi
                          </button>
                          <button
                            onClick={() => act(r.id, "reject")}
                            style={{
                              padding: "6px 10px",
                              border: "none",
                              borderRadius: 6,
                              background: "#d33",
                              color: "#fff",
                              cursor: "pointer",
                            }}
                          >
                            Odbij
                          </button>
                        </>
                      )}
                      {r.status !== "PENDING" && <span>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
