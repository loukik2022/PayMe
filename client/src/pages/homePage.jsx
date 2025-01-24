import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>PayMe</h1>
            <main>
                <h2>Welcome to PayMe</h2>
                <p>PayMe is a secure and efficient payment gateway solution.</p>
                <p>Discover a wide range of subscription plans tailored to your needs, backed by secure and reliable authentication.</p>
                <div>
                    <button onClick={() => navigate("/login")}>Login</button>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
