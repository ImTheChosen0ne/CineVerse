import React from "react";
import downImg from "./boxshot.png"
import downGif from "./download-icon.gif"
import './Download.css';
import downloadImg from "./mobile-0819.jpg";

function Download() {
    return (
            <div className="single-container">
                <div className="asset-div">
                    <div className="splash-container-img">
                        <img className="asset-img" src={downloadImg} alt="download"/>
                        <div className="asset-div-download">
                            <div className="download-img">
                                <img src={downImg}/>
                            </div>
                            <div className="download-text">
                                <p className="download-title">Stranger Things</p>
                                <p className="download-p">Downloading...</p>
                            </div>
                            <img className="down-gif" src={downGif}/>
                        </div>
                    </div>
                </div>
                <div className="text-div">
                <h2>Download your shows to watch offline</h2>
                    <p>Watch on a plane, train, or submarine...</p>
                </div>
            </div>
    )
}

export default Download;
