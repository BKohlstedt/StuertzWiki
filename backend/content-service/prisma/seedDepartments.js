import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const departments = [
  { title: "Vertrieb", imageUrl: "/assets/vertrieb.png" },
  { title: "PM", imageUrl: "/assets/pm.png" },
  { title: "EKon", imageUrl: "/assets/ekon.png" },
  { title: "MKon", imageUrl: "/assets/mkon.png" },
  { title: "SKon", imageUrl: "/assets/skon.png" },
  { title: "Controlling", imageUrl: "/assets/controlling.png" },
  { title: "Fertigungsleitung", imageUrl: "/assets/fertigungsleitung.png" },
  { title: "Halle5", imageUrl: "/assets/halle5.png" },
  { title: "Halle7", imageUrl: "/assets/halle7.png" },
  { title: "Empore", imageUrl: "/assets/empore.png" },
  { title: "Service", imageUrl: "/assets/service.png" },
  { title: "FieldService", imageUrl: "/assets/fieldservice.png" },
  { title: "Smi", imageUrl: "/assets/smi.png" },
  { title: "Stuga", imageUrl: "/assets/stuga.png" },
  { title: "Spl", imageUrl: "/assets/spl.png" },
  { title: "Smc", imageUrl: "/assets/smc.png" },
];

async function main() {
  for (const dept of departments) {
    const exists = await prisma.department.findUnique({ where: { title: dept.title } });
    if (!exists) {
      await prisma.department.create({
        data: {
          title: dept.title,
          imageUrl: dept.imageUrl,
          isLocked: false,
        },
      });
      console.log(`Abteilung "${dept.title}" erstellt.`);
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
