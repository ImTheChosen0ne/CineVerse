import React, { useState } from "react";
import './SplashPage.css';

function SplashPage() {
    const [email, setEmail] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();

    };

    return (
        <div className="splashPage">
            <div>
                <div>
                    <div>
                        <h1>Unlimited movies, TV shows, and more</h1>
                        <p>Starts at $6.99. Cancel anytime.</p>
                    </div>
                    <div className="signup-container">
                        <h3>Ready to watch? Enter your email to create or restart your membership.</h3>
                        <form onSubmit={handleSubmit} className="signup-form" >
                            <input
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button
                                className="signup-button"
                                type="submit"
                            >
                                Get Started >
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div>
                <div className="plans">
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
                </div>
                <div className="trending-splash-container">
                    <div>carousel</div>
                </div>
                <div className="mobile-games-container">
                    <h2>Play Mobile Games</h2>
                    <div>
                        <div>
                            <h3>Mobile games now included in every plan</h3>
                            <p>No ads, extra fees, or in-app purchases. Enjoy unlimited access to a growing catalog of popular and exclusive games.</p>
                        </div>
                        <div>

                        </div>
                    </div>

                </div>
                <div className="reasons-container">
                    <h2>More Reasons to Join</h2>
                    <div>
                        <div className="reason">
                            <h3>Stories tailored to your taste</h3>
                            <svg></svg>
                        </div>
                        <div className="reason">
                            <h3>Cancel or switch plans anytime</h3>
                            <svg></svg>
                        </div>
                        <div className="reason">
                            <h3>A place just for kids</h3>
                            <svg></svg>
                        </div>
                        <div className="reason">
                            <h3>For your phone, tablet, laptop, and TV</h3>
                            <svg></svg>
                        </div>
                    </div>
                </div>
                <div className="faq-container">
                    <h2>Frequently Asked Questions</h2>
                    <div>
                        <ul>
                            <li>
                                <h3>
                                    <button>
                                        <span>
                                            What is Netflix?
                                        </span>
                                    </button>
                                </h3>
                            </li>
                            <li>
                                <h3>
                                    <button>
                                        <span>
                                            How much does NetFlix cost?
                                        </span>
                                    </button>
                                </h3>
                            </li>
                            <li>
                                <h3>
                                    <button>
                                        <span>
                                            Where can I watch?
                                        </span>
                                    </button>
                                </h3>
                            </li>
                            <li>
                                <h3>
                                    <button>
                                        <span>
                                            How do I cancel?
                                        </span>
                                    </button>
                                </h3>
                            </li>
                            <li>
                                <h3>
                                    <button>
                                        <span>
                                            What can I watch on Netflix?
                                        </span>
                                    </button>
                                </h3>
                            </li>
                            <li>
                                <h3>
                                    <button>
                                        <span>
                                            Is Netflix good for kids?
                                        </span>
                                    </button>
                                </h3>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="signup-container">
                    <h3>Ready to watch? Enter your email to create or restart your membership.</h3>
                    <form onSubmit={handleSubmit} className="signup-form">
                        <input
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            className="signup-button"
                            type="submit"
                        >
                            Get Started >
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SplashPage;
