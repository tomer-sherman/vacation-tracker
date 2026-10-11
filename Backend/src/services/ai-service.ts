
import OpenAi from "openai"
import { appConfig } from "../utils/app-config";
import { promptHolder } from "../utils/prompt-holder";
import { AiRecommendationModel, AiResponse } from "../models/ai-recommendation-model";

import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";

class AiService {

    private openai = new OpenAi({
        apiKey: appConfig.openaiApiKey
    })

    // Ask AI page - the rules go in "instructions" (the system message), the user's question stays separate in "input":
    public async getMcpCompletion(userQuestion: string): Promise<string> {
        return this.getCompletion(userQuestion, promptHolder.mcpInstructions);
    }

    private async getCompletion(prompt: string, instructions?: string): Promise<string> {

        const response = await this.openai.responses.create({
            model: "gpt-4o-mini",
            instructions,
            input: prompt,

            tools: [{
                type: "mcp",
                server_label: "vacation-mcp-server",
                server_description: "A mcp server that externelizes a list of vacations.",
                server_url: "https://timothy-sulfate-hatbox.ngrok-free.dev/sse",
                require_approval: "never",
            }]
        });

        const completion = response.output_text;
        return completion;

    }


    public async getAiRecommendation(userPrompt: string): Promise<AiRecommendationModel> {

        // "userQuestion" must match the key name the prompts refer to.
        const promptToSend =
            "systemPrompt: " + promptHolder.systemPrompt + "\n" +
            "instructions: " + promptHolder.instructions + "\n" +
            "userQuestion: " + userPrompt + "\n" +
            "security instructions: " + promptHolder.securityCheck + "\n" +
            "Your answer : ";

        const completion = await this.getCompletion(promptToSend);
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


}

export const aiService = new AiService();