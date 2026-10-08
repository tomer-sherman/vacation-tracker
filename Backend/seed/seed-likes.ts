import mongoose from "mongoose";
import { UserModel } from "../src/models/user-model"; // Use the same paths as in the other seed scripts.
import { VacationModel } from "../src/models/vacation-model";
import { appConfig } from "../src/utils/app-config";

const likesPerUser = 5;

// Only the seeded users: user1@gmail.com ... user15@gmail.com.
const seededEmails = Array.from({ length: 15 }, (_, index) => `user${index + 1}@gmail.com`);

// Returns a shuffled copy, so every user gets a different random pick.
function shuffle<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

async function seed(): Promise<void> {
    await mongoose.connect(appConfig.mongoConnectionString); // Same connection line as in the other seed scripts.

    const users = await UserModel.find({ email: { $in: seededEmails } }).select("_id").exec();
    if (!users.length) throw new Error("No seeded users found, run seed-users.ts first.");

    const vacations = await VacationModel.find().select("_id").exec();
    if (vacations.length < likesPerUser) throw new Error(`Need at least ${likesPerUser} vacations, run seed-vacations.ts first.`);

    const userIds = users.map(user => user._id);

    // Remove the seeded users' old likes first, so running it again reshuffles instead of piling up.
    await VacationModel.updateMany({}, { $pull: { likes: { $in: userIds } } }).exec();

    // Each user likes 5 random vacations. $addToSet never adds the same user twice to one vacation.
    for (const userId of userIds) {
        const pickedIds = shuffle(vacations).slice(0, likesPerUser).map(vacation => vacation._id);
        await VacationModel.updateMany({ _id: { $in: pickedIds } }, { $addToSet: { likes: userId } }).exec();
    }

    console.log(`Seeded ${likesPerUser} likes for each of ${users.length} users.`);
}

seed()
    .catch(err => console.error(err.message))
    .finally(() => mongoose.disconnect());