import React from "react";

import './Watch.css';
import watchImg from "./device-pile.png";
import tvVid from "./video-devices.m4v";

function Watch() {
    return (
        <div className="single-container">
            <div className="asset-div">
                <div className="splash-container-img">
                    <img className="asset-img" src={watchImg} alt="enjoy"/>
                    <div className="asset-div-vid-watch">
                        <video src={tvVid} autoPlay muted playsInline loop/>
                    </div>
                </div>
            </div>
            <div className="text-div">
                <h2>Watch everywhere</h2>
                <p>Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.</p>
            </div>
        </div>
    );
}

export default Watch;
