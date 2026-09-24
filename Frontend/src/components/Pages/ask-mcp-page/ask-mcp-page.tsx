import { useForm } from "react-hook-form";
import "./ask-mcp-page.css";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/app-state";
import { UserModel } from "../../../models/user-models";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notify } from "../../../utils/notify";
import { aiService } from "../../../services/ai-service";


export type Prompt = {
    text: string
}

export function AskMcpPage() {

    const { register, handleSubmit, formState: { errors } } = useForm<Prompt>();
    const user = useSelector<AppState, UserModel | null>(state => state.user);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const [completion, setCompletion] = useState<string>("");

    useEffect(() => {

        if (!user) {
            navigate("/login");
            notify.error("You are not a logged in user.");
        }


    }, [])


    async function send(prompt: Prompt) {

        try {
            setLoading(true);
            
            const completion = await aiService.getMcpCompletion(prompt);
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


            <form onSubmit={handleSubmit(send)}>
                <label>Ask AI</label>
                <input type="text"  {...register("text", {
                    required: "This field must have something if you want to send dumb ass",
                })} ></input>
                <span className="error">{errors.text?.message}</span>
                <button>FEED ME WITH DATA!!!</button>
            </form>

            <p>{completion}</p>

            {loading && <p> AI IS CALCULATING AN ANSWER</p>}


        </div >
    );
}
