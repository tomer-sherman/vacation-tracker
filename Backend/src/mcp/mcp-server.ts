import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { mcpRegister } from "./mcp-register";

class VacationMcpServer {

    public create(): McpServer {

        const mcpServer = new McpServer({
            name: "vacation-mcp-server",
            version: "1.0.0"
        });

        //register Tools:
        mcpRegister.registerGetAllVacations(mcpServer);
        mcpRegister.registerGetOneVacation(mcpServer);
        mcpRegister.registerGetVacationsByStatus(mcpServer);

        return mcpServer;

    }

}

export const vacationMcpServer = new VacationMcpServer();
