import "./ask-mcp-page.css";
import { useState } from "react";
import { notify } from "../../../../utils/notify";
import { aiService } from "../../../../services/ai-service";


export type Prompt = {
    text: string
}

export function AskMcpPage() {

    const [loading, setLoading] = useState<boolean>(false);


    const [completion, setCompletion] = useState<string>("");
    const [text, setText] = useState<string>("");


    async function send(e: React.FormEvent<HTMLFormElement>) {
        // Prevents the page from reloading since i do not use a react-hook-form here.
        e.preventDefault();

        try {
            setLoading(true);

            // The request below already holds the current text, so clearing the textarea is safe.
            setText("");

            const completion = await aiService.getMcpCompletion({ text });
            setCompletion(completion);
            console.log(completion);



        } catch (err: any) {
            notify.error(err)
        } finally {
            setLoading(false);
        }



    }

    return (
        <div className="AskMcpPage">

            <h1>Ask ai any question regarding our vacations and you will get acurate answers. </h1>


            <form onSubmit={send}>
                <label>Ask AI</label>
                {/* required blocks an empty question, maxLength matches the backend's 300 chars */}
                <textarea value={text} onChange={e => setText(e.target.value)} required maxLength={300}></textarea>

                {/* disabled blocks clicks and Enter while a request is running, aria-busy tells CSS to show the spinner */}
                <button disabled={loading} aria-busy={loading}>Send</button>
            </form>

            <p>{completion}</p>


        </div >
    );
}
