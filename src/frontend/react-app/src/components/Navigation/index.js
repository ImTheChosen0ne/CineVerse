import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
	const location = useLocation();
	const sessionUser = useSelector(state => state.session.user);
	// const hideNavigation = location.pathname === '/login' || location.pathname === '/';
	const hideNavigation = location.pathname === '/login'
	if (hideNavigation) {
		return null;
	}

	let navClassName = null;
	const signInButton = location.pathname === '/signup'
	if (signInButton) {
		navClassName = "signup-nav";
	}

	return (
		<ul className={`navigation ${navClassName}`}>
			<li>
				<NavLink exact to="/">CineVerse</NavLink>
			</li>
			{isLoaded && (
				<li>
					<ProfileButton user={sessionUser} />
				</li>
			)}
		</ul>
	);
}

export default Navigation;