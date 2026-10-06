
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { VacationModel } from "../models/vacation-model";


function initVacations(_currentState: VacationModel[], action: PayloadAction<VacationModel[]>): VacationModel[] {

    const vacationsToInit = action.payload;
    const newState = vacationsToInit;
    return newState;

}

function addVacation(currentState: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[] {

    const vacationToAdd = action.payload;
    const newState = [...currentState, vacationToAdd];
    return newState;

}

function removeVacation(currentState: VacationModel[], action: PayloadAction<string>): VacationModel[] {

    const idToDelete = action.payload;
    const state = [...currentState];

    const newState = state.filter(v => v._id !== idToDelete);

    return newState;

};

function updateVacation(currentState: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[] {

    const vacToUpdate = action.payload;
    const state = [...currentState];
    const newState = state.map(v => v._id === vacToUpdate._id ? vacToUpdate : v);

    return newState;

}

function likeVacation(currentState: VacationModel[], action: PayloadAction<string>): VacationModel[] {

    const idToLike = action.payload;
    const state = [...currentState];


    const newState = state.map(v => v._id === idToLike ?
        { ...v, isLiked: true, likeCount: v.likeCount! + 1 } : v)

    return newState;
}

function unlikeVacation(currentState: VacationModel[], action: PayloadAction<string>): VacationModel[] {

    const idToLike = action.payload;
    const state = [...currentState];


    const newState = state.map(v => v._id === idToLike ?
        { ...v, isLiked: false, likeCount: v.likeCount! - 1 } : v)

    return newState;
}


export const vacationSlice = createSlice({
    name: "vacation-slice",
    initialState: [] as VacationModel[],
    reducers: { initVacations, addVacation, removeVacation, updateVacation, likeVacation, unlikeVacation }
})