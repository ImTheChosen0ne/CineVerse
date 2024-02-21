import React, { useState } from "react";
import "./ChangePlan.css"
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import OpenModalButton from "../../components/OpenModalButton";
import Confirm from "./confirm";

function ChangePlan() {
    const history = useHistory()
    const sessionUser = useSelector(state => state.session.user);

    const [selectedPlan, setSelectedPlan] = useState(sessionUser.plan);

    return (
        <div className="account-page">
            <div className="account-container">
                <div className="account-center">
                    <h1>Change Streaming Plan</h1>
                    <div className="account-content">
                        <div className="radio-panel-group">
                            <label
                                className={`radio-panel__label choose-plan__plan ${selectedPlan === 'standard with ads' ? 'choose-plan__plan--checked' : ''}`}>
                                <input className="screen-reader-text" type="radio" name="plan"
                                       onChange={() => setSelectedPlan('standard with ads')}
                                       checked={selectedPlan === 'standard with ads'} id="standard-with-ads"/>
                                <h2 className="plan-name choose-plan__plan-name">
                                    {sessionUser.plan === "standard with ads" ?
                                        <span className="plan-name__prefix">Current plan: </span>
                                        :
                                        ''
                                    }
                                    <span className="plan-name__name">Standard with ads</span>
                                </h2>
                                <div className="choose-plan__description">
                                    <div>
                                        <span className="plan-description">Great video quality in Full HD (1080p). Watch with a few ad breaks on your phone, tablet, computer or TV. Download on 2 devices.</span>
                                    </div>
                                </div>
                                {selectedPlan === "standard with ads" ?
                                    <div className="selected-indicator">Current plan</div>
                                    :
                                    ''
                                }
                            </label>

                            <label
                                className={`radio-panel__label choose-plan__plan ${selectedPlan === 'standard' ? 'choose-plan__plan--checked' : ''}`}>
                                <input className="screen-reader-text" type="radio" name="plan"
                                       onChange={() => setSelectedPlan('standard')}
                                       checked={selectedPlan === 'standard'}/>
                                <h2 className="plan-name choose-plan__plan-name">
                                    {sessionUser.plan === "standard" ?
                                        <span className="plan-name__prefix">Current plan: </span>
                                        :
                                        ''
                                    }
                                    <span className="plan-name__name">Standard</span>
                                </h2>
                                <div className="choose-plan__description">
                                    <div>
                                        <span className="plan-description">Great video quality in Full HD (1080p). Watch ad-free on any phone, tablet, computer or TV. Download on 2 devices.</span>
                                    </div>
                                </div>
                                {selectedPlan === "standard" ?
                                    <div className="selected-indicator">Current plan</div>
                                    :
                                    ''
                                }
                            </label>
                            <label
                                className={`radio-panel__label choose-plan__plan ${selectedPlan === 'premium' ? 'choose-plan__plan--checked' : ''}`}>
                                <input className="screen-reader-text" type="radio" name="plan"
                                       onChange={() => setSelectedPlan('premium')}
                                       checked={selectedPlan === 'premium'}/>
                                <h2 className="plan-name choose-plan__plan-name">
                                    {sessionUser.plan === "premium" ?
                                        <span className="plan-name__prefix">Current plan: </span>
                                        :
                                        ''
                                    }
                                    <span className="plan-name__name">Premium</span>
                                </h2>
                                <div className="choose-plan__description">
                                    <div>
                                        <span className="plan-description">Our best video quality in Ultra HD (4K) and HDR. Spatial audio available. Watch ad-free on any phone, tablet, computer or TV. Download on 6 devices.</span>
                                    </div>
                                </div>
                                {selectedPlan === "premium" ?
                                    <div className="selected-indicator">Current plan</div>
                                    :
                                    ''
                                }
                            </label>
                        </div>
                    </div>
                    <p className="terms-of-use">
                        Only people who live with you may use your account. Watch on 4 different devices at the same time with Premium and 2
                        with Standard or Standard with ads.
                    </p>
                    <div className="btn-bar btn-bar-center">
                        <button className="btn btn-gray btn-small" onClick={() => history.push("/account")}>Back
                        </button>
                        <OpenModalButton
                            buttonText="Continue"
                            modalComponent={<Confirm selectedPlan={selectedPlan} sessionUser={sessionUser}/>}
                            disabled={sessionUser.plan === selectedPlan}
                        />
                    </div>
                </div>
            </div>
            <Footer className="account-footer"/>
        </div>
    );
}

export default ChangePlan;
