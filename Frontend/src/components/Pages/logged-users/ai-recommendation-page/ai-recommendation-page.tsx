
import "./ai-recommendation-page.css";
import { ChangeEvent, useState } from "react";
import { notify } from "../../../../utils/notify";
import { aiService } from "../../../../services/ai-service";
import { AiRecommendationModel } from "../../../../models/ai-recommendation-model";
import { useVacations } from "../../../vacations-area/use-vacations/use-vacations";
import { AiCompletion } from "./ai-completion";


export function AiRecommendationPage() {

    const { vacations } = useVacations();
    const [destinations, setDestinations] = useState<string[] | undefined>([]);
    const [completion, setCompletion] = useState<AiRecommendationModel>();
    const [loading, setLoading] = useState<boolean>(false);


    const [query, setQuery] = useState<string>("");



    // An empty value matches every destination (startsWith("") is always true), so focusing an empty input lists them all.
    function filterDestinations(value: string) {

        const filtered = vacations?.filter(v => v.destination.toLocaleLowerCase().startsWith(value.toLocaleLowerCase()))
            .map(v => v.destination)

        setDestinations(filtered);

    }

    function handleChange(args: ChangeEvent<HTMLInputElement>) {

        const value = args.target.value;
        setQuery(value);
        filterDestinations(value);

    }



    async function send(e: React.FormEvent<HTMLFormElement>) {
        // Prevents the page from reloading since i do not use a react-hook-form here.
        e.preventDefault();
        setLoading(true)

        // The request below already holds the current query, so clearing the input (and its suggestions) is safe.
        setQuery("");
        setDestinations([]);

        aiService.getAiRecommendation({ text: query })
            .then(completion => setCompletion(completion))
            .catch(err => notify.error(err))
            .finally(() => setLoading(false));

    }




    return (
        <div className="AiRecommendationPage">
            <label>Choose a destination for Ai recommendation:</label>

            <form onSubmit={send} >

                {/* required blocks an empty destination, maxLength matches the backend's 300 chars */}
                <input value={query} onChange={handleChange} onFocus={() => filterDestinations(query)} required maxLength={300} />

                {destinations && destinations.length > 0 && (
                    <ul className="suggestions">
                        {destinations.map((d, i) => (
                            <li key={i} onClick={() => setQuery(d)}>{d}</li>
                        ))}
                    </ul>
                )}
                
                {/* disabled blocks clicks and Enter while a request is running, aria-busy tells CSS to show the spinner */}
                <button disabled={loading} aria-busy={loading}>Get Ai Recomendation.</button>

            </form>

            {completion && <AiCompletion {...completion} />}


        </div>
    );
}
