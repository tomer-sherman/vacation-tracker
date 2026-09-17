import { ClientError } from "../models/client-error";
import colors from "colors";

class ClientErrorLogger {

    private readonly line = "─".repeat(60);

    public logClientError(err: ClientError) {

        const status = err.status;
        const message = err.message;

        console.log();
        console.log(colors.red(this.line));
        console.log(colors.yellow.bold("Status:        ") + status);
        console.log(colors.red("Message: " + message))
        console.log(colors.red(this.line));
        console.log();


    }




}

export const clientErrorLogger = new ClientErrorLogger();