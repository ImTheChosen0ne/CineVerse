import React, {useState} from "react";
import "./Account.css"
import Footer from "../../components/Footer";
import {useSelector} from "react-redux";
import {NavLink} from "react-router-dom";

function Account() {
    const sessionUser = useSelector(state => state.session.user);

    const [selectedProfile, setSelectedProfile] = useState(null);
    const selectProfile = (profileId) => {
        setSelectedProfile(profileId === selectedProfile ? null : profileId);
    };

    return (
        <div className="account-page">
            <div className="account-container">
                <div className="account-center">
                    <div>
                        <h1>Account</h1>
                        <div className="account-content">
                            <div className="account-section">
                                <header>
                                    <h2>Membership & Billing</h2>
                                </header>
                                <section className="account-info">
                                    <div className="account-subsection">
                                        <div className="account-subsection-group">
                                            <div className="account-email">
                                                <b>
                                                {sessionUser.email}
                                                </b>
                                            </div>
                                            <div className="account-password">
                                                Password: ********
                                            </div>
                                        </div>
                                        <div className="account-subsection-group">
                                            <div className="account-section-item">
                                                <NavLink to="">Change account email</NavLink>
                                            </div>
                                            <div className="account-section-item">
                                                <NavLink to="">Change password</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div className="account-section">
                                <header>
                                    <h2>Plan Details</h2>
                                </header>
                                <section className="account-info">
                                    <div className="account-subsection">
                                        <div className="account-subsection-group">
                                            <div className="account-email">
                                                <b>Standard</b>
                                                <svg viewBox="0 0 1740 960" className="quality-icon">
                                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <path
                                                            d="M700,549 L398,549 L398,746 L300,746 L300,247 L398,247 L398,443 L700,443 L700,247 L799,247 L799,746 L700,746 L700,549 Z M1196,247 C1271,247 1326,260 1359,286 C1387,306 1408,335 1424,372 C1440,408 1448,449 1448,493 C1448,591 1419,661 1359,706 C1326,732 1271,746 1196,746 L950,746 L950,247 L1196,247 Z M1186,639 C1316,639 1343,562 1343,493 C1343,427 1329,351 1186,351 L1048,351 L1048,639 L1186,639 Z"
                                                            fill="currentColor"></path>
                                                        <path
                                                            d="M1608.00019,0 C1681.00009,0 1740,59 1740,132 L1740,827 C1740,868.423884 1721.51202,905.147426 1692.42954,929.452533 C1669.55882,948.56629 1640.13605,960 1608.00019,960 L133.999803,960 C58.9999134,960 0,901 0,827 L0,132 C0,59 58.9999134,0 133.999803,0 L1608.00019,0 Z M133.999803,80 C103.999847,80 79.9998826,103 79.9998826,132 L79.9998826,827 C79.9998826,857 103.999847,880 133.999803,880 L1608.00019,880 C1637.00015,880 1660.00012,856 1660.00012,827 L1660.00012,132 C1660.00012,103 1637.00015,80 1608.00019,80 L133.999803,80 Z"
                                                            fill="currentColor"></path>
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="account-subsection-group">
                                            <div className="account-section-item">
                                                <NavLink to="">Change plan</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div className="account-section">
                                <header>
                                    <h2>Profile & Parental Controls</h2>
                                </header>
                                <section className="account-info">
                                    <div className="account-subsection">
                                        <div className="account-subsection-group-profile">
                                            <ul>
                                            {sessionUser.profiles.map((profile) => (
                                                <li className="account-profile" key={profile.profileId} onClick={() => selectProfile(profile.profileId)}>
                                                    <div className="profile-div">
                                                    <div>
                                                        <img src={profile.img} alt="profile image"/>
                                                    </div>
                                                    <div className="profile-summary">
                                                        <h3><b>{profile.name}</b></h3>
                                                        {profile.maturity ? (
                                                            <div>All Maturity Ratings</div>
                                                        ) : (
                                                            <div>TV-PG PG and below</div>
                                                        )}
                                                    </div>
                                                    <button className="profile-account-button">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             className="svg-icon svg-icon-chevron-down default-ltr-cache-4z3qvp e1svuwfo1"
                                                             data-name="ChevronDown" aria-hidden="true">
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                  d="M12 15.5859L19.2928 8.29297L20.7071 9.70718L12.7071 17.7072C12.5195 17.8947 12.2652 18.0001 12 18.0001C11.7347 18.0001 11.4804 17.8947 11.2928 17.7072L3.29285 9.70718L4.70706 8.29297L12 15.5859Z"
                                                                  fill="currentColor"></path>
                                                        </svg>
                                                    </button>
                                                    </div>
                                                    {selectedProfile === profile.profileId && (
                                                    <ul className="profile-links">
                                                        <li>
                                                            <NavLink to="" className="profile-link">
                                                                <div className="profile-main">
                                                                    <h4><b>Language</b></h4>
                                                                    {}
                                                                </div>
                                                                <div className="profile-change">Change</div>
                                                            </NavLink>
                                                        </li>
                                                        <li>
                                                            <NavLink to="" className="profile-link">
                                                                <div className="profile-main">
                                                                    <h4><b>Viewing Restrictions</b></h4>
                                                                    {}
                                                                </div>
                                                                <div className="profile-change">Change</div>
                                                            </NavLink>
                                                        </li>
                                                        <li>
                                                            <NavLink to={`/account/${profile.name}/viewed`} className="profile-link">
                                                                <div className="profile-main">
                                                                    <h4><b>Viewing activity</b></h4>
                                                                </div>
                                                                <div className="profile-change">View</div>
                                                            </NavLink>
                                                        </li>
                                                        <li>
                                                            <NavLink to={`/account/${profile.name}/ratings`} className="profile-link-final">
                                                                <div className="profile-main">
                                                                    <h4><b>Ratings</b></h4>
                                                                </div>
                                                                <div className="profile-change">View</div>
                                                            </NavLink>
                                                        </li>
                                                    </ul>
                                                    )}
                                                </li>
                                            ))}
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer className="account-footer"/>
        </div>
    );
}

export default Account;
