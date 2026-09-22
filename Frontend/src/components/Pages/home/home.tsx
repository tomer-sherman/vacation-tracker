import { useNavigate } from "react-router-dom";
import "./home.css";

export function Home() {

    const navigate = useNavigate();



    return (
        <div className="Home">

            <p>Hello dear Browsers, In this site you can browse and see different vacation offering.</p>
            <p>If you want too browse our vacation selection you must be a registered user, And you will get special offers JUST FOR YOU!!!.</p>
            <button onClick={() => navigate("/register")} >Register NOW!!!</button>

            <p>Already a user in our site?!</p>
            <button onClick={() => navigate("/login")} >Login</button>

        </div>
    );
}
