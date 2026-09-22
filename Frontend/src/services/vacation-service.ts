import axios from "axios";
import { VacationModel } from "../models/vacation-model";
import { appConfig } from "../utils/app-config";


class VacationService {

    // User services
    public async getAllVacations(): Promise<VacationModel[]> {

        const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl);
        const vacations = response.data;

        return vacations;

    }

    public async getOneVacation(vacationId: string): Promise<VacationModel> {

        const response = await axios.get<VacationModel>(appConfig.vacationsUrl + vacationId);
        const vacation = response.data;

        return vacation;
    }

    public async likeVacation(vacationId: string): Promise<void> {
        await axios.post(appConfig.likeVacationUrl + vacationId);
    }

    public async unLikeVacation(vacationId: string): Promise<void> {
        await axios.post(appConfig.unlikeVacationUrl + vacationId);
    }




    // Admin services
    public async addVacation(vacation: VacationModel): Promise<VacationModel> {
        const response = await axios.post<VacationModel>(appConfig.vacationsUrl, vacation);
        const dbVacation = response.data;

        return dbVacation;
    }

    public async updateVacation(vacation: VacationModel): Promise<VacationModel> {
        const response = await axios.put<VacationModel>(appConfig.vacationsUrl + vacation._id, vacation);
        const dbVacation = response.data;

        return dbVacation;
    }

    public async deleteVacation(vacationId: string): Promise<void> {
        await axios.delete(appConfig.vacationsUrl + vacationId);
    }

}

export const vacationService = new VacationService();