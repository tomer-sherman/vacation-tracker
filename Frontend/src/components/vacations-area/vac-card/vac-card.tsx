import { VacationModel } from "../../../models/vacation-model";
import "./vac-card.css";

// Using the prop to pass down a function, that only passes the id to the arguments.
type VacProps = {

    vacacation: VacationModel;

    isAdmin: boolean;

    // For users.
    likeBtn: (vacationId: string) => void;
    unLikeBtn: (vactionId: string) => void;

    //For admin
    editBtn: (vacationId: string) => void;
    deleteBtn: (vacationId: string) => void;


}


export function VacCard(props: VacProps) {
    return (
        <div className="VacCard">

            <p>{props.vacacation.destination}</p>
            <p>{props.vacacation.startAt}</p>
            <p>{props.vacacation.finishAt}</p>
            <p>{props.vacacation.likeCount}</p>
            <p>{props.vacacation.price}</p>

            {/** Handles the like rendering, and the conditional rendering whether the user is an admin or not. */}
            {props.isAdmin ?
                <>
                    <button onClick={() => props.editBtn(props.vacacation._id)} >Edit</button>
                    <button onClick={() => props.deleteBtn(props.vacacation._id)} >Delete</button>
                </>
                :
                props.vacacation.isLiked ?
                    <button onClick={() => props.unLikeBtn(props.vacacation._id)}>UnLike</button>
                    :
                    <button onClick={() => props.likeBtn(props.vacacation._id)}>Like</button>

            }





        </div>
    );
}
