import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Credentials Schema:
// z.string() rejects objects like { "$gt": "" }, which blocks Mongo operator injection on login.
const CredentialsSchema = z.object({
    email: z.string({ error: "Email is required." }).trim().toLowerCase().regex(/^\S+@\S+\.\S+$/, "Invalid email."),
    password: z.string({ error: "Password is required." }).min(4, "Password must be at least 4 chars.").max(100, "Password can't exceed 100 chars.")
});

// Credentials Interface (I = Interface):
type ICredentialsModel = z.infer<typeof CredentialsSchema>;

export class CredentialsModel implements ICredentialsModel {

    public email: string;
    public password: string;

    public constructor(user: CredentialsModel) {
        this.email = user.email;
        this.password = user.password;
    }

    public validate(): void {
        const result = CredentialsSchema.safeParse(this);
        if (!result.success) throw new ClientError(StatusCode.UnprocessableContent, result.error.issues[0].message);

        // Keep the trimmed + lowercased email, emails are saved lowercase in the db.
        this.email = result.data.email;
    }
}
