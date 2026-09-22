import mongoose from "mongoose";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { VacationModel, IVacationModel, VacationView } from "../models/vacation-model";



class VacationService {

    public async getAllVacations(userId: string): Promise<VacationView[]> {

        //Convert string to mongoDb userId object.
        const mongoUserId = new mongoose.Types.ObjectId(userId);

        const dbVacations = await VacationModel.aggregate<VacationView>([
            {
                $project: {
                    // This fields will be sent the same way as mongo stores them.
                    _id: 1, destination: 1, startAt: 1, finishAt: 1, price: 1,

                    // This are sent a bit differently, since we want to handle isLiked and likeCount as well.
                    likeCount: { $size: "$likes" },
                    isLiked: { $in: [mongoUserId, "$likes"] }
                },
            }
        ])
        return dbVacations;

    }

    public async getOneVacation(_id: string): Promise<IVacationModel> {

        if (!mongoose.isValidObjectId(_id)) throw new ClientError(StatusCode.NotFound, `_id: ${_id} not found.`);

        const dbVacation = await VacationModel.findById(_id).exec() as IVacationModel;
        return dbVacation;

    }

    public async like(userId: string, vacationId: string): Promise<void> {

        if (!mongoose.isValidObjectId(vacationId)) throw new ClientError(StatusCode.NotFound, `_id: ${vacationId} not found.`);

        await VacationModel.findByIdAndUpdate(vacationId,
            { $addToSet: { likes: userId } },
            { returnDocument: "after" }
        ).exec();



    }

    public async unLike(userId: string, vacationId: string): Promise<void> {

        if (!mongoose.isValidObjectId(vacationId)) throw new ClientError(StatusCode.NotFound, `_id: ${vacationId} not found.`)

        await VacationModel.findByIdAndUpdate(vacationId,
            { $pull: { likes: userId } },
            { returnDocument: "after" }
        ).exec();


    }


}

export const vacationService = new VacationService();
