import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/auth-service";
import "./logout-btn.css";
import { notify } from "../../../utils/notify";

export function LogoutBtn() {

    function logout() {
        authService.logout();
        window.location.href = "/login"
        notify.success("Logout succeded.");

    }


    return (
        <div className="LogoutBtn">

            <button onClick={logout} >Logout</button>

        </div>
    );
}
