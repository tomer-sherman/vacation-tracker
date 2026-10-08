// Routes ending with "/" expect the vacation _id appended by the caller.

class AppConfig {

    private readonly baseUrl = "http://localhost:4000";
    private readonly apiUrl = this.baseUrl + "/api";

    // ---------- Auth ----------
    public readonly registerUrl = this.apiUrl + "/register";                // POST | Public
    public readonly loginUrl = this.apiUrl + "/login";                      // POST | Public

    // ---------- Vacations ----------
    public readonly vacationsUrl = this.apiUrl + "/vacations/";             // GET | User, GET /:_id | User, POST | Admin, PUT /:_id | Admin, DELETE /:_id | Admin
    public readonly likeVacationUrl = this.apiUrl + "/vacations/like/";     // POST /:_id | User
    public readonly unlikeVacationUrl = this.apiUrl + "/vacations/unlike/"; // POST /:_id | User
    public readonly vacPictureUrl = this.apiUrl + "/images/"                // GET /:_id 
    // ---------- Admin ----------
    public readonly adminLikesUrl = this.apiUrl + "/admin/likes";           // GET | Admin

    // ---------- AI ----------
    public readonly mcpAskUrl = this.apiUrl + "/mcp/ask";                   // POST | User
    public readonly aiRecommendationUrl = this.apiUrl + "/ai/recommendation"; // POST | User

    // ---------- Keys ----------
    public readonly recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
}

export const appConfig = new AppConfig();
