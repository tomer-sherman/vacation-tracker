import mongoose from "mongoose";
import { UserModel } from "../src/models/user-model"; // Use the same paths as in seed-vacations.ts.
import { appConfig } from "../src/utils/app-config";

const usersCount = 15;
const password = "123Abc";

// Same name for everyone, only the email is unique: user1@gmail.com ... user15@gmail.com.
const users = Array.from({ length: usersCount }, (_, index) => ({
    firstName: "test",
    lastName: "user",
    email: `user${index + 1}@gmail.com`,
    password
}));

async function seed(): Promise<void> {
    await mongoose.connect(appConfig.mongoConnectionString); // Same connection line as in seed-vacations.ts.

    // Stop if any of these emails already exist, so running it twice doesn't half-seed.
    const existingUsers = await UserModel.find({ email: { $in: users.map(user => user.email) } }).exec();
    if (existingUsers.length) throw new Error(`Already seeded: ${existingUsers.map(user => user.email).join(", ")}`);

    // create() runs the pre("save") hook, so every password gets hashed.
    for (const user of users) await UserModel.create(user);

    console.log(`Seeded ${users.length} users. Password for all: ${password}`);
}

seed()
    .catch(err => console.error(err.message))
    .finally(() => mongoose.disconnect());