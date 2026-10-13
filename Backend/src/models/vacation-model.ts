import { UploadedFile } from "express-fileupload";
import { Document, model, Schema, Types } from "mongoose";



export interface IVacationModel extends Document {

    _id: Types.ObjectId;
    destination: string,
    description: string,
    startAt: Date;
    finishAt: Date;
    price: number,
    image: UploadedFile,
    imageId: string,
    likes: Types.ObjectId[];
}


const trimSpaces = (value: string) => value.trim().replace(/[ \t]+/g, " ");

export const VacationSchema = new Schema<IVacationModel>({

    destination: {
        type: String,
        required: [true, "Destination is a required field."],
        set: trimSpaces,
        // English letters, single spaces between words. Checked after the setters, so "nEw   york" is stored as "new york".
        match: [/^(?=.{2,100}$)[a-zA-Z]+(?: [a-zA-Z]+)*$/, "Destination must be 2-100 english letters only."],
        lowercase: true
    },
    description: {
        type: String,
        required: [true, "Description is a required field."],
        set: trimSpaces,
        minLength: [5, "Description cannot be less than 5 chars."],
        maxLength: [300, "Description cannot be more than 300 chars."],
        lowercase: true
    },
    startAt: {
        type: Date,
        required: [true, "You must choose a starting date for the vacation."],


    },
    finishAt: {
        type: Date,
        required: [true, "You must choose an ending date for the vacation."],
        validate: {
            validator: function (value: Date) {
                const doc = this as unknown as IVacationModel;
                // Same day is allowed (a one-day trip), only an end before the start is rejected.
                return value >= doc.startAt
            },
            message: "End date cannot be before the start date.",
        }

    },
    price: {
        type: Number,
        required: [true, "Vacation must be priced."],
        min: [0, "Price cannot be lower than 0."],
        max: [10000, "Price cannot be higher than 10,000."],
    },
    imageId: {
        type: String,
        required: [true, "imageId required"]
    },

    likes: {
        type: [Schema.Types.ObjectId],
        ref: "UserModel",
        default: [],
    }
}, {
    versionKey: false,
    id: false
})

export const VacationModel = model<IVacationModel>("VacationModel", VacationSchema, "vacations");



