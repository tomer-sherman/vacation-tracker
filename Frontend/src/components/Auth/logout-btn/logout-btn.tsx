import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/auth-service";
import "./logout-btn.css";
import { notify } from "../../../utils/notify";

export function LogoutBtn() {

    const navigate = useNavigate();

    function logout() {
        authService.logout();
        navigate("/home");
        notify.success("Logout succeded.")

    }


    return (
        <div className="LogoutBtn">

            <button onClick={logout} >Logout</button>

        </div>
    );
}
