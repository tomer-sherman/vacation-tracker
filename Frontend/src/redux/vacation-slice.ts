
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { VacationModel } from "../models/vacation-model";


function initVacations(_currentState: VacationModel[], action: PayloadAction<VacationModel[]>): VacationModel[] {

    const vacationsToInit = action.payload;
    const newState = vacationsToInit;
    return newState;

}


export const vacationSlice = createSlice({
    name: "vacation-slice",
    initialState: [] as VacationModel[],
    reducers: { initVacations }
})