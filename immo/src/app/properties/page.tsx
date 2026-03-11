import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Filters from "./filters";

const typeLabels: Record<string, string> = {
  APPARTEMENT: "Appartement",
  MAISON: "Maison",
  TERRAIN: "Terrain",
  LOCAL_COMMERCIAL: "Local commercial",
  BUREAU: "Bureau",
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    city?: string;
    type?: string;
    maxPrice?: string;
  }>;
}) {
  const params = await searchParams;

  const city = params.city?.trim();
  const type = params.type?.trim();
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const properties = await prisma.property.findMany({
    where: {
      ...(city
        ? {
            city: {
              contains: city,
              mode: "insensitive",
            },
          }
        : {}),
      ...(type ? { type: type as any } : {}),
      ...(maxPrice && !Number.isNaN(maxPrice)
        ? {
            price: {
              lte: maxPrice,
            },
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
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

      <Filters />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <Link
            key={p.id}
            href={`/properties/${p.id}`}
            className="rounded-xl border border-gray-200 p-4 transition hover:shadow-sm"
          >
            <div className="text-lg font-semibold line-clamp-2">{p.title}</div>

            <div className="mt-2 text-sm text-gray-600">{p.city}</div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {p.type ? (
                <span className="rounded-full bg-gray-100 px-3 py-1">
                  {typeLabels[String(p.type)] ?? String(p.type)}
                </span>
              ) : null}

              {p.surfaceM2 != null ? (
                <span className="rounded-full bg-gray-100 px-3 py-1">
                  {p.surfaceM2} m²
                </span>
              ) : null}

              {typeof p.rooms === "number" ? (
                <span className="rounded-full bg-gray-100 px-3 py-1">
                  {p.rooms} pièces
                </span>
              ) : null}
            </div>

            <div className="mt-4 text-xl font-bold">
              {p.price.toLocaleString("fr-FR")} €
            </div>
          </Link>
        ))}
      </div>

      {properties.length === 0 && (
        <p className="mt-10 text-gray-600">
          Aucun bien ne correspond à votre recherche.
        </p>
      )}
    </main>
  );
}