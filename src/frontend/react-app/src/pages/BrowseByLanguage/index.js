import React from "react";

import "./BrowseByLanguage.css";
import Footer from "../../components/Footer";


function BrowseByLanguage() {

    return (
        <div className="language-container">
            <div className="language-container-title">
                <div className="language-wrapper-title">
                    <h1>Browse by Languages</h1>
                </div>
            </div>
            <div className="language-movies">

            </div>
            <Footer className="language-footer"/>
        </div>
    );
}

export default BrowseByLanguage;
