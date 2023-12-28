import React from "react";

import './Footer.css';
import {useLocation} from "react-router-dom";


function Footer() {
    const location = useLocation();

    let footerClassName = "";
    // const footerCss = location.pathname === '/signup' || location.pathname === '/account'
    //
    // if (footerCss) {
    //     footerClassName = "signup-footer";
    // }

    if (location.pathname === '/signup') {
        footerClassName = 'signup-footer';
    } else if (location.pathname === '/account') {
        footerClassName = 'account-footer';
    } else if (location.pathname === '/browse/MyList' || location.pathname === '/browse/language') {
        footerClassName = 'my-list-footer';
    }

    return (
        <div className={`footer ${footerClassName}`}>
            <div className="footer-container">
                <div>
                    <div className="about">
                        <h3>
                            <i className="fa-regular fa-copyright"></i>2023 CineVerse inspired
                            by Netflix
                        </h3>
                    </div>
                    <div className="footer-links">
                        <p>Matthew Almeida</p>
                        <a href="https://github.com/ImTheChosen0ne">
                            <i className="fa-brands fa-github"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/matthew-almeida-103425183/">
                            <i className="fa-brands fa-linkedin"></i>
                        </a>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <div className="made-with">Made with:</div>
                            <div className="madeIcons">
                                <i className="fa-brands fa-react"></i>
                                <i className="fa-brands fa-html5"></i>
                                <i className="fa-brands fa-css3-alt"></i>
                                <i className="fa-brands fa-square-js"></i>
                                {/*<i className="fa-brands fa-python"></i>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
