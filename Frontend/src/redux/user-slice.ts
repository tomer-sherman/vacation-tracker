import { UserModel } from "../models/user-models";
import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit"


function initUser(_currentState: UserModel, action: PayloadAction<UserModel>): UserModel {

    const userToInit = action.payload;
    const newState = userToInit;
    return newState;

}

function logoutUser(_currentState: UserModel, action: Action): UserModel {
    return null!;
}

export const userSlice = createSlice({
    name: "user-slice",
    initialState: null! as UserModel,
    reducers: { initUser, logoutUser }
})