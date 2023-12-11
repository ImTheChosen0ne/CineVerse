import React, {useState} from "react";

import './SignUpSplash.css';
import {useHistory} from "react-router-dom";
import SignupFormPage from "../../SignupFormPage";
import {signUp} from "../../../store/session";


function SignUpSplash() {
    const history = useHistory();
    const [signUpEmail, setSignUpEmail] = useState("");
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!signUpEmail) {
            setErrors(['Email is required']);
        } else if (!signUpEmail.includes('@')){
            setErrors(['Please enter a valid email address.']);
        } else {
            history.push("/signup", { signUpEmail });
        }
    };

    return (
        <div className="sign-up">
            <form onSubmit={handleSubmit} className="signup-form">
                <h3>Ready to watch? Enter your email to create or restart your membership.</h3>
                <div className="input-info">
                    <div className="input-label">
                        <input
                            placeholder="Email Address"
                            type="email"
                            value={signUpEmail}
                            onChange={(e) => setSignUpEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button className="sign-up-button">
                        Get Started
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                             data-mirrorinrtl="true" className="default-ltr-cache-4z3qvp e1svuwfo1"
                             data-name="ChevronRight" aria-hidden="true">
                            <path
                                  d="M15.5859 12L8.29303 19.2928L9.70725 20.7071L17.7072 12.7071C17.8948 12.5195 18.0001 12.2652 18.0001 12C18.0001 11.7347 17.8948 11.4804 17.7072 11.2928L9.70724 3.29285L8.29303 4.70706L15.5859 12Z"
                                  fill="currentColor"></path>
                        </svg>
                    </button>
                </div>
            </form>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </div>
    );
}

export default SignUpSplash;
