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

export const VacationSchema = new Schema<IVacationModel>({

    destination: {
        type: String,
        required: [true, "Destination is a required field."],
        match: [/^(?=.{2,100}$)[a-zA-Z]+(?: [a-zA-Z]+)*$/, "Destination must be 2-100 English letters."],
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        set: (value: string) => value.trim().replace(/[ \t]+/g, " "),
        minLength: [5, "Description cannot be less then 5 chars."],
        maxLength: [300, "Description cannot be more then 300 chars."],
        lowercase: true
    },
    startAt: {
        type: Date,
        required: [true, "You must choose a starting date for the vacation."],


    },
    finishAt: {
        type: Date,
        required: [true, " You must choose a ending date for the vacation."],
        validate: {
            validator: function (value: Date) {
                const doc = this as unknown as IVacationModel;
                return value > doc.startAt
            },
            message: "End date must be after the start date.",
        }

    },
    price: {
        type: Number,
        required: [true, "Vacation must be priced."],
        min: [0, "Price cannot be lower than 0."],
        max: [99999, "Price cannot be higher than 99,999"],
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



