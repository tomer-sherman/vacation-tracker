import { NextFunction, Request, Response } from "express";
import { appConfig } from "../utils/app-config";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import colors from "colors";



class ErrorMiddleware {

    // Route Not Found Middleware:
    public routeNotFound(request: Request, response: Response, next: NextFunction): void {
        const err = new ClientError(StatusCode.NotFound, `Route ${request.originalUrl} on method ${request.method} not found.`);
        next(err);
    }

    // Catch-All Middleware:
    public catchAll(err: any, request: Request, response: Response, next: NextFunction): void {


        const status = err.status || StatusCode.InternalServerError;
        const isServerError = status >= 500 && status <= 599;
        const message = isServerError && appConfig.isProduction ? "Something went wrong please try again later." : err.message;

        err instanceof ClientError ? ClientError.logError(err) : console.log(colors.red(err));


        response.status(status).json(message);
    }

}

export const errorMiddleware = new ErrorMiddleware();
