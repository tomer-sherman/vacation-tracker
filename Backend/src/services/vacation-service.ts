import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { VacationModel, IVacationModel } from "../models/vacation-model";


class VacationService {

    public async getAllVacations(): Promise<IVacationModel[]> {

        const dbVacations = await VacationModel.find().exec() as IVacationModel[];
        return dbVacations;

    }

    public async getOneVacation(_id: string): Promise<IVacationModel> {

        const dbVacation = await VacationModel.findById(_id).exec() as IVacationModel;
        if (!dbVacation) throw new ClientError(StatusCode.NotFound, `The vacation you are trying to find does not exist.`)
        return dbVacation;


    }

    public async like(userId: string, vacationId: string): Promise<void> {

        const vacationToLike = await VacationModel.findByIdAndUpdate(vacationId,
            { $addToSet: { likes: userId } },
            { returnDocument: "after" }
        ).exec();

        if (!vacationToLike) throw new ClientError(StatusCode.NotFound, "The vacation you are trying to like does not exist.");

    }

     public async unLike(userId: string, vacationId: string): Promise<void> {

        const vacationToLike = await VacationModel.findByIdAndUpdate(vacationId,
            { $pull: { likes: userId } },
            { returnDocument: "after" }
        ).exec();

        if (!vacationToLike) throw new ClientError(StatusCode.NotFound, "The vacation you are trying to like does not exist.");

    }


}

export const vacationService = new VacationService();
