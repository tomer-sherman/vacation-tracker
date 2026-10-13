import { userController } from "../controllers/user-controller";
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
        await ClientError.validateDocument(user);
        if (await this.isEmailTaken(user.email)) throw new ClientError(StatusCode.Conflict, `Email ${user.email} already in use.`);


        const dbUser = await user.save();
        const jwt = security.generateJwt(dbUser);
        return jwt;

    }

    public async login(credentials: CredentialsModel): Promise<string> {

        credentials.validate();
        
        credentials.password = security.hashPassword(credentials.password);
        const dbUserArr = await UserModel.find({ email: credentials.email, password: credentials.password }).exec() as IUserModel[];
        const dbUser = dbUserArr[0];

        if (!dbUser) throw new ClientError(StatusCode.Unauthorized, "Incorrect email or password.")

        const jwt = security.generateJwt(dbUser);
        return jwt;

    }

    private async isEmailTaken(email: string): Promise<boolean> {

        const user = await UserModel.findOne({ email }).exec();
        if (user) return true;
        return false;
    }





}

export const userService = new UserService();
