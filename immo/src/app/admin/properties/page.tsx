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

  const form = e.currentTarget;
  const fd = new FormData(form);
  
  const surfaceM2Raw = String(fd.get("surfaceM2") ?? "").trim();
  const roomsRaw = String(fd.get("rooms") ?? "").trim();

  const payload: any = {
    title: fd.get("title"),
    type: fd.get("type"),
    description: fd.get("description"),
    price: fd.get("price"),
    city: fd.get("city"),
    heatingType: fd.get("heatingType"),
    kitchenType: fd.get("kitchenType"),
    elevator: fd.get("elevator") === "true",
    bathrooms: fd.get("bathrooms"),
    toilets: fd.get("toilets"),
    yearBuilt: fd.get("yearBuilt"),
    condition: fd.get("condition"),
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

      <select name="type" className="border rounded px-3 py-2">
        <option value="">Type</option>
        <option value="APPARTEMENT">Appartement</option>
        <option value="MAISON">Maison</option>
        <option value="TERRAIN">Terrain</option>
        <option value="LOCAL_COMMERCIAL">Local commercial</option>
      </select>

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

      <select name="heatingType" className="border rounded px-3 py-2">
        <option value="">Chauffage</option>
        <option value="GAZ">Gaz</option>
        <option value="ELECTRIQUE">Electrique</option>
        <option value="POMPE_A_CHALEUR">Pompe à chaleur</option>
        <option value="FIOUL">Fioul</option>
        <option value="BOIS">Bois</option>
      </select>

      <select name="kitchenType" className="border rounded px-3 py-2">
        <option value="">Cuisine</option>
        <option value="EQUIPEE">Equipée</option>
        <option value="AMENAGEE">Aménagée</option>
        <option value="AMERICAINE">Américaine</option>
        <option value="SEPAREE">Séparée</option>
      </select>

      <select name="elevator" className="border rounded px-3 py-2">
        <option value="">Ascenseur</option>
        <option value="true">Oui</option>
        <option value="false">Non</option>
      </select>
      
      <input
        name="bathrooms"
        type="number"
        placeholder="bathrooms"
        defaultValue={editingProperty?.bathrooms ?? ""}
      />

      <input
        name="toilets"
        type="number"
        placeholder="toilets"
        defaultValue={editingProperty?.toilets ?? ""}
      />

      <input
        name="yearBuilt"
        type="number"
        placeholder="yearBuilt"
        defaultValue={editingProperty?.yearBuilt ?? ""}
      />

      <select name="condition" defaultValue={editingProperty?.condition ?? ""}>
        <option value="">État</option>
        <option value="NEUF">Neuf</option>
        <option value="EXCELLENT">Excellent</option>
        <option value="BON">Bon</option>
        <option value="A_RENOVER">À rénover</option>
      </select>

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
