import { prisma } from "../lib/prisma";
import "dotenv/config";
import argon2 from "argon2";

async function main() {
  const email = "admin@local.test";
  const password = "Admin1234!";

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
