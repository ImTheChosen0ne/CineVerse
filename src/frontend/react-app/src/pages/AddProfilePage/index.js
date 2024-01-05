import React, {useContext, useState} from "react";
import "./AddProfilePage.css"
import {NavLink, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createProfile, deleteProfile} from "../../store/session";
function AddProfilePage() {
    const history = useHistory()
    const dispatch = useDispatch()
    const [name, setName] = useState("");
    const [img, setImg] = useState("https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABfjwXqIYd3kCEU6KWsiHSHvkft8VhZg0yyD50a_pHXku4dz9VgxWwfA2ontwogStpj1NE9NJMt7sCpSKFEY2zmgqqQfcw1FMWwB9.png?r=229");

    const sessionUser = useSelector(state => state.session.user);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const profile = {
            name: name,
            img: img,
        }

        dispatch(createProfile(profile, sessionUser.userId))

        history.push("/profile")
    }

    const handleCancel = async () => {
        history.goBack()
    }

    return (
        <div className="add-profile">
            <div className="header"/>
            <div className="add-profile-container">
                <div className="add-profile-center">
                    <form onSubmit={handleSubmit} className="add-profile-wrapper">
                        <h1>Add Profile</h1>
                        <h2>Add a profile for another person watching Netflix.</h2>
                        <div className="profile-entry">
                            <div className="profile-add-icon-container">
                                <div className="profile-add-icon">
                                    <img
                                        src={img}
                                        alt="profile image"/>
                                </div>
                            </div>
                            <div className="profile-add-input">
                                <div className="profile-add-inputs">
                                    <input
                                        type="text"
                                        className=""
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <div className="option-wrapper">
                                        <div className="add-kids-option">
                                            <input type="checkbox" id="add-kids-profile" className="add-kids-profile"/>
                                            <label htmlFor="add-kids-profile">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                     className="svg-icon svg-icon-check-mark ltr-4z3qvp e1svuwfo1"
                                                     data-name="Checkmark"
                                                     aria-hidden="true">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                          d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z"
                                                          fill="currentColor"></path>
                                                </svg>
                                            </label>
                                            <span className="add-kids-marker" role="checkbox" tabIndex="0">Kid?</span>
                                             {/*<span className="kids-profile-tooltip"> If selected, this profile will only see TV shows and movies rated for ages 12 and under.</span>*/}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className={`profile-button end save ${name ? "active" : ""}`} onClick={handleSubmit}>Continue</button>
                        <button className="profile-button end" onClick={handleCancel}>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddProfilePage;
