import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  await prisma.property.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(3).optional(),
  price: z.coerce.number().int().positive().optional(),
  city: z.string().min(2).optional(),
  surfaceM2: z.coerce.number().int().positive().optional(),
  rooms: z.coerce.number().int().positive().optional(),
  bedrooms: z.coerce.number().int().positive().optional(),
  imageUrl: z.string().url().optional(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const body = await req.json().catch(() => null);
  //debuging requete envoyé pour mise à jour du biens
  //console.log("PATCH BODY:", body);
  
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    console.log("ZOD PATCH ERROR:", parsed.error.format());
    return NextResponse.json({ error: "Invalid data", details: parsed.error.format() }, { status: 400 });
  }

  const data = Object.fromEntries(
    Object.entries(parsed.data).filter(([, v]) => v !== undefined)
  );

  const updated = await prisma.property.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}