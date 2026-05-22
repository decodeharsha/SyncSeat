/**
 * =============================================================================
 * prisma/seed.js — Development database seed for SyncSeat
 * =============================================================================
 * WHY SEED SCRIPTS EXIST
 * ----------------------
 * After migrations create empty tables, you still need rows to build and test
 * the app. A seed script is a repeatable way to populate the database with a
 * known baseline — run it on a fresh DB, after reset, or when onboarding a
 * new developer.
 *
 * WHY SAMPLE DATA HELPS DEVELOPMENT
 * ---------------------------------
 * Realistic records let you exercise list pages, API responses, and date
 * formatting without manual SQL each time. Everyone on the team sees the same
 * events, which makes bugs easier to reproduce and demos predictable.
 *
 * Run: npx prisma db seed   (from the server directory)
 * =============================================================================
 */

import "dotenv/config";
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const events = [
  {
    title: "Tech Conference 2026",
    venue: "Hyderabad Convention Center",
    date: new Date("2026-06-15T09:00:00.000Z"),
  },
  {
    title: "Startup Summit",
    venue: "Bangalore Expo Hall",
    date: new Date("2026-07-10T10:30:00.000Z"),
  },
  {
    title: "AI Innovation Meetup",
    venue: "Chennai Tech Park",
    date: new Date("2026-09-18T18:00:00.000Z"),
  },
];

async function main() {
  // Clear existing events so re-running the seed does not duplicate rows
  await prisma.event.deleteMany();

  const { count } = await prisma.event.createMany({
    data: events,
  });

  console.log(`Seeded ${count} event(s).`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
