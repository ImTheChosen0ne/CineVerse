import React, {useState} from "react";

import './SignUpSplash.css';

function SignUpSplash() {
    const [email, setEmail] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();

    };

    return (
        <>
            <h3>Ready to watch? Enter your email to create or restart your membership.</h3>
            <form onSubmit={handleSubmit} className="signup-form">
                <input
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    className="signup-button"
                    type="submit"
                >
                    Get Started >
                </button>
            </form>
        </>
    );
}

export default SignUpSplash;
