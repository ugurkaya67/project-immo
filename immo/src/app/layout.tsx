import "./globals.css";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = (session as any)?.role;

  return (
    <html lang="fr">
      <body>
        <header className="border-b border-gray-200">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-bold">
              Project Immo
            </Link>

            <div className="flex items-center gap-6 text-sm">
              <Link href="/" className="hover:underline">
                Accueil
              </Link>
              <Link href="/properties" className="hover:underline">
                Biens
              </Link>

              {role === "ADMIN" && (
                <Link href="/admin/properties" className="hover:underline">
                  Admin
                </Link>
              )}

              {session ? (
                <Link href="/api/auth/signout" className="hover:underline">
                  Déconnexion
                </Link>
              ) : (
                <Link href="/login" className="hover:underline">
                  Connexion
                </Link>
              )}
            </div>
          </nav>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}