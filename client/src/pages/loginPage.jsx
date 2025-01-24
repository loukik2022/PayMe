import { useState } from "react";
import SigninForm from "../components/auth/signin";
import SignupForm from "../components/auth/signup";

const LoginPage = () => {
    // State to track which form is visible
    const [isSignUp, setisSignUp] = useState(true);

    // Function to toggle between forms
    const toggleForm = () => {
        setisSignUp(!isSignUp);
    };

    return (
        <div>
            {/* Conditional rendering of forms */}
            {isSignUp ? (
                <>
                    <h1>Sign Up</h1>
                    <SignupForm toggleForm={toggleForm} />
                </>
            ) : (
                <>
                    <h1>Sign In</h1>
                    <SigninForm />
                </>
            )}
            {/* Button to toggle forms */}
            <button onClick={toggleForm} style={{ marginTop: "20px" }}>
                {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
            </button>
        </div>
    );
};

export default LoginPage;