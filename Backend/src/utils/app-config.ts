import dotenv from "dotenv"; // npm install dotenv

// Loads .env values into: process.env object:
dotenv.config({ quiet: true });

class AppConfig {
    // Port
    public readonly port = 4000;

    // Enviorment
    public readonly environment = process.env.ENVIRONMENT!;
    public readonly isDevelopment = this.environment === "development";
    public readonly isProduction = this.environment === "production";

    // Db connection
    public readonly mongoConnectionString = process.env.MONGO_CONNECTION_STRING!;

    // Security 
    public readonly jwtSecret = process.env.JWT_SECRET!;
    public readonly hashSalt = process.env.HASH_SALT!;
    public readonly recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY!;


    // Keys
    public readonly openaiApiKey = process.env.OPENAI_API_KEY!;

    //Ngrok url
    public readonly ngrokUrl = process.env.NGROK_URL!;
}

export const appConfig = new AppConfig();
