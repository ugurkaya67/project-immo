"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin",
    });

    if (res?.error) {
      setError("Identifiants invalides");
      return;
    }

    window.location.href = res?.url ?? "/admin";
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Connexion</h1>

      <form onSubmit={onSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
        <input name="email" type="email" placeholder="Email" required style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
        <input name="password" type="password" placeholder="Mot de passe" required style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
        <button style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}>Se connecter</button>
      </form>

      {error && <p style={{ marginTop: 12, color: "red" }}>❌ {error}</p>}
    </div>
  );
}
