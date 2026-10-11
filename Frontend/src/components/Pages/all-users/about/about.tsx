import "./about.css";
import me from "../../../../assets/me.jpeg";

export function About() {
    return (
        <div className="About">

            {/* The coder */}
            <section className="about-me">

                <img src={me} alt="Tomer Sherman" />

                <div className="about-intro">
                    <span className="about-kicker">About the developer</span>
                    <h1>Hi, I'm Tomer Sherman</h1>
                    <p>
                        I'm the developer behind Vacation Tracker. I love coding, and most of
                        this site was written with a cup of coffee next to the keyboard. I enjoy
                        taking an idea all the way from the database to the last pixel on the screen,
                        and this project was the place to do exactly that.
                    </p>
                    <ul className="about-tags">
                        <li>Loves coding</li>
                        <li>Runs on coffee</li>
                        <li>Full-stack, front to back</li>
                    </ul>
                </div>

            </section>

            {/* The system */}
            <section className="about-system">

                <span className="about-kicker">About the system</span>
                <h2>What Vacation Tracker does</h2>
                <p>
                    Vacation Tracker is a place to browse curated getaways, save the ones you like
                    and get help from AI when you're deciding where to go next.
                </p>

                <ul className="about-features">
                    <li>
                        <h3>Browse and like</h3>
                        <p>Every vacation with its photo, dates and price. Like the ones you want to keep an eye on.</p>
                    </li>
                    <li>
                        <h3>Filter and page</h3>
                        <p>Show only your liked trips, the ones happening now or the ones still ahead, nine at a time.</p>
                    </li>
                    <li>
                        <h3>AI travel guide</h3>
                        <p>Pick a destination and get places to visit, practical tips and the matching trips on this site.</p>
                    </li>
                    <li>
                        <h3>AI concierge</h3>
                        <p>Ask a question about our vacations. The AI reads the live catalog through an MCP server.</p>
                    </li>
                    <li>
                        <h3>Admin tools</h3>
                        <p>Admins add, edit and delete vacations with photos, and see a likes chart they can export to CSV.</p>
                    </li>
                    <li>
                        <h3>Secure by design</h3>
                        <p>JWT login with user and admin roles, hashed passwords, rate limiting and XSS protection.</p>
                    </li>
                </ul>

            </section>

            {/* The stack */}
            <section className="about-stack">

                <span className="about-kicker">Built with</span>

                <dl>
                    <div>
                        <dt>Frontend</dt>
                        <dd>React, TypeScript, Vite, Redux Toolkit, React Router, React Hook Form, Recharts</dd>
                    </div>
                    <div>
                        <dt>Backend</dt>
                        <dd>Node.js, Express, TypeScript, MongoDB with Mongoose, JWT</dd>
                    </div>
                    <div>
                        <dt>AI</dt>
                        <dd>OpenAI (gpt-4o-mini) and a Model Context Protocol (MCP) server</dd>
                    </div>
                </dl>

            </section>

        </div>
    );
}
