import { useSelector } from "react-redux";
import "./ai-recommendation-page.css";
import { AppState } from "../../../redux/app-state";
import { VacationModel } from "../../../models/vacation-model";
import { useForm } from "react-hook-form";
import { Prompt } from "../ask-mcp-page/ask-mcp-page";
import { ChangeEvent, useState } from "react";
import { UserModel } from "../../../models/user-models";
import { useNavigate } from "react-router-dom";
import { notify } from "../../../utils/notify";
import { aiService } from "../../../services/ai-service";
import { VacationRecommendation } from "../../../models/ai-recommendation-model";


export function AiRecommendationPage() {

    const vacations = useSelector<AppState, VacationModel[] | null>(state => state.vacation);
    const [destinations, setDestinations] = useState<string[] | undefined>([]);
    const { register, handleSubmit } = useForm<Prompt>();
    const [completion, setCompletion] = useState<VacationRecommendation>();
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const user = useSelector<AppState, UserModel | null>(state => state.user);
    if (!user) {
        navigate("/login")
        notify.error("You are not a logged in user.")
    }

    function handleChange(args: ChangeEvent<HTMLInputElement>) {
        const queryValue = args.target.value;
        console.log(queryValue);

        const regex = new RegExp("^" + queryValue, "i");

        const filteredDestinations = vacations?.filter(v => regex.test(v.destination)).map(v => v.destination);
        setDestinations(filteredDestinations);

    }



    async function send(prompt: Prompt) {

        console.log(prompt);

        setLoading(true);
        aiService.getAiRecommendation(prompt)
            .then(completion => setCompletion(completion))
            .catch(err => notify.error(err))
            .finally(() => setLoading(false));

    }




    return (
        <div className="AiRecommendationPage">
            <label>Choose a destination for Ai recommendation:</label>
            <input type="text" onChange={handleChange} ></input>

            <form onSubmit={handleSubmit(send)}>
                
                <select>
                    {destinations?.map((d, index) => <option key={index} {...register("text")} >{d}</option>)}
                </select>

                <button>Submit Your destination</button>
            </form>


            {loading && <span> AI IS THINKING!!!!!!</span>}


        </div>
    );
}
