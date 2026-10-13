import { RegisterOptions } from "react-hook-form";
import { dateUtil } from "../utils/date-util";

export type VacationModel = {
    _id: string;
    destination: string;
    description: string;
    startAt: string;
    finishAt: string;
    price: number;
    image: File;
    imageId: string
    likeCount?: number;
    isLiked?: boolean;
};

export type LikedVacations = {
    destination: string,
    likeCount: number
}

const trimSpaces = (value: string) => value.trim().replace(/[ \t]+/g, " ");

// Mirrors Backend/src/models/vacation-model.ts (VacationSchema) so the client fails fast with the same messages.
// Usage: <input {...register("destination", vacationValidation.destination)} />
// `satisfies RegisterOptions` makes a typo in a rule name a compile error, same as userValidation.
export const vacationValidation = {

    // English letters, single spaces between words, any case: "New York" and "nEw   york" both pass, the backend stores "new york".
    destination: {
        required: "Destination is a required field.",
        pattern: { value: /^(?=.{2,100}$)[a-zA-Z]+(?: [a-zA-Z]+)*$/, message: "Destination must be 2-100 english letters only." },
        setValueAs: trimSpaces,
    },

    description: {
        required: "Description is a required field.",
        minLength: { value: 5, message: "Description cannot be less than 5 chars." },
        maxLength: { value: 300, message: "Description cannot be more than 300 chars." },
        setValueAs: trimSpaces,
    },

   
    startAt: {
        required: "You must choose a starting date for the vacation.",
        deps: "finishAt",
    },

    finishAt: {
        required: "You must choose an ending date for the vacation.",
        validate: {
            notBeforeStart: (value: string, form: VacationModel) => value >= form.startAt || "End date cannot be before the start date.",
        },
    },

    price: {
        required: "Vacation must be priced.",
        valueAsNumber: true,
        min: { value: 0, message: "Price cannot be lower than 0." },
        max: { value: 10000, message: "Price cannot be higher than 10,000." },
    },

} satisfies { [K in keyof VacationModel]?: RegisterOptions<VacationModel, K> };

// Add only, UpdateVacation uses vacationValidation: an existing vacation can keep (or be edited to) past dates.
// Mirrors the past-date check in vacationAdminService.addVacation.
export const addVacationValidation = {

    ...vacationValidation,

    // The end date needs no check of its own: it can't be before the start date, so it can't be in the past either.
    startAt: {
        ...vacationValidation.startAt,
        validate: { notPast: (value: string) => value >= dateUtil.todayInputDate() || "Start date cannot be in the past." },
    },

    // On edit no new image keeps the current one.
    image: {
        required: "You must choose an image.",
    },

} satisfies { [K in keyof VacationModel]?: RegisterOptions<VacationModel, K> };
