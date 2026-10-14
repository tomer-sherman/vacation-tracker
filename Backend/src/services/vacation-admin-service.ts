import path from "node:path";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { VacationModel, IVacationModel } from "../models/vacation-model";
import { imageHandler } from "../utils/image-handler";
import mongoose from "mongoose";


class VacationAdminService {

    // adds a vacation
    public async addVacation(vacation: IVacationModel): Promise<IVacationModel> {
        // Validates the added document
        await ClientError.validateDocument(vacation);

        // Validates the date
        ClientError.validateStartDate(vacation.startAt);
        
        // If an image did not come
        if (!vacation.image) throw new ClientError(StatusCode.UnprocessableContent, "You must choose an image.");

        // uses my addImage util too add an image to the folder.
        const imageId = await imageHandler.addImage(vacation.image);
        
        // Seting the new imageId before sending to the back
        vacation.imageId = imageId;

        // sending to the back.
        const dbVacation = await vacation.save();
        return dbVacation;

        // sending after casuse worst case, i have an orphan image.
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
            oldImagePath = await this.getImagePathById(vacation._id.toString());
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

    // Checked whether the name is destination name is changed.
    private async isNameChanged(destination: string, vacationId: string): Promise<boolean> {

        const nameObj = await VacationModel.findById(vacationId).select("destination");
        const currentDestination = nameObj?.destination;

        if (currentDestination === destination) return false ;
        return true;
    }

    
     public async getImagePathById(_id: string): Promise<string> {
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

export const vacationAdminService = new VacationAdminService();
