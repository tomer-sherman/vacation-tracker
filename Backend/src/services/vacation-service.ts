import mongoose from "mongoose";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { VacationModel, IVacationModel } from "../models/vacation-model";
import { imageHandler } from "../utils/image-handler";
import path from "node:path";



class VacationService {

    // gets all.
    public async getAllVacations(userId: string): Promise<IVacationModel[]> {

        //Convert string to mongoDb userId object.
        const mongoUserId = new mongoose.Types.ObjectId(userId);

        const dbVacations = await VacationModel.aggregate<IVacationModel>([
            { $sort: { startAt: 1 } },
            {
                $project: {
                    // This fields will be sent the same way as mongo stores them.
                    _id: 1, destination: 1, description: 1, startAt: 1, finishAt: 1, price: 1, imageId: 1,

                    // This are sent a bit differently, since we want to handle isLiked and likeCount as instead of an array of usersUid, and to add isLiked property
                    likeCount: { $size: "$likes" },
                    isLiked: { $in: [mongoUserId, "$likes"] }
                },
            }
        ])
        return dbVacations;

    }

    // gives one vacation
    public async getOneVacation(_id: string): Promise<IVacationModel> {
        // prevents cast error
        if (!mongoose.isValidObjectId(_id)) throw new ClientError(StatusCode.NotFound, `_id: ${_id} not found.`);



        const dbVacation = await VacationModel.findById(_id).exec() as IVacationModel;
        return dbVacation;

    }
    
    // Like
    public async like(userId: string, vacationId: string): Promise<void> {
        // Prevents cast errors.
        if (!mongoose.isValidObjectId(userId)) throw new ClientError(StatusCode.NotFound, `Vacation ${vacationId} not found. `);


        await VacationModel.findByIdAndUpdate(vacationId,
            { $addToSet: { likes: userId } },
            { returnDocument: "after" }
        ).exec();



    }

    // un like
    public async unLike(userId: string, vacationId: string): Promise<void> {

        if (!mongoose.isValidObjectId(userId)) throw new ClientError(StatusCode.BadRequest, ``);

        await VacationModel.findByIdAndUpdate(vacationId,
            { $pull: { likes: userId } },
            { returnDocument: "after" }
        ).exec();


    }

   // Gets the image path by the imageId
    public getImagePathByImageId(imageId: string): string {

        if (!/^[0-9a-f-]{36}\.\w+$/i.test(imageId)) throw new ClientError(StatusCode.NotFound, `Image ${imageId} not found.`);

        const imagePath = path.join(imageHandler.folderPath, imageId);
        return imagePath;

    }

}

export const vacationService = new VacationService();
