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
        ClientError.validateStartDate(vacation.startAt);
        if (!vacation.image) throw new ClientError(StatusCode.UnprocessableContent, "You must choose an image.");

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
        // Prevents cast error and converts it to 404
        if (!mongoose.isValidObjectId(vacation._id)) throw new ClientError(StatusCode.NotFound, `Vacation ${vacation._id} not found. `);

        // Checks validations and throws 422 if did not pass
        await ClientError.validateDocument(vacation);

        // Set a oldImagePath var.
        let oldImagePath: string | null = null;


        // If a new image comes, save it in the backend folder, And over write the vacation.imageId too the new image.
        if (vacation.image) {
            oldImagePath = await vacationService.getImagePath(vacation._id.toString());
            vacation.imageId = await imageHandler.addImage(vacation.image);
        }

        // Checks if the name was changed if overide the likes to prevent like deletion.
        if (!await this.isNameChanged(vacation.destination, vacation._id.toString())) {
            const likesObj = await VacationModel.findById(vacation._id).select("likes");
            vacation.likes = likesObj!.likes
        }

        const dbVacation = await VacationModel.findByIdAndUpdate(vacation._id, vacation, { returnDocument: "after" }).exec();
        if (!dbVacation) throw new ClientError(StatusCode.NotFound, `Vacation ${vacation._id} not found.`);

        // Only after updating the image in the DB, delete the old image from the backend.
        if (oldImagePath) await imageHandler.removeImage(oldImagePath);

        return dbVacation;
    }

    private async isNameChanged(destination: string, vacationId: string): Promise<boolean> {

        const nameObj = await VacationModel.findById(vacationId).select("destination");
        const currentDestination = nameObj?.destination;

        if (currentDestination === destination) return false ;
        return true;
    }



}

export const vacationAdminService = new VacationAdminService();
