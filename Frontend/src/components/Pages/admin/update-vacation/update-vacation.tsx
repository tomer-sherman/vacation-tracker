import { useForm } from "react-hook-form";
import "./update-vacation.css";
import { VacationFormModel, vacationValidation } from "../../../../models/vacation-model";
import { vacationService } from "../../../../services/vacation-service";
import { notify } from "../../../../utils/notify";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { appConfig } from "../../../../utils/app-config";

export function UpdateVacation() {
    const { register, handleSubmit, reset, setValues, watch, formState: { errors } } = useForm<VacationFormModel>();
    const navigate = useNavigate();
    const params = useParams();
    const _id = params._id;
    const [preview, setPreview] = useState<string>();
    const [imageId, setImageId] = useState<string>();

    // Show a preview of the chosen image, falls back to the current image.
    const imageFiles = watch("image") as unknown as FileList | undefined;
    useEffect(() => {
        const file = imageFiles?.[0];
        if (!file) return setPreview(undefined);
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [imageFiles]);

    useEffect(() => {

        vacationService.getOneVacation(_id!)
            .then(vacation => {
                setValues({
                    ...vacation,
                    startAt: toInputDate(vacation.startAt),
                    finishAt: toInputDate(vacation.finishAt)
                });
                setImageId(vacation.imageId);
            })
            .catch(err => {
                notify.error(err)
                if (err.response?.status === 404) navigate("/vacations")
            }
            )


    }, [])

    function toInputDate(date: string): string {

        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const inputDate = `${year}-${month}-${day}`;
        return inputDate

    }



    async function send(vacation: VacationFormModel) {

        // Only if a new image comes, Then set the new image.
        if (vacation.image) vacation.image = (vacation.image as unknown as FileList)[0];

        vacationService.updateVacation(vacation, _id!)
            .then(() => {
                notify.success("Vacation updated.");
                reset();
                navigate("/vacations")

            })
            .catch(err => {

                notify.error(err.message);
            });

    }
    return (
        <div className="UpdateVacation">


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


                <label>Image:</label>
                <div className="imagePreview">{(preview || imageId) && <img src={preview ?? appConfig.vacPictureUrl + imageId} alt="Image preview" />}</div>
                <label className="imageUploadButton">
                    Select Image
                    <input type="file" accept="image/*" hidden {...register("image")} />
                </label>


                <label>Price:</label>
                <input type="number" {...register("price", vacationValidation.price)} ></input>
                {errors.price?.message && <span className="error">{errors.price?.message}</span>}



                <button>Update vacation</button>
            </form>

            <button onClick={()=> navigate("/vacations")}>Back</button>

        </div>
    );
}
