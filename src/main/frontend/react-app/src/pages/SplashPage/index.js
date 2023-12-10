import React from "react";
import './SplashPage.css';
import Games from "../../components/SplashPageComponents/Games";
import Trending from "../../components/SplashPageComponents/Trending";
import Plans from "../../components/SplashPageComponents/Plans";
import Reasons from "../../components/SplashPageComponents/Reasons";
import Faq from "../../components/SplashPageComponents/Faq";
import SignUpSplash from "../../components/SplashPageComponents/SignUpSplash";

function SplashPage() {
    return (
        <div className="splashPage">
            <div>
                <div>
                    <div>
                        <h1>Unlimited movies, TV shows, and more</h1>
                        <p>Starts at $6.99. Cancel anytime.</p>
                    </div>
                    <div className="signup-container">
                        <SignUpSplash />
                    </div>
                </div>
            </div>
            <div>
                <div className="plans">
                    <Plans/>
                </div>
                <div className="trending-splash-container">
                    <Trending/>
                </div>
                <div className="mobile-games-container">
                    <Games/>
                </div>
                <div className="reasons-container">
                    <Reasons/>
                </div>
                <div className="faq-container">
                    <Faq/>
                </div>
                <div className="signup-container">
                    <SignUpSplash />
                </div>
            </div>
        </div>
    );
}

export default SplashPage;
