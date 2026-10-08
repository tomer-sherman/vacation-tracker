import { VacationFormModel } from "../models/vacation-model";

class FormUtil {

    public toFormData(vacation: VacationFormModel): FormData {

        const vacationFormData = new FormData();

        vacationFormData.append("destination", vacation.destination);
        vacationFormData.append("description", vacation.description);
        vacationFormData.append("startAt", vacation.startAt);
        vacationFormData.append("finishAt", vacation.finishAt);
        vacationFormData.append("image", vacation.image);
        vacationFormData.append("price", vacation.price.toString());

        return vacationFormData;

    }



}

export const formUtil = new FormUtil();