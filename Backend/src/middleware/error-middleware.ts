import { NextFunction, Request, Response } from "express";
import { appConfig } from "../utils/app-config";
import { ClientError } from "../utils/Error-handler/models/client-error";
import { StatusCode } from "../utils/Error-handler/models/enum";
import { mongoErrorLogger } from "../utils/Error-handler/Errors/mongo-error-logger";
import mongoose from "mongoose";
import { any } from "zod";
import { logError } from "../utils/Error-handler/error-log";
import { extractErrMessageStatus } from "../utils/Error-handler/message-status-extract";


class ErrorMiddleware {

    // Route Not Found Middleware:
    public routeNotFound(request: Request, response: Response, next: NextFunction): void {
        const err = new ClientError(StatusCode.NotFound, `Route ${request.originalUrl} on method ${request.method} not found.`);
        next(err);
    }

    // Catch-All Middleware:
    public catchAll(err: any, request: Request, response: Response, next: NextFunction): void {

        // Take status:
        logError(err);

        // Extract Status and message:
        const extractedError = extractErrMessageStatus(err);
        if (!extractedError) response.status(StatusCode.InternalServerError).json(`${appConfig.isDevelopment ? "Extractor failed" : "Sorry something went wrong pls Try again later."}`);

        const status = extractedError?.status!;
        const message = extractedError?.message!;

        // Return back error:
        response.status(status).json(message);
    }

}

export const errorMiddleware = new ErrorMiddleware();
