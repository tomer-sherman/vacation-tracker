import { useNavigate } from "react-router-dom";
import "./home.css";
import paralax from "../../../../assets/paralax.jpg";

export function Home() {

    const navigate = useNavigate();



    return (
        <div className="Home">

            {/* Parallax hero: the photo scrolls slower than the page (CSS only) */}
            <section className="home-hero">
                <img src={paralax} alt="" />
                <h1>Vacation Tracker</h1>
            </section>

            <div className="home-intro">
                <p>Hello dear Browsers, In this site you can browse and see different vacation offering.</p>
                <p>If you want too browse our vacation selection you must be a registered user, And you will get special offers JUST FOR YOU!!!.</p>
                <button onClick={() => navigate("/register")} >Register</button>

                <p>Already a user in our site ?</p>
                <button onClick={() => navigate("/login")} >Login</button>
            </div>

        </div>
    );
}
