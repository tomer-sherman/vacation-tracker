export type VacationModel = {
    _id: string;
    destination: string;
    startAt: string;
    finishAt: string;
    price: number;
    likeCount: number;
    isLiked: boolean;
};

export type VacationFormModel = {
    destination: string;
    startAt: string;
    finishAt: string;
    price: number;
};

// Mirrors Backend/src/models/vacation-model.ts (VacationSchema) so the client fails fast with the same messages.
// Usage: <input {...register("destination", vacationValidation.destination)} />
export const vacationValidation = {

    // The backend regex allows ONE capitalized english word, so "Paris" passes but "New York" does not.
    destination: {
        required: "Destination is a required field.",
        pattern: {
            value: /^(?=.{2,100})[A-Z][a-z]+$/,
            message: "Destination name must contain only english letters between 2-100, first char must be uppercase.",
        },
    },

    startAt: {
        required: "You must choose a starting date for the vacation.",
    },

    finishAt: {
        required: "You must choose a ending date for the vacation."
    },

    // valueAsNumber so the backend receives a number and not the input's string.
    price: {
        required: "Vacation must be priced.",
        valueAsNumber: true,
        min: { value: 0, message: "Price cannot be lower than 0." },
        max: { value: 99999, message: "Price cannot be higher than 99,999" },
    },

}
