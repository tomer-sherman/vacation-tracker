import axios from "axios";
import { appConfig } from "../utils/app-config";
import { Prompt } from "../components/Pages/ask-mcp-page/ask-mcp-page";

class AiService {

    public async getMcpCompletion(prompt: Prompt): Promise<string> {

        console.log(prompt)
        const response = await axios.post<string>(appConfig.mcpAskUrl, prompt);
        const completion = response.data;

        return completion;
    }


}

export const aiService = new AiService();