// Keep in sync with Backend/src/models/ai-recommendation-model.ts
// (the backend turns the offTopic answer into a 400, so the frontend only ever receives AiRecommendationModel).

export type Highlight = {
    name: string;
    description: string;
};

export type Section = {
    title: string;
    description: string;
    highlights: Highlight[];
};

export type MatchingVacation = {
    _id: string;
    destination: string;
    startAt: string;
    finishAt: string;
    price: number;
};

export type AiRecommendationModel = {
    destination: string;
    title: string;
    summary: string;
    sections: Section[];
    tips: string[];
    matchingVacations: MatchingVacation[];
    existsOnSite: boolean;
    notice: string;
};
