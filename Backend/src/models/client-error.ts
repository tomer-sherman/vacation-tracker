import { Document } from "mongoose";
import { StatusCode } from "./enums";
import colors from "colors";


export class ClientError {

    public readonly status: StatusCode;
    public readonly message: string;

    public constructor(status: StatusCode, message: string, dataToLogResponse?: string[], dataToResponse?: string[], dataToLog?: string[]) {
        this.status = status;
        this.message = message;
    }

    public static async validateDocument(document: Document): Promise<void> {
        try {
            await document.validate({ pathsToSkip: ["imageId"] });
        }
        catch (err: any) {
            throw new ClientError(StatusCode.UnprocessableContent, err.message);
        }
    }

    public static validateStartDate(startDate: Date): void {
        const now = new Date();
        const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
        if (startDate < today) throw new ClientError(StatusCode.UnprocessableContent, "Start date cannot be in the past.");
        return
    }


    // Logging
    public static logError(err: ClientError) {
        const line = "─".repeat(60);
        const status = err.status;
        const message = err.message;

        console.log();
        console.log(colors.red(line));
        console.log(colors.yellow.bold("Status:        ") + status);
        console.log(colors.red("Message: " + message))
        console.log(colors.red(line));
        console.log();

    }

}

