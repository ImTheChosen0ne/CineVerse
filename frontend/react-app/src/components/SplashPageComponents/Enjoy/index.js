import React from "react";
import enjoyTv from "./tv.png";
import tvVid from "./video-tv.m4v";

import './Enjoy.css';

function Enjoy() {
    return (
        <div className="single-container">
            <div className="text-div">
                <h2>Enjoy on your TV</h2>
                <p>Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.</p>
            </div>
            <div className="asset-div">
                <div className="splash-container-img">
                    <img className="asset-img" src={enjoyTv} alt="enjoy"/>
                    <div className="asset-div-vid">
                        <video src={tvVid} autoPlay muted playsInline loop/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Enjoy;
