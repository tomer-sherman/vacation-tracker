import express, { Request, Response, Router } from "express";
import { aiService } from "../services/ai-service";
import { securityMiddleware } from "../middleware/security-middleware";




class AiController {


    public router: Router = express.Router();

    // Constructor - register routes:
    public constructor() {
        this.router.post("/api/mcp/ask", securityMiddleware.verifyLogin, this.getMcpCompletion);
        this.router.post("/api/ai/recommendation", securityMiddleware.verifyLogin, this.getAiRecommendation);

    }


    private async getMcpCompletion(request: Request, response: Response): Promise<void> {
        console.log(request.body);
        const userPrompt = request.body.text as string;
        const completion = await aiService.getMcpCompletion(userPrompt);
        response.json(completion);



    }
    private async getAiRecommendation(request: Request, response: Response): Promise<void> {

        const userPrompt = request.body.text as string;
        const recommendation = await aiService.getAiRecommendation(userPrompt);

        response.json(recommendation);
    }






}

export const aiController = new AiController();
