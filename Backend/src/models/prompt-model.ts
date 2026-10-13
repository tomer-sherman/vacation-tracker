import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Prompt Schema - the text both AI pages send:
// .trim() before .min(1) blocks a question made only of spaces, .max() caps what we pay openai for.
const PromptSchema = z.object({
    text: z.string({ error: "Please type a question." }).trim().min(1, "Please type a question.").max(300, "Please keep it under 300 characters.")
});

// Prompt Interface (I = Interface):
type IPromptModel = z.infer<typeof PromptSchema>;

export class PromptModel implements IPromptModel {

    public text: string;

    public constructor(prompt: PromptModel) {
        this.text = prompt.text;
    }

    public validate(): void {
        const result = PromptSchema.safeParse(this);
        if (!result.success) throw new ClientError(StatusCode.UnprocessableContent, result.error.issues[0].message);

        // Keep the trimmed text, no point sending openai extra spaces.
        this.text = result.data.text;
    }
}
