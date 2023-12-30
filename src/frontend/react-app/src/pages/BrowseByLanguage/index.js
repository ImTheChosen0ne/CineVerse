import React, {useEffect, useRef, useState} from "react";

import "./BrowseByLanguage.css";
import Footer from "../../components/Footer";


function BrowseByLanguage() {
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [selectedSort, setSelectedSort] = useState("Suggestions For You");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
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

            </div>
            <Footer className="language-footer"/>
        </div>
    );
}

export default BrowseByLanguage;
