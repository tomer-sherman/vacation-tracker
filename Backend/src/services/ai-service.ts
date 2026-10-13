
import OpenAi from "openai"
import { appConfig } from "../utils/app-config";
import { promptHolder } from "../utils/prompt-holder";
import { AiRecommendationModel, AiResponse } from "../models/ai-recommendation-model";

import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { PromptModel } from "../models/prompt-model";

class AiService {

    private openai = new OpenAi({
        apiKey: appConfig.openaiApiKey

    })

    // Ask AI page - the rules go in "instructions" (the system message), the user's question stays separate in "input":
    public async getMcpAnswer(prompt: PromptModel, authorization: string): Promise<string> {

        prompt.validate();

        return this.askOpenAi(prompt.text, authorization, promptHolder.askAiInstructions);
    }

    // AI Recommendation page - same as Ask AI: the rules go in "instructions", the destination stays separate in "input":
    public async getAiRecommendation(prompt: PromptModel, authorization: string): Promise<AiRecommendationModel> {

        prompt.validate();

        const completion = await this.askOpenAi(prompt.text, authorization, promptHolder.recommendationInstructions);
        const aiResponse = this.parseAiRecommendation(completion);

        // Off topic isn't a recommendation, send it to the client as an error with the ai's message:
        if ("offTopic" in aiResponse) throw new ClientError(StatusCode.BadRequest, aiResponse.message);

        return aiResponse;

    }
    
    private parseAiRecommendation(completion: string): AiResponse {

        // The model sometimes wraps its json in ```json ... ``` fences despite the prompt:
        const json = completion.trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");

        const aiResponse: AiResponse = JSON.parse(json);
        return aiResponse;
    }



    // Every singe Ai from my server goes throughout this function, the only difference is the system prompt. which is the instructions which is changed.
    private async askOpenAi(prompt: string, authorization: string, instructions: string): Promise<string> {

        const response = await this.openai.responses.create({
            model: "gpt-4o-mini",
            instructions: instructions + "\nToday's date: " + new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jerusalem" }),
            input: prompt,

            tools: [{
                type: "mcp",
                server_label: "vacation-mcp-server",
                server_description: "A mcp server that externelizes a list of vacations.",
                server_url: appConfig.ngrokUrl + "/sse",
                require_approval: "never",
                headers: { Authorization: authorization }
            }]
        });

        const completion = response.output_text;
        return completion;

    }


}

export const aiService = new AiService();