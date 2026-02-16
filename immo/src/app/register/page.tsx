"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(false);

    const fd = new FormData(e.currentTarget);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        password: fd.get("password"),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Erreur");
      return;
    }

    setOk(true);
    e.currentTarget.reset();
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Créer un compte</h1>

      <form onSubmit={onSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
        <input name="name" placeholder="Nom" style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
        <input name="email" type="email" placeholder="Email" required style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
        <input name="password" type="password" placeholder="Mot de passe (min 8)" required style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
        <button style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}>
          S’inscrire
        </button>
      </form>

      {ok && <p style={{ marginTop: 12 }}>✅ Compte créé. Tu peux te connecter sur /login</p>}
      {error && <p style={{ marginTop: 12, color: "red" }}>❌ {error}</p>}
    </div>
  );
}
