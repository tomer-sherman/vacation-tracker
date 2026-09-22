import { Navigate, Route, Routes } from "react-router-dom";
import { About } from "../../Pages/about/about";
import { Home } from "../../Pages/home/home";
import { Page404 } from "../../Pages/page404/page404";
import { Register } from "../../Auth/register/register";
import { Login } from "../../Auth/login/login";
import { VacationPage } from "../../Pages/vacation-page/vacation-page";

export function Routing() {

    return (
        <Routes>

            {/* Default Route: */}
            <Route path="/" element={<Navigate to="/home" />} />

            {/* Home: */}
            <Route path="/home" element={<Home />} />

            <Route path="/register" element={<Register />} />

            <Route path="/login" element={<Login />} />

            {/* Data:  */}
            <Route path="/vacations" element={<VacationPage />} />

            {/* About:  */}
            <Route path="/about" element={<About />} />

            {/* Page not found: */}
            <Route path="*" element={<Page404 />} />

        </Routes>
    );
}
