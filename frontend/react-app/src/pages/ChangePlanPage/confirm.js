import React from "react";

import { useModal } from "../../context/Modal";
import { updatedUsers } from "../../store/session";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

function Confirm({ selectedPlan, sessionUser }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedUser = {
            ...sessionUser,
            plan: selectedPlan,
        };

        dispatch(updatedUsers(updatedUser))
        closeModal()
        history.push("/account")
    }

    return (
            <div className="confirm-modal">
                <header className="confirm-head">
                    <h1 className="confirm-title">Confirm Streaming Plan</h1>
                    <div className="confirm-close" onClick={() => closeModal()}></div>
                </header>
                <section className="confirm-content">
                    <div>
                        <ul className="modal-plan-list structural">
                            <li className="modal-plan-item current">
                                <h2 className="modal-plan-header">
                                    Current plan:
                                    <p>
                                        <span>{sessionUser.plan.charAt(0).toUpperCase() + sessionUser.plan.slice(1)}</span>
                                    </p>
                                </h2>
                            </li>
                            <li className="modal-plan-item selected">
                                <h2 className="modal-plan-header">New plan:
                                    <p>
                                        <span>{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}</span>
                                    </p>
                                </h2>
                            </li>
                        </ul>
                        <div className="modal-additional-info">
                            Your new plan starts once you confirm this change. By clicking “Confirm”, you agree that your
                            <strong>
                                CineVerse membership will automatically continue and that the additional charge
                                for Standard will be charged to your bill until you cancel. You may downgrade
                                at any time to avoid future additional charges by contacting CineVerse.
                            </strong>
                        </div>
                    </div>
                </section>
                <footer className="confirm-foot">
                    <div className="btn-bar button-container-centered">
                        <button className="btn modal-action-button btn-gray btn-small" onClick={() => closeModal()}>Cancel</button>
                        <button className="btn modal-action-button btn-blue btn-small" onClick={handleSubmit}>Confirm</button>
                    </div>
                </footer>
            </div>
    );
}

export default Confirm;
