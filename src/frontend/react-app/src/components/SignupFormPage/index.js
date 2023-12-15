import React, {useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Redirect, useLocation} from "react-router-dom";
import {signUp, verifyEmail} from "../../store/session";
import './SignupForm.css';
import Footer from "../Footer";

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("plan3");

  const location = useLocation();
  const initialEmail = location.state?.signUpEmail || email;

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  if (sessionUser) return <Redirect to="/profile" />;

  const handlePlanChange = (planId) => {
        setSelectedPlan(planId);
  };
  const handleNextStepEmail = async (e) => {
    e.preventDefault();

    const errors = {};

    if (password === confirmPassword) {
      const data = await dispatch(verifyEmail(email));
      if (data) {
        errors.email = data
        setErrors(errors);
      } else if (email === "" || !email.includes("@")) {
        errors.email = "Invalid Email";
        setErrors(errors)
      } else if (password.length < 8) {
        errors.password = "Password must be at least 8 characters long.";
        setErrors(errors)
      } else {
        setStep((prevStep) => prevStep + 1);
      }
    } else {
      errors.confirmPassword = 'Confirm Password field must be the same as the Password field.'
      setErrors(errors);
    }
  };

  const handleNextStep = () => {
        setStep((prevStep) => prevStep + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (firstName === "") {
      errors.firstName = "Please enter a first name.";
      setErrors(errors)
    }
    if (lastName === "") {
      errors.lastName = "Please enter a last name.";
      setErrors(errors)
    }

    if (password === confirmPassword) {
        const data = await dispatch(signUp(email, password, firstName, lastName));
        if (data) {
          setErrors(data)
        }
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
            <div className="info-form">
              <button onClick={handleNextStep} type="submit">Next</button>
            </div>
          </div>
      )}

        {step === 2 && (
            <div className="signup-form">
              <div className="input-form">
                <div className="signup-info-two">
                  <span>{`STEP ${step - 1} OF 3`}</span>
                  <h1>Create a password to start your membership</h1>
                </div>
                <form onSubmit={handleNextStepEmail}>
                  <div className="input-container">
                    <p>Just a few more steps and you're done!</p>
                    <p>We hate paperwork, too.</p>
                    <div className="form-inputs">
                      <input
                          placeholder="Email"
                          type="email"
                          value={initialEmail}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                      />
                      <p className="formErrors">{errors.email}</p>
                      <input
                          placeholder="Add Password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                      />
                      <p className="formErrors">{errors.password}</p>
                      <input
                          placeholder="Confirm Password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                      />
                      <p className="formErrors">{errors.confirmPassword}</p>
                    </div>
                  </div>
                  <button type="submit">Next</button>
                </form>
              </div>
            </div>
        )}
          {step === 3 && (
              <div className="signup-form">
                  <div className="signup-page-one">
                      <div className="signup-img-check"></div>
                      <div className="signup-info">
                          <span>{`STEP ${step - 1} OF 3`}</span>
                          <h1>Choose your plan.</h1>
                      </div>
                      <div className="signup-info-text-plan">
                          <ul>
                              <li>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                       xmlns="http://www.w3.org/2000/svg"
                                       className="checkmark-group--icon default-ltr-cache-4z3qvp e1svuwfo1"
                                       data-name="Checkmark" aria-hidden="true">
                                      <path
                                            d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z"
                                            fill="currentColor"></path>
                                  </svg>
                                  <span>
                                        No commitments, cancel anytime.
                                  </span>
                              </li>
                              <li>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                       xmlns="http://www.w3.org/2000/svg"
                                       className="checkmark-group--icon default-ltr-cache-4z3qvp e1svuwfo1"
                                       data-name="Checkmark" aria-hidden="true">
                                      <path
                                            d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z"
                                            fill="currentColor"></path>
                                  </svg>
                                  <span>
                                        Endless entertainment for one low price.
                                  </span>
                              </li>
                              <li>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                       xmlns="http://www.w3.org/2000/svg"
                                       className="checkmark-group--icon default-ltr-cache-4z3qvp e1svuwfo1"
                                       data-name="Checkmark" aria-hidden="true">
                                      <path
                                            d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z"
                                            fill="currentColor"></path>
                                  </svg>
                                  <span>
                                        Enjoy CineVerse on all your devices.
                                  </span>
                              </li>
                          </ul>
                      </div>
                  </div>
                  <div className="info-form">
                      <button onClick={handleNextStep}>Next</button>
                  </div>
              </div>
          )}
          {step === 4 && (
              <div className="signup-form">
                  <div className="signup-page-plan">
                      <div className="signup-info">
                          <div className="plan-header">
                          <span>{`STEP ${step - 2} OF 3`}</span>
                          <h1>Choose the plan that’s right for you</h1>
                          </div>
                          <div className="signup-info-choose-plan">
                              <ul>
                                  <li>
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                           xmlns="http://www.w3.org/2000/svg"
                                           className="checkmark-group--icon default-ltr-cache-4z3qvp e1svuwfo1"
                                           data-name="Checkmark" aria-hidden="true">
                                          <path
                                                d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z"
                                                fill="currentColor"></path>
                                      </svg>
                                      <span>
                                        Watch all you want.
                                  </span>
                                  </li>
                                  <li>
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                           xmlns="http://www.w3.org/2000/svg"
                                           className="checkmark-group--icon default-ltr-cache-4z3qvp e1svuwfo1"
                                           data-name="Checkmark" aria-hidden="true">
                                          <path
                                                d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z"
                                                fill="currentColor"></path>
                                      </svg>
                                      <span>
                                        Recommendations just for you.
                                  </span>
                                  </li>
                                  <li>
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                           xmlns="http://www.w3.org/2000/svg"
                                           className="checkmark-group--icon default-ltr-cache-4z3qvp e1svuwfo1"
                                           data-name="Checkmark" aria-hidden="true">
                                          <path
                                                d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z"
                                                fill="currentColor"></path>
                                      </svg>
                                      <span>
                                        Change or cancel your plan anytime.
                                  </span>
                                  </li>
                              </ul>
                          </div>
                      </div>
                      <div className="signup-info-plan-grid">
                          <div className="plan-grid-header">
                              <div className="plan-grid-selector">
                                  <label>
                                      <input type="radio" name="plan" onChange={() => handlePlanChange('plan1')}
                                             checked={selectedPlan === 'plan1'}/>
                                      <span>
                                            Standard with ads
                                      </span>
                                  </label>
                                  <label>
                                      <input type="radio" name="plan" onChange={() => handlePlanChange('plan2')}
                                             checked={selectedPlan === 'plan2'}/>
                                      <span>
                                          Standard
                                      </span>
                                  </label>
                                  <label>
                                      <input type="radio" name="plan" onChange={() => handlePlanChange('plan3')}
                                             checked={selectedPlan === 'plan3'}/>
                                      <span>
                                            Premium
                                      </span>
                                  </label>
                              </div>

                          </div>
                          <div className="plan-grid-plan-info">
                              <div className="plan-grid-plan-info-row">
                                  <p className="column-name">Monthly price</p>
                                  <p className={`column-name-info ${selectedPlan === 'plan1' ? 'highlight' : ''}`}>$6.99</p>
                                  <p className={`column-name-info ${selectedPlan === 'plan2' ? 'highlight' : ''}`}>$15.49</p>
                                  <p className={`column-name-info ${selectedPlan === 'plan3' ? 'highlight' : ''}`}>$22.99</p>
                              </div>
                              <div className="plan-grid-plan-info-row">
                                  <p className="column-name">Video quality</p>
                                  <p className={`column-name-info ${selectedPlan === 'plan1' ? 'highlight' : ''}`}>Great</p>
                                  <p className={`column-name-info ${selectedPlan === 'plan2' ? 'highlight' : ''}`}>Great</p>
                                  <p className={`column-name-info ${selectedPlan === 'plan3' ? 'highlight' : ''}`}>Best</p>
                              </div>
                              <div className="plan-grid-plan-info-row">
                                  <p className="column-name">Resolution</p>
                                  <p className={`column-name-info ${selectedPlan === 'plan1' ? 'highlight' : ''}`}>1080p</p>
                                  <p className={`column-name-info ${selectedPlan === 'plan2' ? 'highlight' : ''}`}>1080p</p>
                                  <p className={`column-name-info ${selectedPlan === 'plan3' ? 'highlight' : ''}`}>4K+HDR</p>
                              </div>
                              <div className="plan-grid-plan-info-row">
                                  <p className="column-name">Watch on your TV, computer, mobile phone and tablet</p>
                                  <svg id="plan1" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                       xmlns="http://www.w3.org/2000/svg"
                                       className={`checkmark-group--icon default-ltr-cache-4z3qvp e1svuwfo1 column-name-info ${selectedPlan === 'plan1' ? 'highlight' : ''}`}
                                       data-name="Checkmark" aria-hidden="true">
                                      <path
                                            d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z"
                                            fill="currentColor"></path>
                                  </svg>
                                  <svg id="plan2" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                       xmlns="http://www.w3.org/2000/svg"
                                       className={`checkmark-group--icon default-ltr-cache-4z3qvp e1svuwfo1 column-name-info ${selectedPlan === 'plan2' ? 'highlight' : ''}`}
                                       data-name="Checkmark" aria-hidden="true">
                                      <path
                                            d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z"
                                            fill="currentColor"></path>
                                  </svg>
                                  <svg id="plan3" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                       xmlns="http://www.w3.org/2000/svg"
                                       className={`checkmark-group--icon default-ltr-cache-4z3qvp e1svuwfo1 column-name-info ${selectedPlan === 'plan3' ? 'highlight' : ''}`}
                                       data-name="Checkmark" aria-hidden="true">
                                      <path
                                            d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z"
                                            fill="currentColor"></path>
                                  </svg>
                              </div>
                              <div className="plan-grid-plan-info-row-final">
                                  <p className="column-name" >Number of devices for downloads</p>
                                  <p className={`column-name-info ${selectedPlan === 'plan1' ? 'highlight' : ''}`}>2</p>
                                  <p className={`column-name-info ${selectedPlan === 'plan2' ? 'highlight' : ''}`}>2</p>
                                  <p className={`column-name-info ${selectedPlan === 'plan3' ? 'highlight' : ''}`}>6</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="plan-button">
                      <button onClick={handleNextStep}>Next</button>
                  </div>
              </div>
          )}

          {step === 5 && (
              <div className="signup-form">
                  <form onSubmit={handleSubmit} className="input-form">
                      <div className="signup-info-two">
                          <span>{`STEP ${step - 2} OF 3`}</span>
                          <h1>Create a profile</h1>
                      </div>
                      <div className="input-container">
                          <p>Just a few more steps and you're done!</p>
                          <p>We hate paperwork, too.</p>
                        <div className="form-inputs">
                          <input
                              placeholder="First Name"
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required
                          />
                          <p className="formErrors">{errors.firstName}</p>

                          <input
                              placeholder="Last Name"
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              required
                          />
                          <p className="formErrors">{errors.lastName}</p>

                        </div>
                      </div>
                    <button type="submit">Complete Sign Up</button>
                  </form>
              </div>
          )}
      </div>
        <Footer/>
    </>
  );
}

export default SignupFormPage;
