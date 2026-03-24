"use client";

import { useState, useEffect } from "react";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState<any | null>(null);
  const [cityInput, setCityInput] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  type FormErrors = {
      title?: string;
      price?: string;
      description?: string;
      city?: string;
  };

  const [errors, setErrors] = useState<FormErrors>({});

  async function fetchProperties() {
    const res = await fetch("/api/properties");
    const data = await res.json();
    setProperties(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (editingProperty) {
      setSelectedType(editingProperty.type ?? "");
      setCityInput(editingProperty.city ?? "");
    } else {
      setSelectedType("");
      setCityInput("");
    }
  }, [editingProperty]);

  async function fetchCitySuggestions(query: string) {
    if (query.trim().length < 3) {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
      return;
    }

    try {
      const res = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
          query
        )}&boost=population&limit=5&fields=nom,code,codesPostaux,departement`
      );

      const data = await res.json();
      setCitySuggestions(data);
      setShowCitySuggestions(true);
    } catch (error) {
      console.error("Erreur autocomplete ville:", error);
      setCitySuggestions([]);
      setShowCitySuggestions(false);
    }
  }

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
    city: cityInput,
    heatingType: fd.get("heatingType"),
    kitchenType: fd.get("kitchenType"),
    elevator: fd.get("elevator") === "true",
    bathrooms: fd.get("bathrooms"),
    toilets: fd.get("toilets"),
    yearBuilt: fd.get("yearBuilt"),
    condition: fd.get("condition"),
  };

  if (payload.type === "TERRAIN") {
    delete payload.heatingType;
    delete payload.kitchenType;
    delete payload.elevator;
    delete payload.bathrooms;
    delete payload.toilets;
    delete payload.yearBuilt;
    delete payload.condition;
  }

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
    setCityInput("");
    setCitySuggestions([]);
    setShowCitySuggestions(false);
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
        onChange={(e) => {
          const value = e.target.value;
          setErrors((prev) => ({
            ...prev,
            title:
              value.trim().length < 3
                ? "Le titre doit contenir au moins 3 caractères."
                : undefined,
          }));
        }}
      />

      {errors.title && (
        <p style={{ color: "red", fontSize: 14 }}>{errors.title}</p>
      )}


      <select
          name="type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border rounded px-3 py-2"
      >
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
        onChange={(e) => {
          const value = e.target.value;
          setErrors((prev) => ({
            ...prev,
            price:
              value.trim().length < 5
                ? "Le prix ne semble pas correct."
                : undefined,
          }));
        }}
      />

      {errors.price && (
        <p style={{ color: "red", fontSize: 14 }}>{errors.price}</p>
      )}


      <input
        name="surfaceM2"
        type="number"
        placeholder="surfaceM2"
        defaultValue={editingProperty?.surfaceM2 ?? ""}
      />

      {selectedType !== "TERRAIN" && (
      <input
        name="rooms"
        type="number"
        placeholder="rooms"
        defaultValue={editingProperty?.rooms ?? ""}
      />
      )}

      <div style={{ position: "relative" }}>
        <input
          name="city"
          placeholder="Ville"
          value={cityInput}
          onChange={async (e) => {
            const value = e.target.value;
            setCityInput(value);
            await fetchCitySuggestions(value);
          }}
          onFocus={() => {
            if (citySuggestions.length > 0) setShowCitySuggestions(true);
          }}
          required
        />

        {showCitySuggestions && citySuggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 10,
              background: "white",
              border: "1px solid #ddd",
              borderRadius: 8,
              marginTop: 4,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            {citySuggestions.map((city) => (
              <button
                key={city.code}
                type="button"
                onClick={() => {
                  setCityInput(city.nom);
                  setCitySuggestions([]);
                  setShowCitySuggestions(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  border: "none",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 600 }}>{city.nom}</div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {city.departement?.nom ?? ""}
                  {city.codesPostaux?.length ? ` — ${city.codesPostaux[0]}` : ""}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedType !== "TERRAIN" && (
        <select name="heatingType" className="border rounded px-3 py-2">
          <option value="">Chauffage</option>
          <option value="GAZ">Gaz</option>
          <option value="ELECTRIQUE">Electrique</option>
          <option value="POMPE_A_CHALEUR">Pompe à chaleur</option>
          <option value="FIOUL">Fioul</option>
          <option value="BOIS">Bois</option>
        </select>
      )}

      {selectedType !== "TERRAIN" && (
        <select name="kitchenType" className="border rounded px-3 py-2">
          <option value="">Cuisine</option>
          <option value="EQUIPEE">Equipée</option>
          <option value="AMENAGEE">Aménagée</option>
          <option value="AMERICAINE">Américaine</option>
          <option value="SEPAREE">Séparée</option>
        </select>
       )}

      {selectedType !== "TERRAIN" && (
        <select name="elevator" className="border rounded px-3 py-2">
          <option value="">Ascenseur</option>
          <option value="true">Oui</option>
          <option value="false">Non</option>
        </select>
      )}

      {selectedType !== "TERRAIN" && (
        <input
          name="bathrooms"
          type="number"
          placeholder="bathrooms"
          defaultValue={editingProperty?.bathrooms ?? ""}
        />
      )}

      {selectedType !== "TERRAIN" && (
        <input
          name="toilets"
          type="number"
          placeholder="toilets"
          defaultValue={editingProperty?.toilets ?? ""}
        />
      )}

      {selectedType !== "TERRAIN" && (
        <input
          name="yearBuilt"
          type="number"
          placeholder="yearBuilt"
          defaultValue={editingProperty?.yearBuilt ?? ""}
        />
      )}

      {selectedType !== "TERRAIN" && (
        <select name="condition" defaultValue={editingProperty?.condition ?? ""}>
          <option value="">État</option>
          <option value="NEUF">Neuf</option>
          <option value="EXCELLENT">Excellent</option>
          <option value="BON">Bon</option>
          <option value="A_RENOVER">À rénover</option>
        </select>
      )}

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
