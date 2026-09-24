import { NavLink } from "react-router-dom";
import "./menu.css";
import { LogoutBtn } from "../../Auth/logout-btn/logout-btn";
import { useSelector } from "react-redux"
import { Role, UserModel } from "../../../models/user-models";
import { AppState } from "../../../redux/app-state";

export function Menu() {

    const user = useSelector<AppState, UserModel | null>(state => state.user);
    const isAdmin = user?.role === Role.Admin;

    return (
        <div className="Menu">

            {/** For all users */}
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/about">About</NavLink>




            {/** For all logged in users */}
            {user &&
                <>
                    <NavLink to="/vacations" end>Vacations</NavLink>
                    <NavLink to="/ask-mcp">Ask AI</NavLink>
                    <LogoutBtn />
                </>
            }


            {/** For anynimous users */}
            {!user &&
                <>
                    <NavLink to="/register">Register</NavLink>
                    <NavLink to="/login">Login</NavLink>
                </>
            }


            {/** For admins */}
            {/** vacation adding form */}
            {/** vacation likes dashboard */}








        </div>
    );
}
