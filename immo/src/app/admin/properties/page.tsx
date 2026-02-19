"use client";

import { useState, useEffect } from "react";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProperties() {
    const res = await fetch("/api/properties");
    const data = await res.json();
    setProperties(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const form = e.currentTarget; // <-- on capture avant le await
  const fd = new FormData(form);

  const surfaceM2Raw = String(fd.get("surfaceM2") ?? "").trim();
  const roomsRaw = String(fd.get("rooms") ?? "").trim();

  const payload: any = {
    title: fd.get("title"),
    description: fd.get("description"),
    price: fd.get("price"),
    city: fd.get("city"),
  };

  if (surfaceM2Raw !== "") payload.surfaceM2 = surfaceM2Raw;
  if (roomsRaw !== "") payload.rooms = roomsRaw;

  const res = await fetch("/api/properties", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    form.reset(); // ✅ plus de null
    await fetchProperties();
  } else {
    const data = await res.json().catch(() => ({}));
    alert(data?.error ?? "Erreur lors de la création");
  }
}

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Biens (Admin)</h1>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} style={{ marginTop: 20, display: "grid", gap: 10 }}>
        <input name="title" placeholder="Titre" required />
        <textarea name="description" placeholder="Description" required />
        <input name="price" type="number" placeholder="Prix" required />
        <input name="surfaceM2" type="number" placeholder="surfaceM2" required />
        <input name="rooms" type="number" placeholder="rooms" required />
        <input name="city" placeholder="Ville" required />
        <button type="submit">Créer le bien</button>
      </form>

      {/* Liste */}
      <div style={{ marginTop: 30, display: "grid", gap: 12 }}>
        {loading && <p>Chargement...</p>}

        {properties.map((p) => (
          <div key={p.id} style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
            <div style={{ fontWeight: 700 }}>{p.title}</div>
            <div>{p.city} — {p.price} €</div>
          </div>
        ))}

        {!loading && properties.length === 0 && <p>Aucun bien pour l’instant.</p>}
      </div>
    </div>
  );
}
