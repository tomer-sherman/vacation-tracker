import path from "node:path";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { VacationModel, IVacationModel } from "../models/vacation-model";
import { imageHandler } from "../utils/image-handler";
import { vacationService } from "./vacation-service";


class VacationAdminService {


    public async addVacation(vacation: IVacationModel): Promise<IVacationModel> {

        await ClientError.validateDocument(vacation);

        const imageId = await imageHandler.addImage(vacation.image);
        console.log("Image adding succeeded.");
        vacation.imageId = imageId;

        const dbVacation = await vacation.save();
        return dbVacation;
    }


    public async deleteVacation(_id: string): Promise<void> {

        // Removing the image before deleting the object.
        const imagePath = await vacationService.getImagePath(_id);
        await imageHandler.removeImage(imagePath);
        console.log("Delete successful");

        const dbVacation = await VacationModel.findByIdAndDelete(_id).exec();
        if (!dbVacation) throw new ClientError(StatusCode.NotFound, `Vacation ${_id} not found.`);
    }


    public async updateVacation(vacation: IVacationModel): Promise<IVacationModel> {

        await ClientError.validateDocument(vacation);

        

        // Update, simply over writing
        vacation.imageId = await imageHandler.addImage(vacation.image);

        const dbVacation = await VacationModel.findByIdAndUpdate(vacation._id, vacation, { returnDocument: "after" }).exec();
        if (!dbVacation) throw new ClientError(StatusCode.NotFound, `Vacation ${vacation._id} not found.`)

        return dbVacation;

    }

    public async getAllVacationLikes(): Promise<string[]> {

        const dbVacations = await VacationModel.aggregate<string>([
            { $project: { destination: 1, likesCount: { $size: "$likes" } } }
        ])

        return dbVacations;

    }


}

export const vacationAdminService = new VacationAdminService();
