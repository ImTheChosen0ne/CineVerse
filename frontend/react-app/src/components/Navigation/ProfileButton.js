import React, {useState, useEffect, useRef, useContext} from "react";
import {useDispatch, useSelector} from "react-redux";
import { logout } from "../../store/session";
import {NavLink, useHistory, useLocation} from "react-router-dom";
import {ProfileContext} from "../../context/Profile";

function ProfileButton({ user, profile }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const ulRef = useRef();
  const sessionUser = useSelector(state => state.session.user);
  const { updateProfile, clearProfileData } = useContext(ProfileContext);

  const [showMenu, setShowMenu] = useState(false);
  const [kidProfile, setKidProfile] = useState(profile?.maturity)

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    setKidProfile(profile?.maturity);
  }, [profile]);

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    history.push("/login")
    dispatch(logout());
    clearProfileData();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  const handleSignIn = () => {
    history.push("/login")
  }
  const handleProfileSelect = (profile) => {
    updateProfile(profile);
  };

  return (
    <>
        {user ? (
            <>
              {kidProfile ? (
                  <div className="nav-profile-container">
                    <button onMouseEnter={openMenu} className="nav-profile-button">
                      <img src={profile?.img} alt="profile image" />
                    </button>
                    <span className="caret"></span>
                  </div>
              ) : (
                  <div className="nav-profile-container">
                    <NavLink exact to={"/profile"}>
                      <span className="link-img">
                        <img className="profile-icon-kid"
                            src={profile?.img}
                            alt=""/>
                      </span>
                    </NavLink>
                    <button onClick={() => history.push("/profile")} className="nav-profile-button-kids">
                      <span>Exit Kids</span>
                    </button>
                  </div>
              )}
              <ul className={ulClassName} ref={ulRef} onMouseLeave={closeMenu}>
                <span className="caret-dropdown"></span>
                <div className="profile-dropdown-profiles-container">
                  {sessionUser.profiles.map((profile) => (
                      <li key={profile.profileId}>
                        <div>
                          <NavLink to={`/browse/${profile.name}`} onClick={() => handleProfileSelect(profile)}>
                                <div className="profile-dropdown-profile-icon">
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
                      )
                  )}
                </div>
                <div className="account-pulldown">
                  <li>
                    <NavLink to={`/ManageProfiles`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                           data-mirrorinrtl="true" className="ltr-4z3qvp e1svuwfo1" data-name="Pencil"
                           aria-hidden="true">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M19.1213 1.7071C17.9497 0.535532 16.0503 0.53553 14.8787 1.7071L13.2929 3.29289L12.5858 4L1.58579 15C1.21071 15.3751 1 15.8838 1 16.4142V21C1 22.1046 1.89543 23 3 23H7.58579C8.11622 23 8.62493 22.7893 9 22.4142L20 11.4142L20.7071 10.7071L22.2929 9.12132C23.4645 7.94975 23.4645 6.05025 22.2929 4.87868L19.1213 1.7071ZM15.5858 7L14 5.41421L3 16.4142L3 19C3.26264 19 3.52272 19.0517 3.76537 19.1522C4.00802 19.2527 4.2285 19.4001 4.41421 19.5858C4.59993 19.7715 4.74725 19.992 4.84776 20.2346C4.94827 20.4773 5 20.7374 5 21L7.58579 21L18.5858 10L17 8.41421L6.70711 18.7071L5.29289 17.2929L15.5858 7ZM16.2929 3.12132C16.6834 2.73079 17.3166 2.73079 17.7071 3.12132L20.8787 6.29289C21.2692 6.68341 21.2692 7.31658 20.8787 7.7071L20 8.58578L15.4142 4L16.2929 3.12132Z"
                              fill="currentColor"></path>
                      </svg>
                      <span>Manage Profiles</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/account`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                           className="ltr-4z3qvp e1svuwfo1" data-name="User" aria-hidden="true">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M15 5C15 6.65685 13.6569 8 12 8C10.3431 8 9 6.65685 9 5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5ZM17 5C17 7.76142 14.7614 10 12 10C9.23858 10 7 7.76142 7 5C7 2.23858 9.23858 0 12 0C14.7614 0 17 2.23858 17 5ZM4 21C4 16.5817 7.58172 13 12 13C16.4183 13 20 16.5817 20 21V21.5136C19.5678 21.5667 18.9844 21.6327 18.2814 21.6988C16.6787 21.8495 14.461 22 12 22C9.53901 22 7.32131 21.8495 5.71861 21.6988C5.01564 21.6327 4.43224 21.5667 4 21.5136V21ZM21.1508 23.3775C21.1509 23.3774 21.151 23.3774 21 22.3889L21.151 23.3774C21.6393 23.3028 22 22.8829 22 22.3889V21C22 15.4772 17.5228 11 12 11C6.47715 11 2 15.4772 2 21V22.3889C2 22.8829 2.36067 23.3028 2.84897 23.3774L3 22.3889C2.84897 23.3774 2.84908 23.3774 2.8492 23.3775L2.84952 23.3775L2.85043 23.3776L2.85334 23.3781L2.86352 23.3796L2.90103 23.3852C2.93357 23.3899 2.98105 23.3968 3.04275 23.4055C3.16613 23.4228 3.3464 23.4472 3.57769 23.4765C4.04018 23.535 4.7071 23.6126 5.5314 23.6901C7.1787 23.8449 9.461 24 12 24C14.539 24 16.8213 23.8449 18.4686 23.6901C19.2929 23.6126 19.9598 23.535 20.4223 23.4765C20.6536 23.4472 20.8339 23.4228 20.9573 23.4055C21.0189 23.3968 21.0664 23.3899 21.099 23.3852L21.1365 23.3796L21.1467 23.3781L21.1496 23.3776L21.1505 23.3775L21.1508 23.3775Z"
                              fill="currentColor"></path>
                      </svg>
                      <span>Account</span>
                    </NavLink>
                  </li>
                </div>
                <li className="dropDown-button">
                  <button onClick={handleLogout}>Sign out of CineVerse</button>
                </li>
              </ul>
            </>
        ) : (
            <>
            <button onClick={handleSignIn} className="sign-in">Sign In</button>
            </>
        )}
    </>
  );
}

export default ProfileButton;
