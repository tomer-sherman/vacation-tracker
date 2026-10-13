import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { mcpTools } from "./mcp-tools";
import z from "zod";

class McpRegister {

    public registerGetAllVacations(mcpServer: McpServer): void {
        console.log("Using get all tool.")!
        const name = "get_all_vacations";
        const config = {
            description: "Get all data base vacations."
        }

        mcpServer.registerTool(name, config, mcpTools.getAllVacationTool);
    }

    public registerGetOneVacation(mcpServer: McpServer): void {
        console.log("Using get one tool!")
        const name = "get_one_vacation";
        const config = {
            description: "Get one vacation data by id.",
            inputSchema: z.object({ _id: z.string() })
        }

        mcpServer.registerTool(name, config, mcpTools.getOneVacationTool)
    }


}

export const mcpRegister = new McpRegister();
