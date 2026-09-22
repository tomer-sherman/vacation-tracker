import mongoose from "mongoose";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { VacationModel, IVacationModel } from "../models/vacation-model";


class VacationService {

    public async getAllVacations(): Promise<IVacationModel[]> {

        const dbVacations = await VacationModel.find().exec() as IVacationModel[];
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
