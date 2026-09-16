import { ClientError, errorColorLogger, StatusCode } from "error-color-logger";
import { mongoErrorLogger } from "./mongo-error-logger";
import mongoose from "mongoose";
import { expressErrorLogger } from "./express-error-logger";

export function logError(err: any): void {
    switch (true) {

        case err instanceof SyntaxError && "type" in err && err.type === "entity.parse.failed":
            expressErrorLogger.logMalformedJsonError(err);
            break;

        case err instanceof ClientError:
            errorColorLogger.logError(err);
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
            errorColorLogger.logError(new ClientError(StatusCode.InternalServerError, `This error is not handled By this library, The error object is above COPY PASTE TO GPT AND GOOD LUCK!!!  \n MESSAGE: ${err.message ? err.message : "undefiend"} `));

            break;
    }
}