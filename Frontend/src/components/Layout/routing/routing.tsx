import { Navigate, Route, Routes } from "react-router-dom";
import { About } from "../../Pages/about/about";
import { Home } from "../../Pages/home/home";
import { Page404 } from "../../Pages/page404/page404";
import { Register } from "../../Auth/register/register";
import { Login } from "../../Auth/login/login";
import { VacationPage } from "../../Pages/vacation-page/vacation-page";
import { AskMcpPage } from "../../Pages/ask-mcp-page/ask-mcp-page";
import { AiRecommendationPage } from "../../Pages/ai-recommendation-page/ai-recommendation-page";
import { AddVacationPage } from "../../Pages/add-vacation-page/add-vacation-page";

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

            <Route path="/ask-mcp" element={<AskMcpPage />} />

            <Route path="/ai-recommendation" element={<AiRecommendationPage />} />

            {/* About:  */}
            <Route path="/about" element={<About />} />

            <Route path="/admin/vacation/add" element={<AddVacationPage />} />

            {/* Page not found: */}
            <Route path="*" element={<Page404 />} />

        </Routes>
    );
}
