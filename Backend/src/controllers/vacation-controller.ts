import express, { Request, Response, Router } from "express";
import { vacationService } from "../services/vacation-service";
import { securityMiddleware } from "../middleware/security-middleware";
import { AuthRequest } from "../models/user-model";
import { StatusCode } from "../models/enums";



class VacationController {

    public router: Router = express.Router();

    public constructor() {
        this.router.get("/api/vacations", securityMiddleware.verifyLogin, this.getAllVacations);
        this.router.get("/api/vacations/:_id", securityMiddleware.verifyLogin, this.getOneVacation);
        this.router.post("/api/vacations/like/:_id", securityMiddleware.verifyLogin, this.likeVacation)
        this.router.post("/api/vacations/unlike/:_id", securityMiddleware.verifyLogin, this.unlikeVacation)
    }

    private async getAllVacations(request: Request, response: Response): Promise<void> {


        const userId = (request as AuthRequest).user._id.toString();

        const vacations = await vacationService.getAllVacations(userId);
        response.json(vacations);

    }

    private async getOneVacation(request: Request, response: Response): Promise<void> {

        const _id = request.params._id as string;
        const vacations = await vacationService.getOneVacation(_id);
        response.json(vacations);

    }

    private async likeVacation(request: Request, response: Response): Promise<void> {

        const userId = (request as AuthRequest).user._id.toString();
        const vacationId = request.params._id as string; // UNdefiened need to find out why.
        await vacationService.like(userId, vacationId);
        response.status(StatusCode.NoContent).json();

    }

    private async unlikeVacation(request: Request, response: Response): Promise<void> {

        const userId = (request as AuthRequest).user._id.toString();
        const vacationId = request.params._id as string;
        await vacationService.unLike(userId, vacationId);
        response.status(StatusCode.NoContent).json();

    }






}

export const vacationController = new VacationController();