import React from "react";
import './SplashPage.css';
import Faq from "../../components/SplashPageComponents/Faq";
import SignUpSplash from "../../components/SplashPageComponents/SignUpSplash";
import Info from "../../components/SplashPageComponents/Info";
import Enjoy from "../../components/SplashPageComponents/Enjoy";
import Watch from "../../components/SplashPageComponents/Watch";
import Create from "../../components/SplashPageComponents/Create";
import splashPhoto from "./main-splash-photo.jpg";
function SplashPage() {
    return (
        <div className="splashPage">
                <div className="splash-main">
                    <div className="splash-main-img">
                        <img src={splashPhoto}  alt="Splash Photo"/>
                        <div className="gradient"></div>
                    </div>
                    <div className="splash-main-text">
                        <h1>Unlimited movies, TV shows, and more</h1>
                        <p>Watch anywhere. Cancel anytime.</p>
                        <div className="signup-container">
                            <SignUpSplash/>
                        </div>
                    </div>

                </div>
            <div className="info-container">
                <Info/>
            </div>
            <div className="enjoy-container">
                <Enjoy/>
            </div>
            <div className="watch-container">
                <Watch/>
            </div>
            <div className="trending-splash-container">
                <Create/>
            </div>
            <div className="faq-container">
                <Faq/>
            </div>
            <div className="signup-container">
                <SignUpSplash/>
            </div>

        </div>
    );
}

export default SplashPage;
