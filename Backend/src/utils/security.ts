import crypto from "crypto"
import { appConfig } from "./app-config";
import { IUserModel } from "../models/user-model";
import jwt, { SignOptions } from "jsonwebtoken";
import { Role } from "../models/enums";

class Security {

    // Hashes the password
    public hashPassword(plainString: string): string {

        const hashPass = crypto.createHmac("sha512", appConfig.hashSalt).update(plainString).digest("hex");
        return hashPass;

    }

    // generates jwt token
    public generateJwt(user: IUserModel): string {

        user.password = undefined!;

        const payload = { user };

        const options: SignOptions = { expiresIn: "1h" };

        const token = jwt.sign(payload, appConfig.jwtSecret, options);

        return token;

    }

    // Verifies the token, with the jwt secret
    public verifyJwtToken(token: string): boolean {

        try {
            if (!token) {
                return false
            }
            jwt.verify(token, appConfig.jwtSecret);
            return true;
        }
        catch (err: any) {
            return false;
        }

    }

    // Checks whether the user is an admin,
    public isAdmin(token: string): boolean {


        if (!this.verifyJwtToken(token)) return false;

        const payload = jwt.decode(token) as { user: IUserModel };
        const user = payload.user;

        if (user.role !== Role.Admin) return false;

        return true;

    }



}

export const security = new Security();