import React, {useContext, useState} from "react";
import {ProfileContext} from "../../context/Profile";
import "./DeleteProfilePage.css"
import {NavLink, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {deleteProfile} from "../../store/session";
function DeleteProfilePage() {
    const history = useHistory()
    const dispatch = useDispatch()
    const { profile } = useContext(ProfileContext);
    const sessionUser = useSelector(state => state.session.user);


    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(deleteProfile(sessionUser, profile.profileId))
        history.push("/profile")
    }

    const handleCancel = async () => {
        history.goBack()
    }

    return (
        <div className="delete-profile">
            <div className="header"/>
            <div className="delete-profile-container">
                <div className="delete-profile-center">
                    <form onSubmit={handleSubmit} className="delete-profile-wrapper">
                        <h1>Delete Profile?</h1>
                        <div className="profile-entry">
                            <div className="profile-delete-icon-container">
                                <div className="profile-delete-icon">
                                    <img
                                        src={profile.img}
                                        alt="profile image"/>
                                    <div className="profile-name">
                                        {profile.name}
                                    </div>
                                </div>
                            </div>
                            <div className="profile-delete-warning">
                                    This profile's history - including My List, ratings and activity - will be gone forever, and you won't be able to access it again.
                            </div>
                        </div>
                        <button className="profile-button end save" onClick={handleCancel}>Keep Profile</button>
                        <button className="profile-button end" onClick={handleSubmit}>Delete Profile</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DeleteProfilePage;
