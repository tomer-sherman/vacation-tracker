import { useForm } from "react-hook-form";
import "./add-vacation-page.css";
import { VacationModel, addVacationValidation } from "../../../../models/vacation-model";
import { dateUtil } from "../../../../utils/date-util";
import { vacationService } from "../../../../services/vacation-service";
import { notify } from "../../../../utils/notify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useVacations } from "../../../vacations-area/use-vacations/use-vacations";

export function AddVacationPage() {
    // Prevents strange duplications.
    useVacations();
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<VacationModel>();
    const navigate = useNavigate();
    const [preview, setPreview] = useState<string>();

    // The date inputs' min greys out past days in the picker. The error messages come from addVacationValidation,
    // which is why the form has noValidate (otherwise the browser shows its own popup for min first).
    const today = dateUtil.todayInputDate();

    // Show a preview of the chosen image.
    const imageFiles = watch("image") as unknown as FileList | undefined;
    useEffect(() => {
        const file = imageFiles?.[0];
        if (!file) return setPreview(undefined);
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [imageFiles]);

    async function send(vacation: VacationModel) {

        vacation.image = (vacation.image as unknown as FileList)[0];

        console.log(vacation.image);

        vacationService.addVacation(vacation)
            .then(() => {
                notify.success("Vacation added.");
                reset();
                navigate("/vacations")
            })
            .catch(err => notify.error(err));

    }

    return (
        <div className="AddVacationPage">

            <form onSubmit={handleSubmit(send)} noValidate>
                <label>Destination name:</label>
                <input type="text" {...register("destination", addVacationValidation.destination)} ></input>
                {errors.destination?.message && <span className="error">{errors.destination?.message}</span>}

                <label>Description:</label>
                <input type="textarea" {...register("description", addVacationValidation.description)} />
                {errors.description?.message && <span className="error">{errors.description?.message}</span>}

                <label>Starting date</label>
                <input type="date" min={today} {...register("startAt", addVacationValidation.startAt)}></input>
                {errors.startAt?.message && <span className="error">{errors.startAt?.message}</span>}



                <label>Ending date</label>
                <input type="date" min={today} {...register("finishAt", addVacationValidation.finishAt)}></input>
                {errors.finishAt?.message && <span className="error">{errors.finishAt?.message}</span>}

                <label>Upload an image:</label>
                <div className="imagePreview">{preview && <img src={preview} alt="Image preview" />}</div>
                <label className="imageUploadButton">
                    Select Image
                    <input type="file" accept="image/*" hidden {...register("image", addVacationValidation.image)} />
                </label>
                {errors.image?.message && <span className="error">{errors.image?.message}</span>}

                <label>Price:</label>
                <input type="number" {...register("price", addVacationValidation.price)} ></input>
                {errors.price?.message && <span className="error">{errors.price?.message}</span>}



                <button>Add vacation</button>
            </form>
            <button onClick={() => navigate("/vacations")}>Back</button>

        </div >
    );
}
