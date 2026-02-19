import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  price: z.coerce.number().int().positive(),
  city: z.string().min(2),
  surfaceM2: z.coerce.number().int().positive().optional(),
  rooms: z.coerce.number().int().positive().optional(),
  bedrooms: z.coerce.number().int().positive().optional(),
});

export async function GET() {
  const data = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);

  console.log("BODY RECEIVED:", body);

  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    console.log("ZOD ERROR:", parsed.error.format());

    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.format() },
      { status: 400 }
    );
  }

  const created = await prisma.property.create({ data: parsed.data });
  return NextResponse.json(created, { status: 201 });
}
