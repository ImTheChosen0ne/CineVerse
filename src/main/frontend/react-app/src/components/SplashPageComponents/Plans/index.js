import React from "react";

import './Plans.css';

function Plans() {


    return (
        <>
            <h2>A Plan To Suit Your Needs</h2>
            <div className="splash-price-container">
                <div>
                    <div>
                        <h3>STANDARD WITH ADS</h3>
                        <p>The best savings to enjoy Netflix with a few ad breaks.</p>
                    </div>
                    <div>
                        <p>$6.99/month</p>
                    </div>
                </div>
            </div>
            <div className="splash-price-container">
                <div>
                    <div>
                        <h3>STANDARD</h3>
                        <p>All the entertainment you love, in Full HD video quality.</p>
                    </div>
                    <div>
                        <p>$15.49/month</p>
                    </div>
                </div>
            </div>
            <div className="splash-price-container">
                <div>
                    <div>
                        <h3>PREMIUM</h3>
                        <p>A cinematic experience with the best picture and audio quality.</p>
                    </div>
                    <div>
                        <p>$22.99/month</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Plans;
