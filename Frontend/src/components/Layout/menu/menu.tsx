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


            {/** For admins */}
            {isAdmin && <NavLink to="/admin/vacation/add">Add vacation</NavLink>}
            {/** vacation likes dashboard */}

            {/** For all logged in users */}
            {user &&
                <>
                    <NavLink to="/vacations" end>Vacations</NavLink>
                    <NavLink to="/ask-mcp">Ask AI</NavLink>
                    <NavLink to="/ai-recommendation" >Ai Recommendation</NavLink>
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











        </div>
    );
}
