
import OpenAi from "openai"
import { appConfig } from "../utils/app-config";
import { promptHolder } from "../utils/prompt-holder";
import { AiResponse } from "../models/ai-recommendation-model";

import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";

class AiService {

    private openai = new OpenAi({
        apiKey: appConfig.openaiApiKey
    })

    public async getMcpCompletion(prompt: string): Promise<string> {

        const response = await this.openai.responses.create({
            model: "gpt-4o-mini",
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


    public async getAiRecommendation(userPrompt: string): Promise<AiResponse> {


        const promptToSend =
            "systemPrompt: " + promptHolder.systemPrompt + "\n"
        "instructions: " + promptHolder.instructions + "\n"
        "userQuestion: " + userPrompt + "\n"
        "security instructions: " + promptHolder.securityCheck; + "\n"

        "Your answer : ";

        const completion = await this.getMcpCompletion(promptToSend);
        const aiResponse = this.parseAiRecommendation(completion);
        return aiResponse;

    }

    private parseAiRecommendation(completion: string): AiResponse {

        const aiResponse: AiResponse = JSON.parse(completion);
        return aiResponse;
    }


}

export const aiService = new AiService();