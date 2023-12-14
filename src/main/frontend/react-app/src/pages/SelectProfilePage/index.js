import React from "react";
import './SelectProfilePage.css';
import { useSelector } from "react-redux";
import {NavLink} from "react-router-dom";

function SelectProfilePage() {
    const sessionUser = useSelector(state => state.session.user);

    const handleSubmit = async (e) => {
        e.preventDefault();

    };

    return (
        <div className="profiles-container">
            <div className="profiles">
            <h1>Who's watching?</h1>
                <ul>
                {sessionUser.profiles.map((profile) => (
                    <li key={profile.id}>
                           <div>
                               <NavLink to="/browse">
                                   <div className="profile-icon">
                                       <img src="https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABbGa4GvjA3sdbhrXZi7RG0-nuSXUxt-IZoVxB_7lHtMKT-wQ-CsDeukenQ6z6x4iUdqx4NJR4Sr3RDraWK1uYyKWRapH8T-tnFtb.png?r=59d"/>
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
