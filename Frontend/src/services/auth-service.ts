import { CredentialsModel, RegisterFormModel, UserModel } from "../models/user-models";
import axios from "axios"
import { appConfig } from "../utils/app-config";
import { jwtDecode } from "jwt-decode";
import { userSlice } from "../redux/user-slice";
import { store } from "../redux/store";


class AuthService {

    public constructor() {

        const token = localStorage.getItem("auth-token");

        if (token) {
            const dbUser = this.decodeJwt(token);
            this.storeGlobalUser(dbUser);
        }

    }

    public async register(form: RegisterFormModel): Promise<string> {
        // Browse to api.
        const response = await axios.post<string>(appConfig.registerUrl, form);
        const jwt = response.data;

        // Store in local storage and init global state.
        localStorage.setItem("auth-token", jwt);
        const user = this.decodeJwt(jwt);
        this.storeGlobalUser(user);

        return jwt;


    }


    public async login(credentials: CredentialsModel): Promise<string> {
        // Browse to api.
        const response = await axios.post<string>(appConfig.loginUrl, credentials);
        const jwt = response.data;

        // Store in local storage and init global state.
        localStorage.setItem("auth-token", jwt);
        const user = this.decodeJwt(jwt);
        this.storeGlobalUser(user);

        return jwt;
    }

    public logout(): void {

        // Remove token from local storage and remove from global state.
        localStorage.removeItem("auth-token");
        const action = userSlice.actions.logoutUser();
        store.dispatch(action);
    }





    // Inner methods maybe a waste of lines who knows
    private decodeJwt(jwt: string): UserModel {
        const user = jwtDecode<{ user: UserModel }>(jwt).user;
        return user;
    }

    private storeGlobalUser(user: UserModel): void {
        const action = userSlice.actions.initUser(user);
        store.dispatch(action);
    }


}

export const authService = new AuthService();
