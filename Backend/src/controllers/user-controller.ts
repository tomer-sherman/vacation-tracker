import express, { Request, Response, Router } from "express";
import { userService } from "../services/user-service";
import { UserModel } from "../models/user-model";
import { CredentialsModel } from "../models/credentials-model";
import { StatusCode } from "../models/enums";
import { securityMiddleware } from "../middleware/security-middleware";



class UserController {


    public router: Router = express.Router();

    // Constructor - register routes:
    public constructor() {
        this.router.post("/api/register", this.register);
        this.router.post("/api/login", this.login);
       
    }

    // Get register user
    private async register(request: Request, response: Response): Promise<void> {

        const user = new UserModel(request.body);
        const jwtString = await userService.register(user);
        response.status(StatusCode.Created).json(jwtString);
    }

    private async login(request: Request, response: Response): Promise<void> {

        const credentials = new CredentialsModel(request.body);
        const jwtString = await userService.login(credentials);
        response.status(StatusCode.OK).json(jwtString);
    }

}

export const userController = new UserController();
