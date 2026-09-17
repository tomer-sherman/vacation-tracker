import express, { Request, Response, Router } from "express";
import { userService } from "../services/user-service";
import { CredentialsModel, UserModel } from "../models/user-model";
import { StatusCode } from "../utils/Error-handler/models/enum"
import { securityMiddleware } from "../middleware/security-middleware";



class UserController {


    public router: Router = express.Router();

    // Constructor - register routes:
    public constructor() {
        this.router.post("/api/register", this.register);
        this.router.post("/api/login", this.login);
        this.router.get("/api/auth/test", securityMiddleware.verifyAdmin, this.test);
    }

    // Get register user
    private async register(request: Request, response: Response): Promise<void> {

        const user = new UserModel(request.body);
        const jwtString = await userService.register(user);
        response.status(StatusCode.Created).json(jwtString);
    }

    private async login(request: Request, response: Response): Promise<void> {

        const credentials = request.body as CredentialsModel;
        const jwtString = await userService.login(credentials);
        response.status(StatusCode.OK).json(jwtString);
    }

    private async test(request: Request, response: Response): Promise<void> {

        const sherminator = {
            hacker: true,
            pro: true
        };

        response.json(sherminator);


    }



}

export const userController = new UserController();
