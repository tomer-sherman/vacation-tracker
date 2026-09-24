import { UserModel } from "../models/user-models"
import { VacationModel } from "../models/vacation-model"

export type AppState = {
    user: UserModel
    vacation: VacationModel[]
}