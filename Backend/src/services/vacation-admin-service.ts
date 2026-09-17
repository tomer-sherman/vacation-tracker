import { ClientError } from "../utils/Error-handler/models/client-error";
import { StatusCode } from "../utils/Error-handler/models/enum";
import { VacationModel, IVacationModel } from "../models/vacation-model";


class VacationAdminService {


    public async addVacation(vacation: IVacationModel): Promise<IVacationModel> {
        const dbVacation = await vacation.save();
        return dbVacation;
    }


    public async deleteVacation(_id: string): Promise<void> {
        const dbVacation = await VacationModel.findByIdAndDelete(_id).exec();
        if (!dbVacation) throw new ClientError(StatusCode.NotFound, `Vacation ${_id} not found.`);
    }


    public async updateVacation(vacation: IVacationModel): Promise<IVacationModel> {

        const dbVacation = await VacationModel.findByIdAndUpdate(vacation._id, vacation, { returnDocument: "after" }).exec();
        return dbVacation!;

    }

    public async getAllVacationLikes(): Promise<string[]> {

        const dbVacations = await VacationModel.aggregate<string>([
            { $project: { destination: 1, likesCount: { $size: "$likes" } } }
        ])

        return dbVacations;

    }


}

export const vacationAdminService = new VacationAdminService();
