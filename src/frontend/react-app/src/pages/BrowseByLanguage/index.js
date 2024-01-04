import React, {useEffect, useRef, useState} from "react";

import "./BrowseByLanguage.css";
import Footer from "../../components/Footer";
import {useDispatch, useSelector} from "react-redux";
import {getMovies} from "../../store/movies";
import OpenMovieModal from "../../components/OpenMovieModal";
import {useMiniModal} from "../../context/MiniModal";


function BrowseByLanguage() {
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [selectedSort, setSelectedSort] = useState("Suggestions For You");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const { setModalContent, modalRef } = useMiniModal();

    const movies = Object.values(useSelector((state) => state.movies));

    useEffect(() => {
        dispatch(getMovies());
    }, [dispatch]);

    const handleSelectLanguage = (event) => {
        setSelectedLanguage(event.target.value);
        setIsOpen(false);
    };

    const handleSelectSort = (event) => {
        setSelectedSort(event.target.value);
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

   useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const onMouseEnter = (movie, event) => {
        const rect = event.target.getBoundingClientRect();
        const positionInfo = {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };

        setModalContent(<OpenMovieModal movie={movie} position={positionInfo}/>);
    };

    const languages = [
        { code: 'ar', name: 'Arabic' },
        { code: 'yue', name: 'Cantonese' },
        { code: 'da', name: 'Danish' },
        { code: 'nl', name: 'Dutch' },
        { code: 'en', name: 'English' },
        { code: 'fil', name: 'Filipino' },
        { code: 'nl-BE', name: 'Flemish' },
        { code: 'fr', name: 'French' },
        { code: 'fr-CA', name: 'French Canadian' },
        { code: 'de', name: 'German' },
        { code: 'hi', name: 'Hindi' },
        { code: 'id', name: 'Indonesian' },
        { code: 'it', name: 'Italian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'ar-LB', name: 'Lebanese' },
        { code: 'ms', name: 'Malay' },
        { code: 'ml', name: 'Malayalam' },
        { code: 'zh', name: 'Mandarin' },
        { code: 'mr', name: 'Marathi' },
        { code: 'no', name: 'Norwegian' },
        { code: 'pl', name: 'Polish' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'es', name: 'Spanish' },
        { code: 'sv', name: 'Swedish' },
        { code: 'ta', name: 'Tamil' },
        { code: 'te', name: 'Telugu' },
        { code: 'th', name: 'Thai' },
        { code: 'tr', name: 'Turkish' },
        { code: 'vi', name: 'Vietnamese' },
    ];

    const filteredMovies = movies.filter(
        (movie) =>
            movie.language?.toLowerCase().includes(selectedLanguage)
    );

    return (
        <div className="language-container">
            <div className="language-container-header">
                <div className="language-wrapper-title">
                    <h1>Browse by Languages</h1>
                </div>
                <div className="language-dropdown-container" ref={dropdownRef}>
                    <span>Select Your Preferences</span>
                    <div className="languageDropDown-wrapper">
                        <select className="language-dropdown" value={selectedLanguage} onChange={handleSelectLanguage}>
                            {languages.map((language) => (
                                <option key={language.code} value={language.code} >
                                    {language.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="languageDropDown-sort">
                        <span>Sort by</span>
                        <select className="language-dropdown" value={selectedSort} onChange={handleSelectSort}>
                            <option value="Suggested">Suggestions For You</option>
                            <option value="Year">Year Released</option>
                            <option value="A-Z">A-Z</option>
                            <option value="Z-A">Z-A</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="language-movies">
                <div className="language-movie-container">
                    <div className="language-movie-wrapper">
                        {filteredMovies.map((movie, index) => (
                            <div
                                key={movie?.movieId}
                                className="language-movie"
                                onMouseEnter={(event) => onMouseEnter(movie, event)}
                            >
                                <div className="language-movie-img">
                                    <img className="poster"  src={movie?.media} alt={movie?.title} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer className="language-footer"/>
        </div>
    );
}

export default BrowseByLanguage;
