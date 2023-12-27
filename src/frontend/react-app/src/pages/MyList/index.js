import React from "react";

import "./MyList.css";
import Footer from "../../components/Footer";


function MyList() {

    return (
        <div className="my-list-container">
            <div className="my-list-container-title">
                <div className="my-list-wrapper-title">
                    <h1>My List</h1>
                </div>
            </div>
            <div className="my-list-movies">

            </div>
            <Footer className="my-list-footer"/>
        </div>
    );
}

export default MyList;
