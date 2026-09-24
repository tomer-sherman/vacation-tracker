type Highlight = {
    name: string;
    description: string;
};

type Section = {
    title: string;
    description: string;
    highlights: Highlight[];
};

type MatchingVacation = {
    _id: string;
    destination: string;
    startAt: string;
    finishAt: string;
    price: number;
};

export type VacationRecommendation = {
    destination: string;
    title: string;
    summary: string;
    sections: Section[];
    tips: string[];
    matchingVacations: MatchingVacation[];
    existsOnSite: boolean;
    notice: string;
};