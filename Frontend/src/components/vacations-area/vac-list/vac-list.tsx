import { useEffect, useState } from "react";
import "./vac-list.css";
import { VacationModel } from "../../../models/vacation-model";
import { notify } from "../../../utils/notify";
import { vacationService } from "../../../services/vacation-service";
import { VacCard } from "../vac-card/vac-card";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/app-state";
import { Role, UserModel } from "../../../models/user-models";

export function VacList() {

    const [vacations, setVacations] = useState<VacationModel[]>();
    const [loading, setLoading] = useState<boolean>(false);

    const user = useSelector<AppState, UserModel | null>(state => state.user);
    const isAdmin = user?.role === Role.Admin;

    const navigate = useNavigate();



    useEffect(() => {

        setLoading(true);
        vacationService.getAllVacations()
            .then(vacations => setVacations(vacations))
            .catch(err => notify.error(err))
            .finally(() => setLoading(false));

    }, [])


    async function handleLike(vacationId: string) {

        try {
            await vacationService.likeVacation(vacationId);

        } catch (err: any) {
            notify.error(err);
        }

    }

    async function handleUnLike(vacationId: string) {

        try {
            await vacationService.unLikeVacation(vacationId);

        } catch (err: any) {
            notify.error(err);
        }

    }

    function handleEdit(vacationId: string) {
        navigate(`/vacation/edit/${vacationId}`);
    }

    async function handleDelete(vacationId: string) {

        try {
            await vacationService.deleteVacation(vacationId);
            notify.success("Vacation deleted");

        } catch (err: any) {
            notify.error(err);
        }

    }






    return (
        <div className="VacList">


            {vacations?.map(v => (

                <VacCard
                    key={v._id}
                    vacacation={v}
                    isAdmin={isAdmin}
                    likeBtn={handleLike}
                    unLikeBtn={handleUnLike}
                    editBtn={handleEdit}
                    deleteBtn={handleDelete}

                />


            ))}

            {loading && <span>Loading vacations...</span>}

        </div>
    );
}
