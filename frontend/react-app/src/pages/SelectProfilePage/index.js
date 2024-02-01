import React, {useContext, useEffect, useState} from "react";
import './SelectProfilePage.css';
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { ProfileContext } from "../../context/Profile";
import Spinner from "../../components/Spinner";
import kidlogo from "./kidslogo.png"

function SelectProfilePage() {
    const sessionUser = useSelector(state => state.session.user);
    const [loading, setLoading] = useState(true);
    const sortedProfiles = sessionUser.profiles.sort((a, b) => a.profileId - b.profileId);
    const { updateProfile } = useContext(ProfileContext);
    const handleProfileSelect = (profile) => {
        updateProfile(profile);
    };

    useEffect(() => {
        const fetchData = async () => {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        };
        fetchData();
    }, []);

    return (
        <div className="profiles-container">
            <div className="profile-nav"></div>
            <div  className="list-profiles">
                <Spinner loading={loading}/>
            </div>
            {!loading && (
            <div className="list-profiles">
            <div className="profiles">
            <h1>Who's watching?</h1>
                <ul className="choose-profile">
                    {sortedProfiles.map((profile) => (
                        <li key={profile.profileId} className="profile-wrapper">
                            <div>
                                <NavLink to={`/browse/${profile.name}`} onClick={() => handleProfileSelect(profile)}>
                                    <div className="profile-icon">
                                        <img className="profileImg" src={profile.img} alt="profile icon"/>
                                        {!profile.maturity &&
                                        <div className="kid-logo-wrapper">
                                            <img className="kid-logo" src={kidlogo} alt="profile kids"/>
                                        </div>
                                        }
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
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/>
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
            )}
        </div>
    );
}

export default SelectProfilePage;
