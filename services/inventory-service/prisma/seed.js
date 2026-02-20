const { PrismaClient, SupplierType } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Clear old data
  await prisma.inventory.deleteMany();
  await prisma.supplier.deleteMany();

  // Create suppliers
  const warehouse = await prisma.supplier.create({
    data: {
      name: "Central Disaster Warehouse",
      type: SupplierType.WAREHOUSE,
      latitude: 28.6139,
      longitude: 77.2090, // Delhi
    },
  });

  const pharmacy = await prisma.supplier.create({
    data: {
      name: "City Care Pharmacy",
      type: SupplierType.PHARMACY,
      latitude: 28.5355,
      longitude: 77.3910, // Noida
    },
  });

  const bloodBank = await prisma.supplier.create({
    data: {
      name: "LifeLine Blood Bank",
      type: SupplierType.BLOOD_BANK,
      latitude: 28.4595,
      longitude: 77.0266, // Gurgaon
    },
  });

  // Add inventory
  await prisma.inventory.createMany({
    data: [
      {
        itemName: "OXYGEN_CYLINDER",
        quantity: 50,
        supplierId: warehouse.id,
      },
      {
        itemName: "OXYGEN_CYLINDER",
        quantity: 10,
        supplierId: pharmacy.id,
      },
      {
        itemName: "A_POSITIVE_BLOOD",
        quantity: 20,
        supplierId: bloodBank.id,
      },
    ],
  });

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });