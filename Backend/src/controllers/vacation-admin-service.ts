import express, { Request, Response, Router } from "express";
import { securityMiddleware } from "../middleware/security-middleware";
import { StatusCode } from "../models/enums";
import { VacationModel } from "../models/vacation-model";
import { vacationAdminService } from "../services/vacation-admin-service";
import { UploadedFile } from "express-fileupload";
import { verify } from "node:crypto";



class VacationAdminController {

    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/vacations", securityMiddleware.verifyAdmin, this.addVacation);
        this.router.put("/api/vacations/:_id", securityMiddleware.verifyAdmin, this.updateVacation);
        this.router.delete("/api/vacations/:_id", securityMiddleware.verifyAdmin, this.deleteVacation);
    }

    public async addVacation(request: Request, response: Response): Promise<void> {

        const vacation = new VacationModel(request.body);

        vacation.image = request.files?.image as UploadedFile;

        const dbVacation = await vacationAdminService.addVacation(vacation);
        response.status(StatusCode.Created).json(dbVacation);

    }

    public async updateVacation(request: Request, response: Response): Promise<void> {

        //Extract id too the Body:
        request.body._id = request.params._id.toString();
        const vacation = new VacationModel(request.body);

        // Construct an extra field, Since the vacationModel does not handle this image field.
        vacation.image = request.files?.image as UploadedFile;

        const dbVacation = await vacationAdminService.updateVacation(vacation);
        response.json(dbVacation);

    }

    public async deleteVacation(request: Request, response: Response): Promise<void> {

        const _id = request.params._id as string;
        await vacationAdminService.deleteVacation(_id);
        response.status(StatusCode.NoContent).json();

    }

}

export const vacationAdminController = new VacationAdminController();