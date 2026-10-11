import { VacationFilter } from "../models/enums";
import { VacationModel } from "../models/vacation-model";

export function filterVacations(vacations: VacationModel[], filter: VacationFilter) {

    const now = new Date();
    switch (filter) {
        case VacationFilter.Liked:
            return vacations.filter(v => v.isLiked);
        case VacationFilter.Active:
            return vacations.filter(v => now >= new Date(v.startAt) && now <= new Date(v.finishAt));
        case VacationFilter.NotStarted:
            return vacations.filter(v => now < new Date(v.startAt));
        default:
            return vacations;
    }
}