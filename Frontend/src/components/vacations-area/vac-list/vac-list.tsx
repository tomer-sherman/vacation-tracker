
import "./vac-list.css";
import { notify } from "../../../utils/notify";
import { vacationService } from "../../../services/vacation-service";
import { VacCard } from "../vac-card/vac-card";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/app-state";
import { Role, UserModel } from "../../../models/user-models";
import { useVacations } from "../use-vacations/use-vacations";
import ReactPaginateImport from "react-paginate";
import { usePagination } from "./use-paginate";
import { VacationModel } from "../../../models/vacation-model";
import { VacationFilter } from "../../../models/enums";
import { useState } from "react";
import { filterVacations } from "../../../utils/vacation-filter";

const ReactPaginate =
    (ReactPaginateImport as unknown as { default: typeof ReactPaginateImport }).default
    ?? ReactPaginateImport;



export function VacList() {


    const { vacations, isLoading } = useVacations();
    const user = useSelector<AppState, UserModel | null>(state => state.user);
    const isAdmin = user?.role === Role.Admin;
    const navigate = useNavigate();

    const [filter, setFilter] = useState<VacationFilter>(VacationFilter.All);
    const filteredVacations = handleFilter(vacations, filter);

    const { page, setPage, pageCount, visible } = usePagination(filteredVacations, 9);


    function handleFilter(vacations: VacationModel[], filter: VacationFilter) {
        return filterVacations(vacations, filter);
    }

    // Back to the first page, otherwise a shorter filtered list can leave you on an empty page.
    function changeFilter(newFilter: VacationFilter) {
        setFilter(newFilter);
        setPage(0);
    }

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
        navigate(`/admin/vacation/edit/${vacationId}`);
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

            {/* All 4 always render in the same order; aria-pressed marks the selected one (CSS styles it) */}
            <div className="filters">
                <button aria-pressed={filter === VacationFilter.All} onClick={() => changeFilter(VacationFilter.All)}>All Vacations</button>
                <button aria-pressed={filter === VacationFilter.Liked} onClick={() => changeFilter(VacationFilter.Liked)}>Liked Vacations</button>
                <button aria-pressed={filter === VacationFilter.Active} onClick={() => changeFilter(VacationFilter.Active)}>Active Vacations</button>
                <button aria-pressed={filter === VacationFilter.NotStarted} onClick={() => changeFilter(VacationFilter.NotStarted)}>Not Started Vacations</button>
            </div>


            {
                visible?.map(v => (

                    <VacCard
                        key={v._id}
                        vacacation={v}
                        isAdmin={isAdmin}
                        likeBtn={handleLike}
                        unLikeBtn={handleUnLike}
                        editBtn={handleEdit}
                        deleteBtn={handleDelete}

                    />

                ))
            }

            <ReactPaginate
                pageCount={pageCount}
                forcePage={page}
                onPageChange={({ selected }) => setPage(selected)}
                previousLabel="'"
                nextLabel="'"
                containerClassName="pagination"
                activeClassName="active"
            />

            {isLoading && <span>Loading vacations...</span>}

        </div >
    );
}
