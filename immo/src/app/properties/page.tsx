import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Biens immobiliers</h1>
          <p className="mt-2 text-gray-600">
            Découvrez nos dernières annonces.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          Retour accueil
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <Link
            key={p.id}
            href={`/properties/${p.id}`}
            className="rounded-xl border border-gray-200 p-4 hover:shadow-sm transition"
          >
            <div className="text-lg font-semibold line-clamp-2">{p.title}</div>

            <div className="mt-2 text-sm text-gray-600">{p.city}</div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xl font-bold">
                {p.price.toLocaleString("fr-FR")} €
              </div>

              <div className="text-xs text-gray-500">
                {p.surfaceM2 ? `${p.surfaceM2} m²` : "—"}
                {typeof p.rooms === "number" ? ` • ${p.rooms} pièces` : ""}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {properties.length === 0 && (
        <p className="mt-10 text-gray-600">Aucun bien disponible pour le moment.</p>
      )}
    </main>
  );
}