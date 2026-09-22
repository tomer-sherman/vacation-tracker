import { NavLink } from "react-router-dom";
import "./menu.css";

export function Menu() {

    return (
        <div className="Menu">

            <NavLink to="/home">Home</NavLink>

            <NavLink to="/register">Register</NavLink>

            <NavLink to="/login">Login</NavLink>


            <NavLink to="/data" end>Data</NavLink>

            <NavLink to="/about">About</NavLink>

        </div>
    );
}
