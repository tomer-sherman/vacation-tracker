import { useSelector } from "react-redux";
import "./ai-recommendation-page.css";
import { AppState } from "../../../redux/app-state";
import { VacationModel } from "../../../models/vacation-model";
import { ChangeEvent, useState } from "react";
import { notify } from "../../../utils/notify";
import { aiService } from "../../../services/ai-service";
import { VacationRecommendation } from "../../../models/ai-recommendation-model";


export function AiRecommendationPage() {

    const vacations = useSelector<AppState, VacationModel[] | null>(state => state.vacation);
    const [destinations, setDestinations] = useState<string[] | undefined>([]);
    const [completion, setCompletion] = useState<VacationRecommendation>();
    const [loading, setLoading] = useState<boolean>(false);

    const [query, setQuery] = useState<string>("");



    function handleChange(args: ChangeEvent<HTMLInputElement>) {

        const value = args.target.value;
        setQuery(value);

        const filtered = vacations?.filter(v => v.destination.toLocaleLowerCase().startsWith(value.toLocaleLowerCase()))
            .map(v => v.destination)

        setDestinations(filtered);

    }



    async function send(e: React.FormEvent<HTMLFormElement>) {
        // Prevents the page from reloading since i do not use a react-hook-form here.
        e.preventDefault();

        setLoading(true);
        aiService.getAiRecommendation({ text: query })
            .then(completion => setCompletion(completion))
            .catch(err => notify.error(err))
            .finally(() => setLoading(false));

    }




    return (
        <div className="AiRecommendationPage">
            <label>Choose a destination for Ai recommendation:</label>

            <form onSubmit={send} >

                <input value={query} onChange={handleChange} />

                {destinations && destinations.length > 0 && (
                    <ul className="suggestions">
                        {destinations.map((d, i) => (
                            <li key={i} onClick={() => setQuery(d)}>{d}</li>
                        ))}
                    </ul>
                )}
                <button>Get Ai Recomendation.</button>

            </form>

            {loading && <span> AI IS THINKING!!!!!!</span>}


        </div>
    );
}
