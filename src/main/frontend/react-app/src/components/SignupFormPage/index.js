import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Redirect, useLocation} from "react-router-dom";
import { signUp } from "../../store/session";
import './SignupForm.css';
import Footer from "../Footer";

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const [step, setStep] = useState(1);

  const location = useLocation();
  const signUpEmail = location.state?.signUpEmail || email;

  if (sessionUser) return <Redirect to="/profile" />;

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
        const data = await dispatch(signUp(username, password, email, firstName, lastName));
        if (data) {
          setErrors(data)
        }
    } else {
        setErrors(['Confirm Password field must be the same as the Password field']);
    }
  };

  return (
    <>
      <div className="signup-container">
      {step === 1 && (
          <div className="signup-form">
            <div className="signup-page-one">
              <div className="signup-img"></div>
              <div className="signup-info">
                <span>{`STEP ${step} OF 3`}</span>
                <h1>Finish setting up your account</h1>
              </div>
              <div className="signup-info-text">
                Netflix is personalized for you. Create a password to start watching Netflix.
              </div>
            </div>
            <form onSubmit={handleNextStep} className="info-form">
              <button type="submit">Next</button>
            </form>
          </div>
      )}

        {step === 2 && (

            <form onSubmit={handleSubmit}>
              <span>{`STEP ${step} OF 3`}</span>
              <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
              </ul>
              <label>
                Email
                <input
                    type="text"
                    value={signUpEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </label>
              <label>
                Username
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
              </label>
              <label>
                First Name
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
              </label>
              <label>
                Last Name
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
              </label>
              <label>
                Password
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </label>
              <label>
                Confirm Password
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
              </label>
              <button type="submit">Sign Up</button>
            </form>
        )}
      </div>
      <Footer/>
    </>
  );
}

export default SignupFormPage;
