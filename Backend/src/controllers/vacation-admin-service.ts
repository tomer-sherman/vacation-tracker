import express, { Request, Response, Router } from "express";
import { securityMiddleware } from "../middleware/security-middleware";
import { StatusCode } from "error-color-logger";
import { VacationModel } from "../models/vacation-model";
import { vacationAdminService } from "../services/vacation-admin-service";


class VacationAdminController {

    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/vacations", securityMiddleware.verifyAdmin, this.addVacation);
        this.router.get("/api/admin/likes", securityMiddleware.verifyAdmin, this.getAllVacationLikes);
            this.router.put("/api/vacations/:_id",  this.updateVacation);
        this.router.delete("/api/vacations/:_id",  this.deleteVacation);
        this.router.get("/api/test-error", ()=> {throw new Error("Test Catch All.")})


    }

    public async addVacation(request: Request, response: Response): Promise<void> {

        const vacation = new VacationModel(request.body);
        const dbVacation = await vacationAdminService.addVacation(vacation);
        response.status(StatusCode.Created).json(dbVacation);

    }

    public async updateVacation(request: Request, response: Response): Promise<void> {

        //Extract id too the Body:
        request.body._id = request.params._id.toString();
        const vacation = new VacationModel(request.body);
        const dbVacation = await vacationAdminService.updateVacation(vacation);
        
        response.json(dbVacation);

    }

    public async deleteVacation(request: Request, response: Response): Promise<void> {

        const _id = request.params._id as string;
        await vacationAdminService.deleteVacation(_id);
        response.status(StatusCode.NoContent).json();

    }

    public async getAllVacationLikes(request: Request, response: Response): Promise<void> {

        const vacationsWithLikes = await vacationAdminService.getAllVacationLikes();
        response.json(vacationsWithLikes);


    }








}

export const vacationAdminController = new VacationAdminController();