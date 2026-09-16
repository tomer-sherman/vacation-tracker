import mongoose from "mongoose";
import colors from "colors";

class MongoErrorLogger {

    private readonly line = "─".repeat(60);

    public logValidationError(err: mongoose.Error.ValidationError) {

        const status = "400";
        const type = "Validation error";

        // One line per failed field (e.g. "destination: Path `destination` is required.").
        // Falls back to the raw message when no per-field details exist:
        const details = err.errors
            ? Object.values(err.errors).map(fieldErr => `${fieldErr.path}: ${fieldErr.message}`)
            : [err.message];

        console.log();
        console.log(colors.red(this.line));
        console.log(colors.yellow.bold("Status:        " + status));
        console.log(colors.red.bold("Error Type:    " + type));
        console.log(colors.red("Error Message:"));
        for (const detail of details) {
            console.log(colors.red("  • " + detail));
        }
        console.log(colors.red(this.line));
        console.log();

        
    }

    public logDuplicateKeyError(err: mongoose.mongo.MongoServerError): void {

        if (err.code !== 11000) {
            throw new Error("Wrong error undentification |" + 11000 + "| Initially, yet it is " + err.code);
        };

        const code = err.code!;
        const codeName = "Duplicate Key Error";
        const keyPattern = err.keyPattern
            ? Object.entries(err.keyPattern).map(([key, value]) => `${key}: ${value}`) : [];
        const keyValue = err.keyValue
            ? Object.entries(err.keyValue).map(([key, value]) => `${key}: ${value}`) : [];

        const message = err.message!.split(" collection:")[0];
        const collectionName = err.message!.split("collection: ")[1].split(" index")[0];


        console.log();
        console.log(colors.red(this.line));
        console.log(colors.yellow.bold("Status:        ") + "409");
        console.log(colors.yellow.bold("Mongo Status:  ") + code);
        console.log(colors.red.bold("Error type:    " + codeName));
        console.log(colors.red("Error Message: " + message));
        console.log(colors.red("Collection:    " + collectionName));


        for (const field of keyPattern) {
            console.log(colors.red("  • " + field));
        }

        for (const field of keyValue) {
            console.log(colors.red("  • " + field));
        }

        console.log(colors.red(this.line));
        console.log();

    };

    public logCastError(err: mongoose.Error.CastError) {

        const status = "400";
        const errorType = err.name;
        const field = err.path;
        const valueType = typeof err.value;
        const message = err.message;

         console.log();
        console.log(colors.red(this.line));
        console.log(colors.yellow.bold("Status:        ") + status);
        console.log(colors.red.bold("Error type:    " + errorType));
        console.log(colors.red("Field: " + field));
        console.log(colors.red("Value type:    " + valueType));
        console.log(colors.red("Message: " + message))
        console.log(colors.red(this.line));
        console.log();


    }



}

export const mongoErrorLogger = new MongoErrorLogger();
