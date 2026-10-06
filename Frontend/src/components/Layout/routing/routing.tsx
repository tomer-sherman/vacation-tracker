import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { About } from "../../Pages/all-users/about/about";
import { Home } from "../../Pages/all-users/home/home";
import { Page404 } from "../../Pages/all-users/page404/page404";
import { Register } from "../../Auth/register/register";
import { Login } from "../../Auth/login/login";
import { VacationPage } from "../../Pages/logged-users/vacation-page/vacation-page";
import { AskMcpPage } from "../../Pages/logged-users/ask-mcp-page/ask-mcp-page";
import { AiRecommendationPage } from "../../Pages/logged-users/ai-recommendation-page/ai-recommendation-page";
import { AddVacationPage } from "../../Pages/admin/add-vacation-page/add-vacation-page";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/app-state";
import { Role, UserModel } from "../../../models/user-models";
import { UpdateVacation } from "../../Pages/admin/update-vacation/update-vacation";
import { LikeAnalytics } from "../../Pages/admin/like-analytics/like-analytics";

type ProtectedRouteProps = {
    adminOnly?: boolean
}

function ProtectedRoute(props: ProtectedRouteProps) {
    const user = useSelector<AppState, UserModel | null>(state => state.user);
    if (!user) return <Navigate to="/login" replace />
    if (props.adminOnly && user.role !== Role.Admin) return <Navigate to="/vacations" replace />
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




            <Route path="/about" element={<About />} />

            <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/admin/vacation/add" element={<AddVacationPage />} />
                <Route path="/admin/vacation/edit/:_id" element={<UpdateVacation />} />
                <Route path="admin/likes" element={<LikeAnalytics />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/vacations" element={<VacationPage />} />
                <Route path="/ask-mcp" element={<AskMcpPage />} />
                <Route path="/ai-recommendation" element={<AiRecommendationPage />} />
            </Route>

            {/* Page not found: */}
            <Route path="*" element={<Page404 />} />

        </Routes>
    );
}
