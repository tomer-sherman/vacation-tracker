import express, { Request, Response, Router } from "express";
import { aiService } from "../services/ai-service";
import { securityMiddleware } from "../middleware/security-middleware";
import { PromptModel } from "../models/prompt-model";




class AiController {


    public router: Router = express.Router();

    // Constructor - register routes:
    public constructor() {
        this.router.post("/api/mcp/ask", securityMiddleware.verifyLogin, this.getMcpCompletion);
        this.router.post("/api/ai/recommendation", securityMiddleware.verifyLogin, this.getAiRecommendation);

    }


    private async getMcpCompletion(request: Request, response: Response): Promise<void> {
        console.log(request.body);
        const prompt = new PromptModel(request.body);
        // verifyLogin already checked it, forwarded so openai can pass it to our mcp routes:
        const jwtToken = request.headers.authorization!;
        const completion = await aiService.getMcpAnswer(prompt, jwtToken);
        response.json(completion);



    }
    private async getAiRecommendation(request: Request, response: Response): Promise<void> {

        const prompt = new PromptModel(request.body);
        const authorization = request.headers.authorization!;
        const recommendation = await aiService.getAiRecommendation(prompt, authorization);

        response.json(recommendation);
    }






}

export const aiController = new AiController();
