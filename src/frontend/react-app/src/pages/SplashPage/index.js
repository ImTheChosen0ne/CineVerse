import React from "react";
import './SplashPage.css';
import Faq from "../../components/SplashPageComponents/Faq";
import SignUpSplash from "../../components/SplashPageComponents/SignUpSplash";
import Info from "../../components/SplashPageComponents/Info";
import Enjoy from "../../components/SplashPageComponents/Enjoy";
import Watch from "../../components/SplashPageComponents/Watch";
import Create from "../../components/SplashPageComponents/Create";
import splashPhoto from "./main-photo.jpg";
import Download from "../../components/SplashPageComponents/Download";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../../components/Footer";
function SplashPage() {
    const sessionUser = useSelector((state) => state.session.user);

    if (sessionUser) return <Redirect to="/profile" />;

    return (
        <div className="splashPage">
            <div className="splash-main">
                <div className="splash-main-img">
                    <img src={splashPhoto} alt="Splash Photo"/>
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
            <div className="splash-container">
                <Enjoy/>
            </div>
            <div className="divider"/>
            <div className="splash-container">
                <Watch/>
            </div>
            <div className="divider"/>
            <div className="splash-container">
                <Create/>
            </div>
            <div className="divider"/>
            <div className="splash-container">
                <Download/>
            </div>
            <div className="divider"/>
            <div className="splash-container">
                <div className="single-faq-container">
                    <Faq/>
                    <SignUpSplash/>
                </div>
            </div>
            <div className="divider"/>
            <Footer />
        </div>
    );
}

export default SplashPage;
