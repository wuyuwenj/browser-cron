import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      id: "demo-user",
      email: "demo@example.com",
      name: "Demo User",
    },
  });

  console.log("✅ Demo user created:", demoUser);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
