import React, {useContext} from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import {ProfileContext} from "../../context/Profile";

function Navigation({ isLoaded }){
	const location = useLocation();
	const sessionUser = useSelector(state => state.session.user);
	const { profile } = useContext(ProfileContext);

	const hideNavigation = location.pathname === '/login'
	if (hideNavigation) {
		return null;
	}

	let navClassName = null;
	const signInButton = location.pathname === '/signup'
	if (signInButton) {
		navClassName = "signup-nav";
	}

	const splash = location.pathname === '/'
	if (splash) {
		navClassName = "splash-nav";
	}

	const browse = location.pathname === `/browse/${profile?.name}`|| location.pathname === "/browse/new" || location.pathname === "/browse/my_list" || location.pathname === "/browse/language" || location.pathname === "/browse/search"
	if (browse) {
		navClassName = "browse-nav";
	}

	return (
		<ul className={`navigation ${navClassName}`}>
			<li>
				<NavLink exact to={`/browse/${profile?.name}`}>CineVerse</NavLink>
			</li>
			<li className="nav-links">
				<NavLink exact to={`/browse/${profile?.name}`}>Home</NavLink>
			</li>
			<li className="nav-links">
				<NavLink exact to="/browse/new">New & Popular</NavLink>
			</li>
			<li className="nav-links">
				<NavLink exact to="/browse/my_list">My List</NavLink>
			</li>
			<li className="nav-links">
				<NavLink exact to="/browse/language">Browse By Languages</NavLink>
			</li>
			<li className="nav-links">
				<NavLink exact to="/browse/search">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
						 className="search-icon ltr-4z3qvp e1svuwfo1" data-name="MagnifyingGlass" aria-hidden="true">
						<path fill-rule="evenodd" clip-rule="evenodd"
							  d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10ZM15.6177 17.0319C14.078 18.2635 12.125 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 12.125 18.2635 14.078 17.0319 15.6177L22.7071 21.2929L21.2929 22.7071L15.6177 17.0319Z"
							  fill="currentColor"></path>
					</svg>
				</NavLink>
			</li>
			{isLoaded && (
				<li>
					<ProfileButton user={sessionUser}/>
				</li>
			)}
		</ul>
	);
}

export default Navigation;