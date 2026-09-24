import { useForm } from "react-hook-form";
import "./add-vacation-page.css";
import { VacationFormModel, vacationValidation } from "../../../models/vacation-model";
import { vacationService } from "../../../services/vacation-service";
import { notify } from "../../../utils/notify";

export function AddVacationPage() {

    const { register, handleSubmit, reset, formState: { errors } } = useForm<VacationFormModel>();

    async function send(vacation: VacationFormModel) {

        console.log(vacation);

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


                <label>Starting date</label>
                <input type="date" {...register("startAt", vacationValidation.startAt)}></input>
                {errors.startAt?.message && <span className="error">{errors.destination?.message}</span>}



                <label>Ending date</label>
                <input type="date" {...register("finishAt", vacationValidation.finishAt)}></input>
                {errors.finishAt?.message && <span className="error">{errors.destination?.message}</span>}



                <label>Price:</label>
                <input type="number" {...register("price", vacationValidation.price)} ></input>
                {errors.price?.message && <span className="error">{errors.destination?.message}</span>}



                <button>Add vacation</button>
            </form>

        </div>
    );
}
