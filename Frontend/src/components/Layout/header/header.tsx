import { useSelector } from "react-redux";
import { UserModel } from "../../../models/user-models";
import { AppState } from "../../../redux/app-state";
import "./header.css";

export function Header() {

    const user = useSelector<AppState, UserModel | null>(state => state.user);

    return (
        <div className="Header">

			<h1>Vacation Tracker</h1>

            {/** For all logged in users */}
            {user && <span className="greeting">Hello {user.firstName + " " + user.lastName}</span>}

        </div>
    );
}
