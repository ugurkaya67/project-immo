import { prisma } from "../lib/prisma";
import "dotenv/config";
import argon2 from "argon2";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL ou ADMIN_PASSWORD manquant.");
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    console.log("Admin déjà présent:", email);
    return;
  }

  await prisma.user.create({
    data: {
      email,
      name: "Admin",
      role: "ADMIN",
      passwordHash: await argon2.hash(password),
    },
  });

  console.log("✅ Admin créé");
  console.log("Email:", email);
  console.log("Password:", password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
