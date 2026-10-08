import { useForm } from "react-hook-form";
import "./add-vacation-page.css";
import { VacationFormModel, vacationValidation } from "../../../../models/vacation-model";
import { vacationService } from "../../../../services/vacation-service";
import { notify } from "../../../../utils/notify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useVacations } from "../../../vacations-area/use-vacations/use-vacations";

export function AddVacationPage() {
    // Prevents strange duplications.
    useVacations();
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<VacationFormModel>();
    const navigate = useNavigate();
    const [preview, setPreview] = useState<string>();

    // Show a preview of the chosen image.
    const imageFiles = watch("image") as unknown as FileList | undefined;
    useEffect(() => {
        const file = imageFiles?.[0];
        if (!file) return setPreview(undefined);
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [imageFiles]);

    async function send(vacation: VacationFormModel) {

        vacation.image = (vacation.image as unknown as FileList)[0];

        console.log(vacation.image);

        vacationService.addVacation(vacation)
            .then(() => {
                notify.success("Vacation added.");
                reset();
            })
            .catch(err => notify.error(err));

    }

    return (
        <div className="AddVacationPage">

            <form onSubmit={handleSubmit(send)}>
                <label>Destination name:</label>
                <input type="text" {...register("destination", vacationValidation.destination)} ></input>
                {errors.destination?.message && <span className="error">{errors.destination?.message}</span>}

                <label>Description:</label>
                <input type="textarea" {...register("description")} />


                <label>Starting date</label>
                <input type="date" {...register("startAt", vacationValidation.startAt)}></input>
                {errors.startAt?.message && <span className="error">{errors.startAt?.message}</span>}



                <label>Ending date</label>
                <input type="date" {...register("finishAt", vacationValidation.finishAt)}></input>
                {errors.finishAt?.message && <span className="error">{errors.finishAt?.message}</span>}

                <label>Upload an image:</label>
                <div className="imagePreview">{preview && <img src={preview} alt="Image preview" />}</div>
                <label className="imageUploadButton">
                    Select Image
                    <input type="file" accept="image/*" hidden {...register("image")} />
                </label>

                <label>Price:</label>
                <input type="number" {...register("price", vacationValidation.price)} ></input>
                {errors.price?.message && <span className="error">{errors.price?.message}</span>}



                <button>Add vacation</button>
            </form>
            <button onClick={() => navigate("/vacations")}>Back</button>

        </div >
    );
}
