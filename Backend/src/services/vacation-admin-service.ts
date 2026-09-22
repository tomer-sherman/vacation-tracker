import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { VacationModel, IVacationModel } from "../models/vacation-model";


class VacationAdminService {


    public async addVacation(vacation: IVacationModel): Promise<IVacationModel> {

        await ClientError.validateDocument(vacation);

        const dbVacation = await vacation.save();
        return dbVacation;
    }


    public async deleteVacation(_id: string): Promise<void> {
        const dbVacation = await VacationModel.findByIdAndDelete(_id).exec();
        if (!dbVacation) throw new ClientError(StatusCode.NotFound, `Vacation ${_id} not found.`);
    }


    public async updateVacation(vacation: IVacationModel): Promise<IVacationModel> {

        await ClientError.validateDocument(vacation);

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
