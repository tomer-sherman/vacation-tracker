import { CredentialsModel, RegisterFormModel } from "../models/user-models";
import axios from "axios"
import { appConfig } from "../utils/app-config";


class AuthService {

    public async register(form: RegisterFormModel): Promise<string> {

        const response = await axios.post<string>(appConfig.registerUrl, form);
        const jwt = response.data;

        // and the global state.
        localStorage.setItem("auth-token", jwt);

        return jwt;


    }


    public async login(credentials: CredentialsModel): Promise<string> {

        const response = await axios.post<string>(appConfig.loginUrl, credentials);
        const jwt = response.data;

        localStorage.setItem("auth-token", jwt);

        return jwt;
    }

    public async logout(): Promise<void> {

        //Remove from local Storage the token
        //Set global state var to null

    }


}

export const authService = new AuthService();
