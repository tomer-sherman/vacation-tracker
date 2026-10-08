import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import { VacationModel } from "../src/models/vacation-model"; // Adjust to your model file.
import { appConfig } from "../src/utils/app-config"; // Adjust to your app config file.

// Seed is not within src, and the images are within src/assets/images.
const imagesFolderPath = path.join(__dirname, "..", "src", "assets", "images");

// Only these files in the images folder are used.
const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

type SeedVacation = {
    destination: string;
    description: string;
    startAt: string;
    finishAt: string;
    price: number;
};

// Each vacation gets the image at the same position in the images folder (whatever its name is).
const vacations: SeedVacation[] = [
    { destination: "Paris", description: "Croissants by the Seine, the Louvre and evening lights on the Eiffel Tower.", startAt: "2026-11-12", finishAt: "2026-11-18", price: 1499 },
    { destination: "Tokyo", description: "Neon streets, quiet temples, sushi counters and a day trip to Mount Fuji.", startAt: "2026-12-03", finishAt: "2026-12-13", price: 3299 },
    { destination: "Barcelona", description: "Sunny beaches, tapas and Gaudi architecture in the heart of Catalonia.", startAt: "2026-12-10", finishAt: "2026-12-17", price: 1299 },
    { destination: "New York", description: "Broadway shows, Central Park walks and skyline views from the Brooklyn Bridge.", startAt: "2026-12-20", finishAt: "2026-12-27", price: 2799 },
    { destination: "Reykjavik", description: "Northern lights, hot springs and volcanic landscapes under the winter sky.", startAt: "2027-01-08", finishAt: "2027-01-14", price: 2199 },
    { destination: "Dubai", description: "Desert safaris, record-breaking towers and luxury shopping in the sun.", startAt: "2027-01-20", finishAt: "2027-01-26", price: 1899 },
    { destination: "Bali", description: "Rice terraces, surf beaches and peaceful temples on the island of the gods.", startAt: "2027-02-05", finishAt: "2027-02-16", price: 2499 },
    { destination: "Rome", description: "Ancient ruins, Vatican art and fresh pasta in every narrow alley.", startAt: "2027-03-04", finishAt: "2027-03-10", price: 1199 },
    { destination: "Kyoto", description: "Cherry blossoms, bamboo forests and traditional tea houses in old Japan.", startAt: "2027-03-28", finishAt: "2027-04-05", price: 3099 },
    { destination: "Amsterdam", description: "Canal cruises, tulip fields and bike rides past historic houses.", startAt: "2027-04-15", finishAt: "2027-04-20", price: 999 },
    { destination: "Lisbon", description: "Yellow trams, ocean views and warm pastries on every corner.", startAt: "2027-05-06", finishAt: "2027-05-12", price: 899 },
    { destination: "Santorini", description: "White villages, blue domes and famous sunsets over the Aegean Sea.", startAt: "2027-06-10", finishAt: "2027-06-17", price: 2299 },
    { destination: "Cape Town", description: "Table Mountain hikes, penguin beaches and wine tasting in the vineyards.", startAt: "2027-07-01", finishAt: "2027-07-10", price: 2699 },
    { destination: "Rio de Janeiro", description: "Copacabana beach, samba nights and the view from Sugarloaf Mountain.", startAt: "2027-07-22", finishAt: "2027-08-01", price: 2899 },
    { destination: "Prague", description: "Medieval squares, Gothic castles and cozy beer halls along the river.", startAt: "2027-08-12", finishAt: "2027-08-17", price: 799 },
];

// Reads every image file in the folder, whatever its name, sorted so 1, 2, 10 stay in order.
async function getImageFiles(): Promise<string[]> {
    const files = await fs.readdir(imagesFolderPath);
    return files
        .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function seed(): Promise<void> {
    await mongoose.connect(appConfig.mongoConnectionString); // Adjust to your connection string property.

    const imageFiles = await getImageFiles();
    if (imageFiles.length < vacations.length) {
        throw new Error(`Found ${imageFiles.length} images, but there are ${vacations.length} vacations.`);
    }

    // Phase 1: Check every vacation passes validation, before touching anything.
    const prepared = [];
    for (const [index, vacation] of vacations.entries()) {
        const image = imageFiles[index];
        const currentImagePath = path.join(imagesFolderPath, image);

        // Random file name, keeping the original extension.
        const imageId = `${crypto.randomUUID()}${path.extname(image)}`;

        const dbVacation = new VacationModel({ ...vacation, imageId });

        try { await dbVacation.validate(); }
        catch (err: any) { throw new Error(`${vacation.destination}: ${err.message}`); }

        prepared.push({ dbVacation, currentImagePath, newImagePath: path.join(imagesFolderPath, imageId) });
    }

    // Phase 2: Everything is valid, so rename each image to its imageId and save its vacation.
    for (const { dbVacation, currentImagePath, newImagePath } of prepared) {
        await fs.rename(currentImagePath, newImagePath);
        await dbVacation.save();
    }

    console.log(`Seeded ${prepared.length} vacations.`);
}

seed()
    .catch(err => console.error(err.message))
    .finally(() => mongoose.disconnect());