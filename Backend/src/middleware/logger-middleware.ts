import { NextFunction, Request, Response } from "express";
import colors from "colors";


let imageRouteLogged = false;

class LoggerMiddleware {


    // Pass-Through Middleware:
    public logToConsole(request: Request, response: Response, next: NextFunction): void {
        const method = request.method;
        const route = request.originalUrl;

        // Log image requests once per batch - the frontend fetches one per vacation card:
        if(method === "GET" && route.startsWith("/api/images/")){
            if(!imageRouteLogged) {
                console.log(colors.green("GET /api/images/:imageId | fetching vacation images"));
                imageRouteLogged = true;
                setTimeout(() => imageRouteLogged = false, 300); // Allow logging the next batch
            }
            next();
            return;
        }

        const body = request.body ? JSON.stringify(request.body) : null;
        console.log(colors.green(`${method} ${route} | body: ${body}`));
        next(); // Continue to next middleware / controller
    }

}

export const loggerMiddleware = new LoggerMiddleware();
