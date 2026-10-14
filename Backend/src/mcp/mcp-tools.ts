import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol";
import { CallToolResult, ServerNotification, ServerRequest } from "@modelcontextprotocol/sdk/types";
import jwt from "jsonwebtoken";
import { IUserModel } from "../models/user-model";
import { VacationStatus } from "../models/enums";
import { vacationService } from "../services/vacation-service";

class McpTools {

    // No inputSchema, so the only argument is "extra" - holds the headers of the request openai sent to /messages:
    public async getAllVacationTool(extra: RequestHandlerExtra<ServerRequest, ServerNotification>): Promise<CallToolResult> {

        // Same token the user sent us, verifyLogin on /messages already checked it:
        const auth = extra.requestInfo?.headers.authorization as string; // "Bearer the-token...";
        const token = auth.substring(7);
        const payload = jwt.decode(token) as { user: IUserModel };
        const userId = payload.user._id.toString();

        const vacations = await vacationService.getAllVacations(userId);
        const result: CallToolResult = {
            content: [{
                type: "text",
                text: JSON.stringify(vacations)
            }]
        }

        return result;


    }

    // Has an inputSchema, so "args" comes first (the status the ai asked for) and "extra" second:
    public async getVacationsByStatusTool(args: { status: VacationStatus }, extra: RequestHandlerExtra<ServerRequest, ServerNotification>): Promise<CallToolResult> {

        // Same token reading as getAllVacationTool, needed for isLiked:
        const auth = extra.requestInfo?.headers.authorization as string; // "Bearer the-token...";
        const token = auth.substring(7);
        const payload = jwt.decode(token) as { user: IUserModel };
        const userId = payload.user._id.toString();

        const vacations = await vacationService.getVacationsByStatus(userId, args.status);
        const result: CallToolResult = {
            content: [{
                type: "text",
                text: JSON.stringify(vacations)
            }]
        }

        return result;
    }

    public async getOneVacationTool(args: { _id: string }): Promise<CallToolResult> {
        const vacation = await vacationService.getOneVacation(args._id);
        const result: CallToolResult = {
            content: [{
                type: "text",
                text: JSON.stringify(vacation)
            }]
        }

        return result;
    }


}

export const mcpTools = new McpTools();
