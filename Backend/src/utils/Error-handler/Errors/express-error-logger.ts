
import colors from "colors"

class ExpressErrorLogger {

    private readonly line = "─".repeat(60);

    public logMalformedJsonError(err: SyntaxError) {

        const status = "400";
        const errorType = "Malformed JSON body";
        const message = err.message;
        const body = "body" in err ? String(err.body) : ""

        console.log();
        console.log(colors.red(this.line));
        console.log(colors.yellow.bold("Status:        " + status));
        console.log(colors.red.bold("Error Type:    " + errorType));
        console.log(colors.red("Error Message: " + message));
        console.log(colors.red("Body: " + body));
        console.log(colors.red(this.line));
        console.log();

    }

    
}

export const expressErrorLogger = new ExpressErrorLogger();