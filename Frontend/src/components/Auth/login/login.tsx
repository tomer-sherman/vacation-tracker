import { useForm } from "react-hook-form";
import { CredentialsModel, userValidation } from "../../../models/user-models";
import "./login.css";
import { authService } from "../../../services/auth-service";
import { useNavigate } from "react-router-dom";
import { notify } from "../../../utils/notify";

export function Login() {

    const { register, handleSubmit } = useForm<CredentialsModel>();
    const navigate = useNavigate();

    async function send(credentials: CredentialsModel) {

        credentials.email = credentials.email.toLocaleLowerCase();

        await authService.login(credentials)
            .then(() => {
                navigate("/vacations");
                notify.success("Login successful.")
            })
            .catch(err => notify.error(err));
    }

    return (
        <div className="Login">

            <form onSubmit={handleSubmit(send)}>

                <label>Email: </label>
                <input type="text" {...register("email", userValidation.email)} ></input>

                <label>Password: </label>
                <input type="text" {...register("password", userValidation.password)} ></input>


                <button>Send</button>
            </form>


        </div>
    );
}
