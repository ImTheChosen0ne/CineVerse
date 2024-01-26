import React, { useState } from "react";

import './Faq.css';

function Faq() {
    const [info1, setInfo1] = useState(false);
    const [info2, setInfo2] = useState(false);
    const [info3, setInfo3] = useState(false);
    const [info4, setInfo4] = useState(false);
    const [info5, setInfo5] = useState(false);
    const [info6, setInfo6] = useState(false);

    const toggleInfo = (faqNumber) => {
        setInfo1(false);
        setInfo2(false);
        setInfo3(false);
        setInfo4(false);
        setInfo5(false);
        setInfo6(false);

        switch (faqNumber) {
            case 1:
                setInfo1(!info1);
                break;
            case 2:
                setInfo2(!info2);
                break;
            case 3:
                setInfo3(!info3);
                break;
            case 4:
                setInfo4(!info4);
                break;
            case 5:
                setInfo5(!info5);
                break;
            case 6:
                setInfo6(!info6);
                break;
            default:
                break;
        }
    };

    return (
        <div className="faq-container">
            <h2>Frequently Asked Questions</h2>
            <div className="faq">
                <ul>
                    <li>
                        <h3>
                            <button onClick={() => toggleInfo(1)}>
                                <span>
                                    What is CineVerse?
                                </span>
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
                                     xmlns="http://www.w3.org/2000/svg"
                                     className="elj7tfr3 e164gv2o4 default-ltr-cache-l7vm9h e1svuwfo1" data-name="Plus"
                                     alt="">
                                    <path
                                          d="M17 17V3H19V17H33V19H19V33H17V19H3V17H17Z" fill="currentColor"></path>
                                </svg>
                            </button>
                        </h3>
                        <div className={`faq-info ${info1 ? 'display' : ''}`}>
                            <span>
                                CineVerse is a streaming service that offers a wide variety of award-winning movies, anime, documentaries, and more on thousands of internet-connected devices.
                                <br/>
                                <br/>
                                You can watch as much as you want, whenever you want – all for one low monthly price. There's always something new to discover and new TV shows and movies are added every week!
                            </span>
                        </div>
                    </li>
                    <li>
                        <h3>
                            <button onClick={() => toggleInfo(2)}>
                                <span>
                                    How much does CineVerse cost?
                                </span>
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
                                     xmlns="http://www.w3.org/2000/svg"
                                     className="elj7tfr3 e164gv2o4 default-ltr-cache-l7vm9h e1svuwfo1" data-name="Plus"
                                     alt="">
                                    <path
                                        d="M17 17V3H19V17H33V19H19V33H17V19H3V17H17Z" fill="currentColor"></path>
                                </svg>
                            </button>
                        </h3>
                        <div className={`faq-info ${info2 ? 'display' : ''}`}>
                            <span>
                               Watch CineVerse on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $6.99 to $22.99 a month. No extra costs, no contracts.
                            </span>
                        </div>
                    </li>
                    <li>
                        <h3>
                            <button onClick={() => toggleInfo(3)}>
                                <span>
                                    Where can I watch?
                                </span>
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
                                     xmlns="http://www.w3.org/2000/svg"
                                     className="elj7tfr3 e164gv2o4 default-ltr-cache-l7vm9h e1svuwfo1" data-name="Plus"
                                     alt="">
                                    <path
                                        d="M17 17V3H19V17H33V19H19V33H17V19H3V17H17Z" fill="currentColor"></path>
                                </svg>
                            </button>
                        </h3>
                        <div className={`faq-info ${info3 ? 'display' : ''}`}>
                            <span>
                                 Watch anywhere, anytime. Sign in with your Cineverse account to watch instantly on the web at cineverse.com from your personal computer or on any internet-connected device that offers the CineVerse app, including smart TVs, smartphones, tablets, streaming media players and game consoles.
                                <br/>
                                <br/>
                                You can also download your favorite shows with the iOS, Android, or Windows 10 app. Use downloads to watch while you're on the go and without an internet connection. Take CineVerse with you anywhere.
                            </span>
                        </div>
                    </li>
                    <li>
                        <h3>
                            <button onClick={() => toggleInfo(4)}>
                                <span>
                                    How do I cancel?
                                </span>
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
                                     xmlns="http://www.w3.org/2000/svg"
                                     className="elj7tfr3 e164gv2o4 default-ltr-cache-l7vm9h e1svuwfo1" data-name="Plus"
                                     alt="">
                                    <path
                                        d="M17 17V3H19V17H33V19H19V33H17V19H3V17H17Z" fill="currentColor"></path>
                                </svg>
                            </button>
                        </h3>
                        <div className={`faq-info ${info4 ? 'display' : ''}`}>
                            <span>
                                CineVerse is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.
                            </span>
                        </div>
                    </li>
                    <li>
                        <h3>
                            <button onClick={() => toggleInfo(5)}>
                                <span>
                                    What can I watch on CineVerse?
                                </span>
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
                                     xmlns="http://www.w3.org/2000/svg"
                                     className="elj7tfr3 e164gv2o4 default-ltr-cache-l7vm9h e1svuwfo1" data-name="Plus"
                                     alt="">
                                    <path
                                        d="M17 17V3H19V17H33V19H19V33H17V19H3V17H17Z" fill="currentColor"></path>
                                </svg>
                            </button>
                        </h3>
                        <div className={`faq-info ${info5 ? 'display' : ''}`}>
                            <span>
                                CineVerse has an extensive library of feature films, documentaries, anime, award-winning CineVerse originals, and more. Watch as much as you want, anytime you want.
                            </span>
                        </div>
                    </li>
                    <li>
                        <h3>
                            <button onClick={() => toggleInfo(6)}>
                                <span>
                                    Is CineVerse good for kids?
                                </span>
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
                                     xmlns="http://www.w3.org/2000/svg"
                                     className="elj7tfr3 e164gv2o4 default-ltr-cache-l7vm9h e1svuwfo1" data-name="Plus"
                                     alt="">
                                    <path
                                        d="M17 17V3H19V17H33V19H19V33H17V19H3V17H17Z" fill="currentColor"></path>
                                </svg>
                            </button>
                        </h3>
                        <div className={`faq-info ${info6 ? 'display' : ''}`}>
                            <span>
                                The CineVerse Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space.
                                <br/>
                                <br/>
                                Kids profiles come with PIN-protected parental controls that let you restrict the maturity rating of content kids can watch and block specific titles you don’t want kids to see.
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Faq;
