import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if ((session as any).role !== "ADMIN") redirect("/");

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin</h1>
      <pre style={{ marginTop: 16, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}
