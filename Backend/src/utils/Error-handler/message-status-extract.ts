
import mongoose from "mongoose";
import { ClientError } from "./models/client-error";


export function extractErrMessageStatus(err: any): { message: string, status: number } | undefined {
    switch (true) {

        case err instanceof ClientError:
            return { status: err.status, message: err.message };


        case err instanceof SyntaxError && "type" in err && err.type === "entity.parse.failed":
            return { status: 400, message: err.message };


        case err instanceof mongoose.Error.ValidationError:
            return { status: 400, message: err.message };


        case err instanceof mongoose.Error.CastError:
            return { status: 400, message: err.message };

        case err instanceof mongoose.mongo.MongoServerError && err.code === 11000:
            return { status: 409, message: err.message };


        default:
            return { status: 500, message: "Something went wrong please try again later." }


    }






}