import { useForm } from "react-hook-form";
import { CredentialsModel, credentialsValidation } from "../../../models/user-models";
import "./login.css";
import { authService } from "../../../services/auth-service";
import { useNavigate } from "react-router-dom";
import { notify } from "../../../utils/notify";

export function Login() {

    const { register, handleSubmit, formState: { errors } } = useForm<CredentialsModel>();
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
                <input type="text" {...register("email", credentialsValidation.email)} ></input>
                {errors.email && <span className="error">{errors.email.message}</span>}

                <label>Password: </label>
                <input type="password" {...register("password", credentialsValidation.password)} ></input>
                {errors.password && <span className="error">{errors.password.message}</span>}


                <button>Send</button>
            </form>


        </div>
    );
}
