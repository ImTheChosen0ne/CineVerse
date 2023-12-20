import React, {useContext} from "react";
import './SelectProfilePage.css';
import { useSelector } from "react-redux";
import {NavLink} from "react-router-dom";
import BrowsePage from "../BrowsePage";
import {ProfileContext} from "../../context/Profile";

function SelectProfilePage() {
    const sessionUser = useSelector(state => state.session.user);
    const { updateProfile } = useContext(ProfileContext);
    const handleProfileSelect = (profile) => {
        updateProfile(profile);
    };


    return (
        <div className="profiles-container">
            <div className="profiles">
            <h1>Who's watching?</h1>
                <ul>
                {sessionUser.profiles.map((profile) => (
                    <li key={profile.profileId}>
                           <div>
                               <NavLink to={`/browse/${profile.name}`} onClick={() => handleProfileSelect(profile)}>
                                   <div className="profile-icon">
                                       <img src="https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABbGa4GvjA3sdbhrXZi7RG0-nuSXUxt-IZoVxB_7lHtMKT-wQ-CsDeukenQ6z6x4iUdqx4NJR4Sr3RDraWK1uYyKWRapH8T-tnFtb.png?r=59d" alt="profile icon"/>
                                   </div>
                               <span>
                                   {profile.name}
                               </span>
                               </NavLink>
                           </div>
                    </li>
                ))}
                </ul>
            </div>
        </div>
    );
}

export default SelectProfilePage;
