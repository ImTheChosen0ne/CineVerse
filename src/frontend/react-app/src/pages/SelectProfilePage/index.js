import React, {useContext} from "react";
import './SelectProfilePage.css';
import { useSelector } from "react-redux";
import {NavLink, useHistory} from "react-router-dom";
import {ProfileContext} from "../../context/Profile";

function SelectProfilePage() {
    const history = useHistory()
    const sessionUser = useSelector(state => state.session.user);

    const { updateProfile } = useContext(ProfileContext);
    const handleProfileSelect = (profile) => {
        updateProfile(profile);
    };

    return (
        <div className="profiles-container">
            <div className="list-profiles">
            <div className="profiles">
            <h1>Who's watching?</h1>
                <ul className="choose-profile">
                    {sessionUser.profiles.map((profile) => (
                        <li key={profile.profileId} className="profile-wrapper">
                            <div>
                                <NavLink to={`/browse/${profile.name}`} onClick={() => handleProfileSelect(profile)}>
                                    <div className="profile-icon">
                                        <img
                                            src={profile.img}
                                            alt="profile icon"/>
                                    </div>
                                    <span>
                                   {profile.name}
                               </span>
                                </NavLink>
                            </div>
                        </li>
                    ))}
                    <li className={`profile-wrapper add ${sessionUser.profiles.length === 5 ? "hide" : ""}`}>
                        <div>
                            <NavLink to={`/ManageProfiles/new`}>
                                <div className="profile-icon add">
                                    <div className="addIconSvg">
                                        <div className="addIcon">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 24 24">
                                                <path
                                                    d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <span>
                                   Add Profile
                               </span>
                            </NavLink>
                        </div>
                    </li>
                </ul>
            </div>
                <span className="manage-profile-button">
                <NavLink to="/ManageProfiles">
                    Manage Profiles
                </NavLink>
            </span>
            </div>
        </div>
    );
}

export default SelectProfilePage;
