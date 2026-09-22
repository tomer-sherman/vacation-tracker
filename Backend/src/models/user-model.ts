
import { Document, model, Schema, Types } from "mongoose";
import { Role } from "./enums";
import { security } from "../utils/security";
import { Request } from "express";

export interface IUserModel extends Document {

    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;

}

export const UserSchema = new Schema<IUserModel>({

    firstName: {
        type: String,
        required: [true, "First name required"],
        minLength: [2, "First name cannot be with less than 2 chars."],
        maxLength: [50, "Yo brah why your name so long"],
        match: [/^[a-z]*$/, "Your name must contain english chars only, no empty spaces."],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "First name required"],
        minLength: [2, "First name cannot be with less than 2 chars."],
        maxLength: [50, "Yo brah why your name so long"],
        match: [/^[a-z]*$/, "Your last name must contain english chars only."],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{4,100}$/,
            "Password must be 4-100 chars with lowercase, uppercase and a number",
        ]
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.User
    }
}, {
    versionKey: false,
    id: false // Don't dup the _id to id.
})

// on save func, check if the password is clean if clean return.
UserSchema.pre("save", async function () {
    // IF THE FIELD IS CLEAN!!! RETURN do not execute
    // Clean meaning, already saved in the db
    // Not clean meaning modified = true,
    // Meaning if its a new user then !modified returns false. casue modified = true in this case
    if (!this.isModified("password")) return;
    this.password = security.hashPassword(this.password);
})

export const UserModel = model<IUserModel>("UserModel", UserSchema, "users");

// Credentials.
export type CredentialsModel = {
    email: string;
    password: string;
}

// User request type , used only when you need some of the users properties.
export type AuthRequest = Request & { user: IUserModel };