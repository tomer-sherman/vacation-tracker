
import { mongoErrorLogger } from "./Errors/mongo-error-logger";
import mongoose from "mongoose";
import { expressErrorLogger } from "./Errors/express-error-logger";
import { ClientError } from "./models/client-error";
import { clientErrorLogger } from "./Errors/client-error-logger";
import { StatusCode } from "./models/enum";

export function logError(err: any): void {
    switch (true) {

        case err instanceof ClientError:
            clientErrorLogger.logClientError(err);
            break;

        case err instanceof SyntaxError && "type" in err && err.type === "entity.parse.failed":
            expressErrorLogger.logMalformedJsonError(err);
            break;

        case err instanceof mongoose.Error.ValidationError:
            mongoErrorLogger.logValidationError(err);
            break;

        case err instanceof mongoose.Error.CastError:
            mongoErrorLogger.logCastError(err);
            break;

        case err instanceof mongoose.mongo.MongoServerError && err.code === 11000:
            mongoErrorLogger.logDuplicateKeyError(err);
            break;

        default:

            console.log(err);
            clientErrorLogger.logClientError(new ClientError(StatusCode.InternalServerError , `This error is not handled By this library, The error object is above COPY PASTE TO GPT AND GOOD LUCK!!!  \n MESSAGE: ${err.message ? err.message : "undefiend"} `));

            break;
    }
}