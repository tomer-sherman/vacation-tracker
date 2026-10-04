import axios from "axios";
import { VacationFormModel, VacationModel } from "../models/vacation-model";
import { appConfig } from "../utils/app-config";
import { vacationSlice } from "../redux/vacation-slice";
import { store } from "../redux/store";


class VacationService {

    // User services
    public async getAllVacations(): Promise<VacationModel[]> {

        // Fetch from global state if exist:
        if (store.getState().vacation.length > 0) return store.getState().vacation;


        const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl);
        const vacations = response.data;

        // Store in global state
        const action = vacationSlice.actions.initVacations(vacations);
        store.dispatch(action);

        return vacations;

    }

    public async getOneVacation(vacationId: string): Promise<VacationModel> {

        const response = await axios.get<VacationModel>(appConfig.vacationsUrl + vacationId);
        const vacation = response.data;

        return vacation;
    }

    public async likeVacation(vacationId: string): Promise<void> {
        await axios.post(appConfig.likeVacationUrl + vacationId);
        const action = vacationSlice.actions.likeVacation(vacationId);
        store.dispatch(action);
    }

    public async unLikeVacation(vacationId: string): Promise<void> {
        await axios.post(appConfig.unlikeVacationUrl + vacationId);
        const action = vacationSlice.actions.unlikeVacation(vacationId);
        store.dispatch(action);

    }




    // Admin services
    public async addVacation(vacation: VacationFormModel): Promise<VacationModel> {
        const response = await axios.post<VacationModel>(appConfig.vacationsUrl, vacation);
        const dbVacation = response.data;

        const action = vacationSlice.actions.addVacation(dbVacation);
        store.dispatch(action);

        return dbVacation;
    }

    public async updateVacation(vacation: VacationModel): Promise<VacationModel> {
        const response = await axios.put<VacationModel>(appConfig.vacationsUrl + vacation._id, vacation);
        const dbVacation = response.data;

        const action = vacationSlice.actions.updateVacation(dbVacation);
        store.dispatch(action);

        return dbVacation;
    }

    public async deleteVacation(vacationId: string): Promise<void> {
        await axios.delete(appConfig.vacationsUrl + vacationId);

        const action = vacationSlice.actions.removeVacation(vacationId);
        store.dispatch(action);
    }

}

export const vacationService = new VacationService();