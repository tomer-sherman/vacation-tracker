import { RegisterOptions } from "react-hook-form";

export type RegisterFormModel = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type CredentialsModel = {
    email: string;
    password: string;
}

// Mirrors Backend/src/models/user-model.ts (UserSchema) so the client fails fast with the same messages.
// Usage: <input {...register("firstName", userValidation.firstName)} />
// `satisfies RegisterOptions` makes a typo in a rule name (e.g. "maxLenght") a compile error instead of being silently ignored.
// setValueAs trims before the rules run, like `trim: true` in the schema, so a pasted trailing space isn't an error.
export const userValidation = {

    firstName: {
        required: "First name required.",
        minLength: { value: 2, message: "First name cannot be with less than 2 chars." },
        maxLength: { value: 50, message: "Yo brah why your name so long." },
        pattern: { value: /^[a-zA-Z]*$/, message: "Your name must contain english chars only, no empty spaces." },
        setValueAs: (value: string) => value.trim(),
    },

    lastName: {
        required: "Last name required.",
        minLength: { value: 2, message: "Last name cannot be with less than 2 chars." },
        maxLength: { value: 50, message: "Yo brah why your name so long." },
        pattern: { value: /^[a-zA-Z]*$/, message: "Your last name must contain english chars only, no empty spaces." },
        setValueAs: (value: string) => value.trim(),
    },

    // Uniqueness is NOT checked here - the front has no way to know what's in the db.
    // The backend checks it in userService.register (isEmailTaken -> 409), the `unique: true` index on UserSchema.email is the backup.
    email: {
        required: "Email is required.",
        pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email." },
        setValueAs: (value: string) => value.trim(),
    },

    password: {
        required: "Password is required.",
        pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{4,100}$/,
            message: "Password must be 4-100 chars with lowercase, uppercase and a number.",
        },
    },

} satisfies Record<keyof RegisterFormModel, RegisterOptions<RegisterFormModel>>;

// Mirrors Backend/src/models/credentials-model.ts (CredentialsSchema).
// Login only checks the format, the server answers a wrong email or password with "Incorrect email or password.".
export const credentialsValidation = {

    email: userValidation.email,

    password: {
        required: "Password is required.",
        minLength: { value: 4, message: "Password must be at least 4 chars." },
        maxLength: { value: 100, message: "Password can't exceed 100 chars." },
    },

} satisfies Record<keyof CredentialsModel, RegisterOptions<CredentialsModel>>;

export type UserModel = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role

}

export enum Role {
    User = "user",
    Admin = "admin"
}
