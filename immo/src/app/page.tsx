import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative h-[80vh] w-full">
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600"
          alt="Agence immobilière"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="text-4xl font-bold md:text-5xl">
            Trouvez le bien immobilier qui vous ressemble
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-gray-200">
            Project Immo vous accompagne dans l’achat, la vente et la location
            de biens immobiliers avec transparence et expertise.
          </p>

          <Link
            href="/properties"
            className="mt-6 rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200"
          >
            Voir nos biens
          </Link>
        </div>
      </section>

      {/* PRESENTATION */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Pourquoi choisir Project Immo ?</h2>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">Expertise locale</h3>
            <p className="mt-2 text-gray-600">
              Une parfaite connaissance du marché immobilier régional.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Accompagnement personnalisé</h3>
            <p className="mt-2 text-gray-600">
              Un suivi complet de votre projet, de la première visite à la signature.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Transparence & confiance</h3>
            <p className="mt-2 text-gray-600">
              Des conseils honnêtes et une communication claire à chaque étape.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gray-100 py-16 text-center">
        <h2 className="text-2xl font-bold">
          Vous avez un projet immobilier ?
        </h2>

        <p className="mt-3 text-gray-600">
          Contactez-nous dès aujourd’hui pour une estimation gratuite.
        </p>

        <Link
          href="/properties"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-900"
        >
          Découvrir nos biens
        </Link>
      </section>
    </main>
  );
}