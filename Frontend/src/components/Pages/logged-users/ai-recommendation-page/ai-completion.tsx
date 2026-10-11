import { AiRecommendationModel } from "../../../../models/ai-recommendation-model";


export function AiCompletion(props: AiRecommendationModel) {

    function formatDate(date: string) {
        return new Date(date).toLocaleDateString();
    }

    return (
        <article className="AiCompletion">

            <header className="ai-header">
                <span className="ai-destination">{props.destination}</span>
                <h2 className="ai-title">{props.title}</h2>
                <p className="ai-summary">{props.summary}</p>
            </header>

            {props.sections.length > 0 &&
                <div className="ai-sections">
                    {props.sections.map((section, i) => (
                        <section key={i} className="ai-section">
                            <h3>{section.title}</h3>
                            <p>{section.description}</p>

                            {section.highlights.length > 0 &&
                                <ul className="ai-highlights">
                                    {section.highlights.map((highlight, j) => (
                                        <li key={j} className="ai-highlight">
                                            <strong>{highlight.name}</strong>
                                            <span>{highlight.description}</span>
                                        </li>
                                    ))}
                                </ul>
                            }
                        </section>
                    ))}
                </div>
            }

            {props.tips.length > 0 &&
                <section className="ai-tips">
                    <h3>Travel Tips</h3>
                    <ul>
                        {props.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                </section>
            }

            <section className="ai-matching">
                <h3>Available On Our Site</h3>

                {props.existsOnSite && props.matchingVacations.length > 0
                    ? <ul className="ai-vacations">
                        {props.matchingVacations.map(vacation => (
                            <li key={vacation._id} className="ai-vacation">
                                <span className="ai-vacation-destination">{vacation.destination}</span>
                                <span className="ai-vacation-dates">
                                    {formatDate(vacation.startAt)} - {formatDate(vacation.finishAt)}
                                </span>
                                <span className="ai-vacation-price">${vacation.price.toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                    : <p className="ai-no-match">We don't have vacations to {props.destination} yet.</p>
                }
            </section>

            {props.notice &&
                <footer className="ai-notice">
                    <small>{props.notice}</small>
                </footer>
            }

        </article>
    );
}
