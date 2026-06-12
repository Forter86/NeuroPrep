// Runtime seed — для среды, где БД доступна (например, на VPS):
//   node prisma/seed.mjs   ИЛИ   npx prisma db seed
// Если БД недоступна с твоей машины — используй prisma/sql/setup.sql через phpMyAdmin.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SEED_USERS = [
  { id: "usr_artur", login: "ARTUR", displayName: "Artur", role: "admin" },
  { id: "usr_denis", login: "DENIS", displayName: "Denis", role: "user" },
  { id: "usr_anton", login: "ANTON", displayName: "Anton", role: "user" },
  { id: "usr_user", login: "USER", displayName: "User", role: "user" },
];

async function main() {
  for (const u of SEED_USERS) {
    const passwordHash = bcrypt.hashSync(u.login, 10);
    await prisma.user.upsert({
      where: { login: u.login },
      update: { displayName: u.displayName, passwordHash, role: u.role },
      create: {
        id: u.id,
        login: u.login,
        displayName: u.displayName,
        passwordHash,
        role: u.role,
        provider: "local",
      },
    });
    console.log(`seeded: ${u.login}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
