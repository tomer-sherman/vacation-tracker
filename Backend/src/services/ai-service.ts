
import OpenAi from "openai"
import { appConfig } from "../utils/app-config";
import { promptHolder } from "../utils/prompt-holder";
import { AiRecommendationModel, AiResponse } from "../models/ai-recommendation-model";

import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { PromptModel } from "../models/prompt-model";

class AiService {

    // The key
    private openai = new OpenAi({
        apiKey: appConfig.openaiApiKey

    })

    // Gets the ask mcp page Completion.
    public async getMcpAnswer(prompt: PromptModel, authorization: string): Promise<string> {

        // Validates the prompt.
        prompt.validate();

        // Uses the askOpenAi func to send an mcp request.
        const completion = await this.askOpenAi(prompt.text, authorization, promptHolder.askAiInstructions);

        return completion;
    }

    // Gets the recomendation completion json.
    public async getAiRecommendation(prompt: PromptModel, authorization: string): Promise<AiRecommendationModel> {

        // Validates the prompt
        prompt.validate();

        // Uses the same askOpenAi mcp request to send a request for the ai.
        const completion = await this.askOpenAi(prompt.text, authorization, promptHolder.recommendationInstructions);
        
        // parses the ai response into a obj type.
        const aiResponse = this.parseAiRecommendation(completion);

        // Off topic user prompt brings a different response.
        if ("offTopic" in aiResponse) throw new ClientError(StatusCode.BadRequest, aiResponse.message);

        return aiResponse;

    }

    // Parses the 
    private parseAiRecommendation(completion: string): AiResponse {

        // Trims the unececery text using regex.
        const json = completion.trim().replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");

        // parses the text json into an ai response.
        const aiResponse: AiResponse = JSON.parse(json);
        return aiResponse;
    }



    // Every singe Ai from my server goes throughout this function, the only difference is the system prompt. which is the instructions which can be changed.
    private async askOpenAi(prompt: string, authorization: string, instructions: string): Promise<string> {

        const response = await this.openai.responses.create({
            model: "gpt-4o-mini",
            
            // Injected time too the intructions, In each request the ai will have time.
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