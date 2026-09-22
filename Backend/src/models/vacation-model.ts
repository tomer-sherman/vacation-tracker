import { Document, model, Schema, Types } from "mongoose";



export interface IVacationModel extends Document {

    _id: Types.ObjectId;
    destination: string,
    startAt: Date;
    finishAt: Date;
    price: number,
    fileName: string,
    likes: Types.ObjectId[];
}

export const VacationSchema = new Schema<IVacationModel>({

    destination: {
        type: String,
        required: [true, "Destination is a required field."],
        match: [/^(?=.{2,100})[A-Z][a-z]+$/, "Destination name must contain only english letters between 2-100, first chat must be uppercase."],
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
    likes: {
        type: [Schema.Types.ObjectId],
        ref: "UserModel",
        default: [],
    }
}, {
    versionKey: false,
    id: false
})

export const VacationModel = model<IVacationModel>("VacationModel", VacationSchema, "holidays");


export type VacationView = {
    _id: Types.ObjectId;
    destination: string;
    startAt: Date;
    finishAt: Date;
    price: number;
    likeCount: number;
    isLiked: boolean;
};
