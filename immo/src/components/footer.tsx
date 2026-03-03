import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-black text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="text-lg font-bold">Project Immo</div>
          <p className="mt-2 text-sm text-white/70">
            Agence immobilière (démo) — achat, vente, location.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold">Liens</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>
              <Link className="hover:text-white hover:underline" href="/">
                Accueil
              </Link>
            </li>
            <li>
              <Link className="hover:text-white hover:underline" href="/properties">
                Biens
              </Link>
            </li>
            <li>
              <Link className="hover:text-white hover:underline" href="/login">
                Connexion
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold">Contact</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>
              Email : <span className="text-white">contact@local.test</span>
            </li>
            <li>
              Tél : <span className="text-white">03 88 00 00 00</span>
            </li>
            <li>
              Adresse : <span className="text-white">Strasbourg (démo)</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Project Immo — Tous droits réservés.
      </div>
    </footer>
  );
}