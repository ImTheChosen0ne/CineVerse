import React, {useContext, useState} from "react";
import {ProfileContext} from "../../context/Profile";
import {NavLink, useHistory} from "react-router-dom";
import "./EditProfilePage.css"
import {useDispatch, useSelector} from "react-redux";
import {updateUserProfile} from "../../store/session";
function EditProfilePage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const { profile } = useContext(ProfileContext);
    const [name, setName] = useState(profile.name);
    const [img, setImg] = useState(profile.img);
    const [gameHandle, setGameHandle] = useState("");
    const sessionUser = useSelector(state => state.session.user);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedProfile = {
            ...profile,
            name,
            img
        };

        dispatch(updateUserProfile(updatedProfile, sessionUser.userId))

        history.push("/ManageProfiles")
    }

    const handleCancel = async () => {
        history.push("/ManageProfiles")
    }

    const handleDelete = async () => {
        history.push(`/ManageProfiles/${profile.name}/delete`)
    }


    return (
        <div className="edit-profile">
            <div className="header"/>
            <div className="edit-profile-container">
                <div className="edit-profile-center">
                    <form onSubmit={handleSubmit} className="edit-profile-wrapper">
                        <h1>Edit Profile</h1>
                        <div className="profile-entry">
                            <div className="profile-edit-icon-container">
                                <div className="profile-edit-icon">
                                    <img
                                        src={img}
                                        alt="profile image"/>
                                    <button>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg" data-mirrorinrtl="true"
                                             className="svg-icon svg-icon-edit ltr-4z3qvp e1svuwfo1"
                                             data-name="Pencil"
                                             aria-hidden="true">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                  d="M19.1213 1.7071C17.9497 0.535532 16.0503 0.53553 14.8787 1.7071L13.2929 3.29289L12.5858 4L1.58579 15C1.21071 15.3751 1 15.8838 1 16.4142V21C1 22.1046 1.89543 23 3 23H7.58579C8.11622 23 8.62493 22.7893 9 22.4142L20 11.4142L20.7071 10.7071L22.2929 9.12132C23.4645 7.94975 23.4645 6.05025 22.2929 4.87868L19.1213 1.7071ZM15.5858 7L14 5.41421L3 16.4142L3 19C3.26264 19 3.52272 19.0517 3.76537 19.1522C4.00802 19.2527 4.2285 19.4001 4.41421 19.5858C4.59993 19.7715 4.74725 19.992 4.84776 20.2346C4.94827 20.4773 5 20.7374 5 21L7.58579 21L18.5858 10L17 8.41421L6.70711 18.7071L5.29289 17.2929L15.5858 7ZM16.2929 3.12132C16.6834 2.73079 17.3166 2.73079 17.7071 3.12132L20.8787 6.29289C21.2692 6.68341 21.2692 7.31658 20.8787 7.7071L20 8.58578L15.4142 4L16.2929 3.12132Z"
                                                  fill="currentColor"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="profile-edit-info">
                                <div className="profile-edit-inputs">
                                            <input
                                            type="text"
                                            className=""
                                            placeholder="Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            />
                                </div>
                                <div className="game">
                                    <h2>Game Handle:</h2>
                                    <p>Your handle is a unique name that'll be used for playing with other Netflix members across all Netflix Games. </p>
                                    <div className="profile-edit-inputs">
                                        <input
                                            type="text"
                                            className=""
                                            placeholder="Create Hame Handle"
                                            value={gameHandle}
                                            onChange={(e) => setName(e.target.value)}
                                            // required
                                        />
                                    </div>
                                </div>
                                <div className="profile-entry-restrictions">
                                    <h2 className="profile-entry-header">Maturity Settings:</h2>
                                    <div>
                                        <ul>
                                            <li className="profile-maturity-label">All Maturity Ratings</li>
                                        </ul>
                                        <p>Show titles of all maturity ratings for this profile.</p>
                                    </div>
                                    <div>
                                        <NavLink className="profile-button" to="">Edit</NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="profile-button end save">Save</button>
                        <button className="profile-button end" onClick={handleCancel}>Cancel</button>
                        <button className="profile-button end" onClick={handleDelete}>Delete Profile</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProfilePage;
