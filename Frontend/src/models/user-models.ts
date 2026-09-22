

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
// Typed as RegisterOptions so a typo in a rule name (e.g. "maxLenght") is a compile error instead of being silently ignored.
export const userValidation = {

    firstName: {
        required: "First name required.",
        minLength: { value: 2, message: "First name cannot be with less than 2 chars." },
        maxLength: { value: 50, message: "Yo brah why your name so long." },
        pattern: { value: /^[a-zA-Z]*$/, message: "Your name must contain english chars only." },
    },

    lastName: {
        required: "Last name required.",
        minLength: { value: 2, message: "Last name cannot be with less than 2 chars." },
        maxLength: { value: 50, message: "Yo brah why your name so long." },
        pattern: { value: /^[a-zA-Z]*$/, message: "Your last name must contain english chars only, the first char must be uppercase." },
    },

    // Uniqueness is NOT checked here - the front has no way to know what's in the db.
    // The backend enforces it via the `unique: true` index on UserSchema.email.
    email: {
        required: "Email is required.",
        pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
    },

    password: {
        required: "Password is required.",
        pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{4,100}$/,
            message: "Password must be 4-100 chars with lowercase, uppercase and a number.",
        },
    },

}

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
