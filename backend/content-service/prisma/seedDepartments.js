import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const departments = [
  "Vertrieb",
  "PM",
  "EKon",
  "MKon",
  "SKon",
  "Controlling",
  "Fertigungsleitung",
  "Halle5",
  "Halle7",
  "Empore",
  "Service",
  "FieldService",
  "Smi",
  "Stuga",
  "Spl",
  "Smc"
];

async function main() {
  for (const title of departments) {
    // Prüfe, ob Abteilung schon existiert
    const exists = await prisma.department.findUnique({ where: { title } });
    if (!exists) {
      await prisma.department.create({
        data: {
          title,
          imageUrl: null,
          isLocked: false,
        },
      });
      console.log(`Abteilung "${title}" erstellt.`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
