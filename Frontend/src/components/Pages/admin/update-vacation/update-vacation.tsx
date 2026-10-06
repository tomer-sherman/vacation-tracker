import { useForm } from "react-hook-form";
import "./update-vacation.css";
import { VacationModel, vacationValidation } from "../../../../models/vacation-model";
import { vacationService } from "../../../../services/vacation-service";
import { notify } from "../../../../utils/notify";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function UpdateVacation() {
    const { register, handleSubmit, reset, setValues, formState: { errors } } = useForm<VacationModel>();
    const navigate = useNavigate();
    const params = useParams();
    const _id = params._id;

    useEffect(() => {

        vacationService.getOneVacation(_id!)
            .then(vacation => setValues({
                ...vacation,
                startAt: toInputDate(vacation.startAt),
                finishAt: toInputDate(vacation.finishAt)
            }))
            .catch(err => notify.error(err))


    }, [])

    function toInputDate(date: string): string {

        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const inputDate = `${year}-${month}-${day}`;
        return inputDate

    }



    async function send(vacation: VacationModel) {

        console.log(vacation);

        vacationService.updateVacation(vacation)
            .then(() => {
                notify.success("Vacation added.");
                reset();
                navigate("/vacations")

            })
            .catch(err => notify.error(err));

    }
    return (
        <div className="UpdateVacation">


            <form onSubmit={handleSubmit(send)}>
                <label>Destination name:</label>
                <input type="text" {...register("destination", vacationValidation.destination)} ></input>
                {errors.destination?.message && <span className="error">{errors.destination?.message}</span>}


                <label>Starting date</label>
                <input type="date" {...register("startAt", vacationValidation.startAt)}></input>
                {errors.startAt?.message && <span className="error">{errors.destination?.message}</span>}



                <label>Ending date</label>
                <input type="date" {...register("finishAt", vacationValidation.finishAt)}></input>
                {errors.finishAt?.message && <span className="error">{errors.destination?.message}</span>}



                <label>Price:</label>
                <input type="number" {...register("price", vacationValidation.price)} ></input>
                {errors.price?.message && <span className="error">{errors.destination?.message}</span>}



                <button>Update vacation</button>
            </form>

        </div>
    );
}
