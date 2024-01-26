import React from "react";

import './Create.css';
import createImg from "./create.png";

function Create() {
    return (
            <div className="single-container">
                <div className="text-div">
                    <h2>Create profiles for kids</h2>
                    <p>Send kids on adventures with their favorite characters in a space made just for them—free with
                        your membership.</p>
                </div>
                <div className="asset-div">
                    <div className="splash-container-img">
                        <img className="asset-img" src={createImg} alt="enjoy"/>
                    </div>
                </div>
            </div>
    );
}

export default Create;
