"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  function applyFilters() {
    const params = new URLSearchParams();

    if (city.trim()) params.set("city", city.trim());
    if (type.trim()) params.set("type", type.trim());
    if (maxPrice.trim()) params.set("maxPrice", maxPrice.trim());

    router.push(`/properties?${params.toString()}`);
  }

  function resetFilters() {
    setCity("");
    setType("");
    setMaxPrice("");
    router.push("/properties");
  }

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-4">
        <input
          type="text"
          placeholder="Ville"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="">Type de bien</option>
          <option value="APPARTEMENT">Appartement</option>
          <option value="MAISON">Maison</option>
          <option value="TERRAIN">Terrain</option>
          <option value="LOCAL_COMMERCIAL">Local commercial</option>
          <option value="BUREAU">Bureau</option>
        </select>

        <input
          type="number"
          placeholder="Prix max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={applyFilters}
            className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-900"
          >
            Filtrer
          </button>

          <button
            type="button"
            onClick={resetFilters}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}