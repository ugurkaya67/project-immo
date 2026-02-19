"use client";

import { useState, useEffect } from "react";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState<any | null>(null);

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

  const url = editingProperty
    ? `/api/properties/${editingProperty.id}`
    : "/api/properties";

  const method = editingProperty ? "PATCH" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    setEditingProperty(null);
    form.reset();
    await fetchProperties();
  } else {
    const data = await res.json().catch(() => ({}));
    alert(data?.error ?? "Erreur");
  }
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Biens (Admin)</h1>

      {/* Formulaire */}
      <form
        key={editingProperty?.id ?? "new"}
        onSubmit={handleSubmit}
        style={{ marginTop: 20, display: "grid", gap: 10 }}
      >
      <input
        name="title"
        placeholder="Titre"
        defaultValue={editingProperty?.title ?? ""}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        defaultValue={editingProperty?.description ?? ""}
        required
      />

      <input
        name="price"
        type="number"
        placeholder="Prix"
        defaultValue={editingProperty?.price ?? ""}
        required
      />

      <input
        name="surfaceM2"
        type="number"
        placeholder="surfaceM2"
        defaultValue={editingProperty?.surfaceM2 ?? ""}
      />

      <input
        name="rooms"
        type="number"
        placeholder="rooms"
        defaultValue={editingProperty?.rooms ?? ""}
      />

      <input
        name="city"
        placeholder="Ville"
        defaultValue={editingProperty?.city ?? ""}
        required
      />

      <button type="submit">
        {editingProperty ? "Enregistrer les modifications" : "Créer le bien"}
      </button>
      {editingProperty && (
        <button
          type="button"
          onClick={() => setEditingProperty(null)}
        >
          Annuler
        </button>
      )}
      </form>

      {/* Liste */}
      <div style={{ marginTop: 30, display: "grid", gap: 12 }}>
        {loading && <p>Chargement...</p>}

      {properties.map((p) => (
        <div
          key={p.id}
          style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10 }}
        >
          <div style={{ fontWeight: 700 }}>{p.title}</div>
          <div>{p.city} — {p.price} €</div>

          <button
            style={{ marginTop: 10, marginRight: 10 }}
            onClick={() => setEditingProperty(p)}
          >
            Modifier
          </button>

          <button
            style={{ marginTop: 10 }}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition"
            onClick={async () => {
              if (!confirm("Supprimer ce bien ?")) return;

              const res = await fetch(`/api/properties/${p.id}`, {
                method: "DELETE",
              });

              if (res.ok) {
                fetchProperties();
              } else {
                const data = await res.json().catch(() => ({}));
                alert(data?.error ?? "Erreur suppression");
              }
            }}
          >
            Supprimer
          </button>
        </div>
      ))}

        {!loading && properties.length === 0 && <p>Aucun bien pour l’instant.</p>}
      </div>
    </div>
  );
}
