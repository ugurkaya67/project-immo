import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPropertyImage } from "@/lib/property-image";

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


  const subject = encodeURIComponent(
    `Demande d'info — ${property.title} (${property.city})`
  );
  const body = encodeURIComponent(
    `Bonjour,\n\nJe suis intéressé(e) par le bien "${property.title}" à ${property.city}.\nPrix: ${property.price.toLocaleString(
      "fr-FR"
    )} €\nRéférence: ${property.id}\n\nPouvez-vous me recontacter ?\n\nMerci.`
  );

  const typeLabel: Record<string, string> = {
    APPARTEMENT: "Appartement",
    MAISON: "Maison",
    TERRAIN: "Terrain",
    LOCAL_COMMERCIAL: "Local commercial",
    BUREAU: "Bureau",
  };

  const heatingLabel: Record<string, string> = {
    GAZ: "Gaz",
    ELECTRIQUE: "Électrique",
    POMPE_A_CHALEUR: "Pompe à chaleur",
    FIOUL: "Fioul",
    BOIS: "Bois",
    COLLECTIF: "Collectif",
  };

  const kitchenLabel: Record<string, string> = {
    EQUIPEE: "Équipée",
    AMENAGEE: "Aménagée",
    AMERICAINE: "Américaine",
    SEPAREE: "Séparée",
    AUCUNE: "Aucune",
  };

  const conditionLabel: Record<string, string> = {
    NEUF: "Neuf",
    EXCELLENT: "Excellent état",
    BON: "Bon état",
    A_RENOVER: "À rénover",
  };

  const hasExtras =
    property.type != null ||
    property.floor != null ||
    property.totalFloors != null ||
    property.bathrooms != null ||
    property.toilets != null ||
    property.heatingType != null ||
    property.kitchenType != null ||
    property.condition != null ||
    property.elevator != null ||
    property.yearBuilt != null;

  const hasEnergy =
    property.energyClass != null ||
    property.gesClass != null ||
    property.energyConsumption != null ||
    property.gesEmission != null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/properties"
        className="text-sm text-gray-600 hover:text-gray-900 underline"
      >
        ← Retour aux biens
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Colonne gauche */}
        <section>
          <h1 className="text-3xl font-bold">{property.title}</h1>
          <div className="mt-2 text-gray-600">{property.city}</div>

          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
            <img
              src={getPropertyImage(property.type, property.imageUrl)}
              alt={property.title}
              className="h-[320px] w-full object-cover"
            />
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 p-5">
            <div className="text-2xl font-bold">
              {property.price.toLocaleString("fr-FR")} €
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {property.surfaceM2 != null ? (
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
            
            {/* Infos complémentaires */}
            {hasExtras ? (
              <div className="mt-6 border-t border-gray-200 pt-5">
                <h2 className="text-base font-semibold">
                  Informations complémentaires
                </h2>

                <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  {property.type != null ? (
                    <div>
                      <dt className="text-gray-500">Type</dt>
                      <dd className="font-medium">
                        {typeLabel[String(property.type)] ?? String(property.type)}
                      </dd>
                    </div>
                  ) : null}

                  {property.condition != null ? (
                    <div>
                      <dt className="text-gray-500">État</dt>
                      <dd className="font-medium">
                        {conditionLabel[String(property.condition)] ?? String(property.condition)}
                      </dd>
                    </div>
                  ) : null}

                  {property.yearBuilt != null ? (
                    <div>
                      <dt className="text-gray-500">Année de construction</dt>
                      <dd className="font-medium">{property.yearBuilt}</dd>
                    </div>
                  ) : null}

                  {property.floor != null ? (
                    <div>
                      <dt className="text-gray-500">Étage</dt>
                      <dd className="font-medium">
                        {property.floor}
                        {property.totalFloors != null ? ` / ${property.totalFloors}` : ""}
                      </dd>
                    </div>
                  ) : null}

                  {property.elevator != null ? (
                    <div>
                      <dt className="text-gray-500">Ascenseur</dt>
                      <dd className="font-medium">
                        {property.elevator ? "Oui" : "Non"}
                      </dd>
                    </div>
                  ) : null}

                  {property.bathrooms != null ? (
                    <div>
                      <dt className="text-gray-500">Salles de bain</dt>
                      <dd className="font-medium">{property.bathrooms}</dd>
                    </div>
                  ) : null}

                  {property.toilets != null ? (
                    <div>
                      <dt className="text-gray-500">Toilettes</dt>
                      <dd className="font-medium">{property.toilets}</dd>
                    </div>
                  ) : null}

                  {property.heatingType != null ? (
                    <div>
                      <dt className="text-gray-500">Chauffage</dt>
                      <dd className="font-medium">
                        {heatingLabel[String(property.heatingType)] ?? String(property.heatingType)}
                      </dd>
                    </div>
                  ) : null}

                  {property.kitchenType != null ? (
                    <div>
                      <dt className="text-gray-500">Cuisine</dt>
                      <dd className="font-medium">
                        {kitchenLabel[String(property.kitchenType)] ?? String(property.kitchenType)}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            ) : null}

            {/* DPE / GES */}
            {hasEnergy ? (
              <div className="mt-6 border-t border-gray-200 pt-5">
                <h2 className="text-base font-semibold">DPE / GES</h2>

                <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  {property.energyClass != null ? (
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="text-gray-500">Classe énergie</div>
                      <div className="text-lg font-bold">{property.energyClass}</div>
                      {property.energyConsumption != null ? (
                        <div className="mt-1 text-gray-700">
                          {property.energyConsumption} kWhEP/m²/an
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {property.gesClass != null ? (
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="text-gray-500">Classe GES</div>
                      <div className="text-lg font-bold">{property.gesClass}</div>
                      {property.gesEmission != null ? (
                        <div className="mt-1 text-gray-700">
                          {property.gesEmission} kgCO₂/m²/an
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

          </div>

          <div className="mt-3 text-xs text-gray-500">
            Référence : <span className="font-mono">{property.id}</span>
          </div>
        </section>

        {/* Colonne droite (Contact) */}
        <aside className="h-fit rounded-xl border border-gray-200 p-5">
          <div className="text-base font-semibold">Contacter l’agence</div>
          <p className="mt-1 text-sm text-gray-600">
            Réponse sous 24h (démo).
          </p>

          <a
            href={`mailto:ugurkaya67@hotmail.com?subject=${subject}&body=${body}`}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-2 font-semibold text-white hover:bg-gray-900"
          >
            Envoyer un email
          </a>

          <div className="mt-4 text-sm text-gray-700">
            Ou appelez : <span className="font-semibold">03 88 00 00 00</span>
          </div>

          <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
            Astuce : mentionne la référence{" "}
            <span className="font-mono">{property.id}</span>.
          </div>
        </aside>
      </div>
    </main>
  );
}