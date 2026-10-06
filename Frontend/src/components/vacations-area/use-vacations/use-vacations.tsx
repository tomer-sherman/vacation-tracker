import { useSelector } from "react-redux";
import { AppState } from "../../../redux/app-state";
import { VacationModel } from "../../../models/vacation-model";
import { useEffect, useState } from "react";
import { vacationService } from "../../../services/vacation-service";
import { notify } from "../../../utils/notify";

export function useVacations() {
    const vacations = useSelector<AppState, VacationModel[]>(state => state.vacation);
    const [isLoading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        setLoading(true);
        vacationService.getAllVacations()
            .catch(err => notify.error(err))
            .finally(() => setLoading(false));

    }, [])

    return {vacations, isLoading}
}
