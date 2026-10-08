import mongoose from "mongoose";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { VacationModel, IVacationModel, VacationView } from "../models/vacation-model";
import { imageHandler } from "../utils/image-handler";
import path from "node:path";



class VacationService {

    public async getAllVacations(userId: string): Promise<IVacationModel[]> {

        //Convert string to mongoDb userId object.
        const mongoUserId = new mongoose.Types.ObjectId(userId);

        const dbVacations = await VacationModel.aggregate<IVacationModel>([
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
        // Prevents cast errors.
        if (!mongoose.isValidObjectId(userId)) throw new ClientError(StatusCode.NotFound, `Vacation ${vacationId} not found. `);


        await VacationModel.findByIdAndUpdate(vacationId,
            { $addToSet: { likes: userId } },
            { returnDocument: "after" }
        ).exec();



    }

    public async unLike(userId: string, vacationId: string): Promise<void> {

        if (!mongoose.isValidObjectId(userId)) throw new ClientError(StatusCode.BadRequest, ``);

        await VacationModel.findByIdAndUpdate(vacationId,
            { $pull: { likes: userId } },
            { returnDocument: "after" }
        ).exec();


    }

    public async getImagePath(_id: string): Promise<string> {
        // Prevents 500 cast error.
        if (!mongoose.isValidObjectId(_id)) throw new ClientError(StatusCode.BadRequest, "Wrong id format.");


        const imageObj = await VacationModel.findById(_id).select("imageId");

        // Checks if not found.
        if (!imageObj) throw new ClientError(StatusCode.NotFound, `Vacation ${_id} not found.`)
        if (!imageObj?.imageId) throw new ClientError(StatusCode.NotFound, `Image not found for vacation ${_id}.`);

        const imageId = imageObj.imageId;
        const filePath = path.join(imageHandler.folderPath, imageId);

        return filePath;
    }


}

export const vacationService = new VacationService();
