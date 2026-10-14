import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { mcpTools } from "./mcp-tools";
import z from "zod";
import { VacationStatus } from "../models/enums";

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

    public registerGetVacationsByStatus(mcpServer: McpServer): void {
        const name = "get_vacations_by_status";
        const config = {
            // The ai picks a tool by its description, so it says exactly when to use it:
            description: "Get the vacations that are active now, upcoming (not started yet) or ended. Use this for any question about which vacations are active, ongoing, upcoming, future, ended or past.",
            inputSchema: z.object({ status: z.enum(VacationStatus) })
        }

        mcpServer.registerTool(name, config, mcpTools.getVacationsByStatusTool);
    }


}

export const mcpRegister = new McpRegister();
