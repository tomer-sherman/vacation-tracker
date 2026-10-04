import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { About } from "../../Pages/about/about";
import { Home } from "../../Pages/home/home";
import { Page404 } from "../../Pages/page404/page404";
import { Register } from "../../Auth/register/register";
import { Login } from "../../Auth/login/login";
import { VacationPage } from "../../Pages/vacation-page/vacation-page";
import { AskMcpPage } from "../../Pages/ask-mcp-page/ask-mcp-page";
import { AiRecommendationPage } from "../../Pages/ai-recommendation-page/ai-recommendation-page";
import { AddVacationPage } from "../../Pages/add-vacation-page/add-vacation-page";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/app-state";
import { Role, UserModel } from "../../../models/user-models";

type ProtectedRouteProps = {
    adminOnly?: boolean
}

function ProtectedRoute(props: ProtectedRouteProps) {
    const user = useSelector<AppState, UserModel | null>(state => state.user);
    if (!user) return <Navigate to="/login" replace />
    if (props.adminOnly && user.role !== Role.Admin) return <Navigate to="/vacations" replace/>
    return <Outlet />
}
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
            <Route element={<ProtectedRoute />}>
                <Route path="/vacations" element={<VacationPage />} />
                <Route path="/ask-mcp" element={<AskMcpPage />} />
                <Route path="/ai-recommendation" element={<AiRecommendationPage />} />
            </Route>

            {/* About:  */}
            <Route path="/about" element={<About />} />
            <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/admin/vacation/add" element={<AddVacationPage />} />
            </Route>

            {/* Page not found: */}
            <Route path="*" element={<Page404 />} />

        </Routes>
    );
}
