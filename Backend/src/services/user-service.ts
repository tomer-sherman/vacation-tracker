
import { UserModel } from "../models/user-model";
import { CredentialsModel } from "../models/credentials-model";
import { IUserModel } from "../models/user-model";
import { ClientError } from "../models/client-error";
import { Role, StatusCode } from "../models/enums";
import { security } from "../utils/security";

// Logic:
class UserService {

    // Register:
    public async register(user: IUserModel): Promise<string> {
        // Convert user to admin, cause the the user can simply send is creds as admin to be registered as admin.
        user.role = Role.User;
        // Validates the user input
        await ClientError.validateDocument(user);
        if (await this.isEmailTaken(user.email)) throw new ClientError(StatusCode.Conflict, `Email ${user.email} already in use.`);

        // saves the new user in the db.
        const dbUser = await user.save();
        
        // generates a jwt token for the user, and sends it back.
        const jwt = security.generateJwt(dbUser);
        return jwt;

    }

    // login
    public async login(credentials: CredentialsModel): Promise<string> {

        // validates creds
        credentials.validate();
        
        // hashes the password using the same hasher.
        credentials.password = security.hashPassword(credentials.password);

        // Finds the user in the db by the email and db, And hands back the user obj whithin an array
        const dbUserArr = await UserModel.find({ email: credentials.email, password: credentials.password }).exec() as IUserModel[];
        const dbUser = dbUserArr[0];

        // Throws an error if the user does not exist
        if (!dbUser) throw new ClientError(StatusCode.Unauthorized, "Incorrect email or password.")
        
        // Generates jwt token and sends to the front.
        const jwt = security.generateJwt(dbUser);
        return jwt;

    }

    // Checks the db if the user is taken, Then simply returns a boolean.
    private async isEmailTaken(email: string): Promise<boolean> {

        const user = await UserModel.findOne({ email }).exec();
        if (user) return true;
        return false;
    }





}

export const userService = new UserService();
