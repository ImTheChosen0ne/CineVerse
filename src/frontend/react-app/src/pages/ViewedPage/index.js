import React, { useState } from "react";
import "./Viewed.css"
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";

function Viewed() {
    const { profileName } = useParams();

    const sessionUser = useSelector(state => state.session.user);

    const selectedProfile = sessionUser.profiles.find(user => user.name === profileName)

    return (
        <div className="viewed-page">
            <div className="viewed-container">
                <div className="viewedcenter">
                    <div className="viewed-center">
                        <header className="activity-header">
                            <div className="activity-header-info">
                                <h1>Activity for {selectedProfile.name}</h1>
                                <nav className="activity-toggle">
                                    <span className="first choice icon viewing">Watching</span>
                                    <NavLink to={`/account/${selectedProfile.name}/ratings`} className="choice icon rating">
                                        Rating
                                    </NavLink>
                                </nav>
                            </div>
                            <img src={selectedProfile.img} alt="profile image"/>
                        </header>
                        {selectedProfile.ratings.map((rating) => (
                            <ul key={rating.ratingId} className="profile-activity-ratings">
                                <li className="profile-activity-row">
                                    <div className="profile-activity-row-date-view">{rating.date}</div>
                                    <div className="profile-activity-row-title">
                                        <a href="">{rating.movie.title}</a>
                                    </div>
                                </li>
                            </ul>
                        ))}
                    </div>
                </div>
            </div>
            <Footer className="account-footer"/>
        </div>
    );
}

export default Viewed;
