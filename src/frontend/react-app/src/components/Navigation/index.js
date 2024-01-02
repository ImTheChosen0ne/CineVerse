import React, {useContext, useEffect, useRef, useState} from 'react';
import {NavLink, useHistory, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { ProfileContext } from "../../context/Profile";
import logo from "./logo.png"
import {getMovies} from "../../store/movies";

function Navigation({ isLoaded }){
	const dispatch = useDispatch();
	const location = useLocation();
	const history = useHistory();
	const searchRef = useRef(null);
	const currentLocationRef = useRef(location.pathname);

	const sessionUser = useSelector(state => state.session.user);

	const { profile } = useContext(ProfileContext);

	const [scrolled, setScrolled] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const [isSearchVisible, setIsSearchVisible] = useState(false);
	const [previousLocation, setPreviousLocation] = useState(null);

	useEffect(() => {
		dispatch(getMovies());
	}, [dispatch]);

	useEffect(() => {
		if (searchInput !== '') {
			history.push(`/search?query=${searchInput}`);
		} else if (previousLocation) {
			history.push(previousLocation);
		}
	}, [searchInput, previousLocation, history]);

	const handleClearInput = () => {
		setSearchInput('');
	};

	const handleSearchClick = () => {
		setIsSearchVisible(true);
		setPreviousLocation(location.pathname);
	};

	useEffect(() => {
		currentLocationRef.current = location.pathname;
	}, [location.pathname]);

	const handleCloseSearch = (e) => {
		const currentLocation = currentLocationRef.current;
		if (searchRef.current && !searchRef.current.contains(e.target)) {
			if (currentLocation !== '/search' || searchInput === '') {
				setSearchInput("");
				setIsSearchVisible(false);
			}
		}
	};

	useEffect(() => {
		window.addEventListener('click', handleCloseSearch);

		return () => {
			window.removeEventListener('click', handleCloseSearch);
		};
	}, [handleCloseSearch]);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 0) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const hideNavigationRoutes = ['/login'];
	const hideNavigation = hideNavigationRoutes.includes(location.pathname);

	if (hideNavigation) {
		return null;
	}

	const pageNotFound = ![
		'/',
		'/signup',
		`/browse/${profile?.name}`,
		'/browse/latest',
		'/browse/MyList',
		'/browse/language',
		"/search",
		'/account'
	].includes(location.pathname);

	let navClassName = "";
	let navHome = "";
	let navAccount = "";
	let navMyList = "";

	if (pageNotFound) {
		navClassName = 'page-not-found-nav';
	} else if (location.pathname === '/signup') {
		navClassName = 'signup-nav';
	} else if (location.pathname === '/') {
		navClassName = 'splash-nav';
		navHome = 'splash';
	} else if (location.pathname === '/account') {
		navAccount = 'account';
	} else if (location.pathname === '/browse/MyList' || location.pathname === '/browse/latest' || location.pathname === '/browse/language' || location.pathname === '/search') {
		navMyList = 'my-list';
	} else if (
		location.pathname === `/browse/${profile?.name}` ||
		location.pathname === '/browse/latest' ||
		location.pathname === '/browse/MyList' ||
		location.pathname === '/browse/language' ||
		location.pathname === `/search`
	) {
		navClassName = 'browse-nav';
		navClassName = scrolled ? 'browse-nav scrolled' : '';
	}

	return (
		<ul className={`navigation browse-nav ${navClassName} ${navAccount} ${navHome} ${navMyList}`}>
			<li className="logo">
				<NavLink class="logo" exact to={`/browse/${profile?.name}`}>
					<img src={logo} alt="logo"/>
				</NavLink>
			</li>
			<div className={`browse-links ${navAccount}`}>
				<li className="nav-links">
					<NavLink exact to={`/browse/${profile?.name}`}>Home</NavLink>
				</li>
				<li className="nav-links">
					<NavLink exact to="/browse/latest">New & Popular</NavLink>
				</li>
				<li className="nav-links">
					<NavLink exact to="/browse/MyList">My List</NavLink>
				</li>
				<li className="nav-links">
					<NavLink exact to="/browse/language">Browse By Languages</NavLink>
				</li>
			</div>
			<div className="browse-nav-profile">
				<li className={`nav-links-search ${isSearchVisible ? 'search-visible' : ''} ${navHome} ${navAccount}`}
					ref={searchRef}>
					{/*<form>*/}
						<button className="search-link" onClick={handleSearchClick}>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
								 xmlns="http://www.w3.org/2000/svg"
								 className="search-icon ltr-4z3qvp e1svuwfo1" data-name="MagnifyingGlass"
								 aria-hidden="true">
								<path fill-rule="evenodd" clip-rule="evenodd"
									  d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10ZM15.6177 17.0319C14.078 18.2635 12.125 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 12.125 18.2635 14.078 17.0319 15.6177L22.7071 21.2929L21.2929 22.7071L15.6177 17.0319Z"
									  fill="currentColor"></path>
							</svg>
						</button>
						{isSearchVisible && (
							<div className="searchBox">
								<div className="searchInput">
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
										 xmlns="http://www.w3.org/2000/svg" className="search-icon ltr-4z3qvp e1svuwfo1"
										 data-name="MagnifyingGlass" aria-hidden="true">
										<path fill-rule="evenodd" clip-rule="evenodd"
											  d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10ZM15.6177 17.0319C14.078 18.2635 12.125 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 12.125 18.2635 14.078 17.0319 15.6177L22.7071 21.2929L21.2929 22.7071L15.6177 17.0319Z"
											  fill="currentColor">

										</path>
									</svg>
									<label className="searchInput-label">
										Search
									</label>
									<input type="text"
										   placeholder="Title, people, genres"
										   maxLength="80"
										   value={searchInput}
										   onChange={(e) => setSearchInput(e.target.value)}
										   className="search-input"
									/>
									<span role="button" className="icon-close" onClick={handleClearInput}>
								<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100"
									 viewBox="0 0 72 72">
									<path
										d="M 19 15 C 17.977 15 16.951875 15.390875 16.171875 16.171875 C 14.609875 17.733875 14.609875 20.266125 16.171875 21.828125 L 30.34375 36 L 16.171875 50.171875 C 14.609875 51.733875 14.609875 54.266125 16.171875 55.828125 C 16.951875 56.608125 17.977 57 19 57 C 20.023 57 21.048125 56.609125 21.828125 55.828125 L 36 41.65625 L 50.171875 55.828125 C 51.731875 57.390125 54.267125 57.390125 55.828125 55.828125 C 57.391125 54.265125 57.391125 51.734875 55.828125 50.171875 L 41.65625 36 L 55.828125 21.828125 C 57.390125 20.266125 57.390125 17.733875 55.828125 16.171875 C 54.268125 14.610875 51.731875 14.609875 50.171875 16.171875 L 36 30.34375 L 21.828125 16.171875 C 21.048125 15.391875 20.023 15 19 15 z">

									</path>
								</svg>
							</span>
								</div>
							</div>
						)}
					{/*</form>*/}
				</li>
				{isLoaded && (
					<li className="browse-nav-profile-button">
						<ProfileButton user={sessionUser} profile={profile}/>
					</li>
				)}
			</div>
		</ul>
	);
}

export default Navigation;