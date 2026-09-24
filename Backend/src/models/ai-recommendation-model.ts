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

export type AiOffTopicModel = {
    offTopic: true;
    message: string;
};

export type AiResponse = AiRecommendationModel | AiOffTopicModel;
