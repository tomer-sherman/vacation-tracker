import { useForm } from "react-hook-form";
import "./register.css";
import { RegisterFormModel, userValidation } from "../../../models/user-models";
import { useNavigate } from "react-router-dom";
import { notify } from "../../../utils/notify";
import { authService } from "../../../services/auth-service";

export function Register() {

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormModel>({
        mode: "onSubmit"
    });
    const navigate = useNavigate();



    async function send(form: RegisterFormModel) {

        form.email = form.email.toLocaleLowerCase();
        form.firstName = form.firstName.toLocaleLowerCase();
        form.lastName = form.lastName.toLocaleLowerCase();

        await authService.register(form).
            then(() => {
                navigate("/data");
                notify.success("Register succeeded.")
            })
            .catch(err => notify.error(err))


    }


    return (
        <div className="Register">
            <p>Register Component</p>

            <form onSubmit={handleSubmit(send)}>

                <label>First name:</label>
                <input type="text" {...register("firstName", userValidation.firstName)} ></input>
                {errors.firstName && <span className="error">{errors.firstName.message}</span>}

                <label>Last name:</label>
                <input type="text" {...register("lastName", userValidation.lastName)} ></input>
                {errors.lastName && <span className="error">{errors.lastName.message}</span>}

                <label>Email:</label>
                <input type="text" {...register("email", userValidation.email)} ></input>
                {errors.email && <span className="error">{errors.email.message}</span>}

                <label>Password:</label>
                <input type="text" {...register("password", userValidation.password)} ></input>
                {errors.password && <span>HELLO? CAN'T YOU READ INSTRUCTIONS!! S2PID!</span>}
                <p>Password must be 4-100 chars with lowercase, uppercase and a number.</p>

                <button>Send</button>

            </form>


        </div >
    );
}
