import express, { Request, Response, Router } from "express";
import { vacationService } from "../services/vacation-service";
import { securityMiddleware } from "../middleware/security-middleware";
import { AuthRequest } from "../models/user-model";
import { StatusCode } from "../models/enums";



class VacationController {

    public router: Router = express.Router();

    public constructor() {
        this.router.get("/api/vacations", this.getAllVacations);
        this.router.get("/api/vacations/:_id", this.getOneVacation);
        this.router.post("/api/vacations/like/:_id", this.likeVacation)
        this.router.post("/api/vacations/unlike/:_id", this.unlikeVacation)
    }

    private async getAllVacations(request: Request, response: Response): Promise<void> {

        const vacations = await vacationService.getAllVacations();
        response.json(vacations);

    }

    private async getOneVacation(request: Request, response: Response): Promise<void> {

        const _id = request.params._id as string;
        const vacations = await vacationService.getOneVacation(_id);
        response.json(vacations);

    }

    private async likeVacation(request: Request, response: Response): Promise<void> {

        const userId = (request as AuthRequest).user._id.toString();
        const vacationId = request.params._id as string;
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