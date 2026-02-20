import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Params = { id?: string };

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  if (!id) return notFound();

  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/properties"
        className="text-sm text-gray-600 hover:text-gray-900 underline"
      >
        ← Retour aux biens
      </Link>

      <h1 className="mt-4 text-3xl font-bold">{property.title}</h1>
      <div className="mt-2 text-gray-600">{property.city}</div>

      <div className="mt-6 rounded-xl border border-gray-200 p-5">
        <div className="text-2xl font-bold">
          {property.price.toLocaleString("fr-FR")} €
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {property.surfaceM2 ? (
            <span className="rounded-full bg-gray-100 px-3 py-1">
              {property.surfaceM2} m²
            </span>
          ) : null}

          {typeof property.rooms === "number" ? (
            <span className="rounded-full bg-gray-100 px-3 py-1">
              {property.rooms} pièces
            </span>
          ) : null}

          {typeof property.bedrooms === "number" ? (
            <span className="rounded-full bg-gray-100 px-3 py-1">
              {property.bedrooms} chambres
            </span>
          ) : null}
        </div>

        <div className="mt-5 whitespace-pre-wrap text-gray-800">
          {property.description}
        </div>
      </div>
    </main>
  );
}