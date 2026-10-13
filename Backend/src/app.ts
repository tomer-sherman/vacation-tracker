import cors from "cors";
import express from "express";
import expressFileUpload from "express-fileupload";
import path from "path";
import { saver } from "smart-saver";
import { userController } from "./controllers/user-controller";
import { errorMiddleware } from "./middleware/error-middleware";
import { securityMiddleware } from "./middleware/security-middleware";
import { appConfig } from "./utils/app-config";
import mongoose from "mongoose";
import { vacationController } from "./controllers/vacation-controller";
import { vacationAdminController } from "./controllers/vacation-admin-controller";
import { vacationMcpServer } from "./mcp/mcp-server";
import { aiController } from "./controllers/ai-controller";
import { sseHandlers } from "express-mcp-handler";
import { loggerMiddleware } from "./middleware/logger-middleware";

class App {

    public async start(): Promise<void> {

        // Connect to mongoDb:
        await mongoose.connect(appConfig.mongoConnectionString);

        // Create our server object:
        const server = express();

        //Connect mcp:
        const mspController = sseHandlers(() => vacationMcpServer.create(), {});
        
        // System middleware:
        securityMiddleware.registerRateLimit(server);
        securityMiddleware.headerProtection(server);
        server.use(cors());
        server.use(express.json());
        server.use(expressFileUpload());

        server.use(securityMiddleware.preventXss);

        // Logger middleware:
        server.use(loggerMiddleware.logToConsole);

        // Register controllers:
        server.use(userController.router);
        server.use(vacationController.router);
        server.use(vacationAdminController.router);
        server.use(aiController.router);

        // Mcp Routes
        server.get("/sse", securityMiddleware.verifyLogin  ,mspController.getHandler);
        server.post("/messages", securityMiddleware.verifyLogin , mspController.postHandler);



        // Register "after" middleware:
        server.use(errorMiddleware.routeNotFound)
        server.use(errorMiddleware.catchAll);

        // Run server:
        server.listen(appConfig.port, () => console.log("Listening..."));
    }

}

const app = new App();
app.start();


