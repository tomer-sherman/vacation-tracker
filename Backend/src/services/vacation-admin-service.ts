import path from "node:path";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { VacationModel, IVacationModel } from "../models/vacation-model";
import { imageHandler } from "../utils/image-handler";
import { vacationService } from "./vacation-service";
import mongoose from "mongoose";


class VacationAdminService {


    public async addVacation(vacation: IVacationModel): Promise<IVacationModel> {

        await ClientError.validateDocument(vacation);
        if (!vacation.image) throw new ClientError(StatusCode.UnprocessableContent, "You must send image.");

        const imageId = await imageHandler.addImage(vacation.image);
        console.log("Image adding succeeded.");
        vacation.imageId = imageId;

        const dbVacation = await vacation.save();
        return dbVacation;
    }


    public async deleteVacation(_id: string): Promise<void> {
        if (!mongoose.isValidObjectId(_id)) throw new ClientError(StatusCode.NotFound, `The vacation ${_id} that you are trying to delete not found.`)

        const dbVacation = await VacationModel.findByIdAndDelete(_id).exec();
        if (!dbVacation) throw new ClientError(StatusCode.NotFound, `Vacation ${_id} not found.`);

        if (!dbVacation.imageId) {
            console.log(`Vacation ${_id} deleted, it had no image.`);
            return
        }

        // Removing after deleting much better since Its better to have an orphan image, Then false data in the data base.
        const imagePath = path.join(imageHandler.folderPath, dbVacation.imageId);
        await imageHandler.removeImage(imagePath);
        console.log("Delete successful");

    }


    public async updateVacation(vacation: IVacationModel): Promise<IVacationModel> {
        if (!mongoose.isValidObjectId(vacation._id)) throw new ClientError(StatusCode.NotFound, `Vacation ${vacation._id} not found. `)

        await ClientError.validateDocument(vacation);

        const dbVacation = await VacationModel.findByIdAndUpdate(vacation._id, vacation, { returnDocument: "after" }).exec();
        if (!dbVacation) throw new ClientError(StatusCode.NotFound, `Vacation ${vacation._id} not found.`)

        // If a new image comes from the front, 
        if (vacation.image) {

            // Delete the current image.
            const currentImagePath = path.join(imageHandler.folderPath, vacation.imageId)
            await imageHandler.removeImage(currentImagePath);

            // Overwride the image id
            vacation.imageId = await imageHandler.addImage(vacation.image);

        }




        return dbVacation;

    }



}

export const vacationAdminService = new VacationAdminService();
