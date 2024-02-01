import React, {useContext, useState} from "react";
import {ProfileContext} from "../../context/Profile";
import {NavLink, useHistory} from "react-router-dom";
import "./EditProfilePage.css"
import {useDispatch, useSelector} from "react-redux";
import {updateUserProfile} from "../../store/session";

function EditProfilePage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const {profile} = useContext(ProfileContext);
    const [name, setName] = useState(profile.name);
    const [img, setImg] = useState(profile.img);
    const [iconImg, setIconImg] = useState("")
    const [gameName, setGameName] = useState("");
    const [maturity, setMaturity] = useState(profile.maturity)
    const [chooseIcon, setChooseIcon] = useState(false)
    const [confirmIcon, setConfirmIcon] = useState(false)

    const [showCaret, setShowCaret] = useState("")

    const [animation, setAnimation] = useState("")

    const icons = [
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABV7uLegi1BOvEneuUG7DavpEkdlHLuUEXmby2jgEA7n8V5LgcFu1o-NlMgJFznEX3Qt8-q7_t8ejt22-fz9LP_lJM6OKNQRpOA.png?r=201",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABYbCADmiYK_fcQ8ZA9koqz7qU6-LsrphCt83p9_Qu5Y2iH0mAs3dj-UISutqdiOmlqnuU4WoDc5YChHKMrWFnnUDKLPelBu_8Q.png?r=7c7",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABRrMp7EDrB-WGtUqXuFkO-n8C5-0-FJ2c6fMRVhCBdLx3uBcSdPdMtDiQTIOfyZN_AyLu4TIcx7CQRqrcBC4c7gv3QPgy0s7OQ.png?r=b39",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABTXCZ23WsNEfx8Ejws4QnFaCqp6z25CIqgSj_VpJartMiJVUCbVYFuIPHQEf3YXEIv2nfhoLgnxSO8ZfypewVPTlEZv0VKO9PQ.png?r=6a6",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABaHEC9COHdhkvZykfXTgaKHhHQB4QRBxhFq6gESzkuFkj_BDD66p3S6HmixAZcdUHH701KWdhSZkjoTX2LilozKq48Ha69Wl2A.png?r=558",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABdae964dclPwTTegelmrB-z9zCF8OPW3IqL_hB4XjpcJoe4nAh3xyM7z27s9OmtugwTsi0m2oqOWavIYJ56-4LQhM-NVKv9xow.png?r=cad",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABVYgkqyPjGbrdFabAaScAkffugf9Iv6Wt2GaL94XCesz1oGp6vgM0SoAnDD7tJASSvSy0IKpmeo7QzVrInepDafQEMXMpgA2Ng.png?r=a16",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABZ757RLEgtR5scrShGcYIXMVJ4u-Nq9MMR5DBTdY0h_2xbLluQhfqAnN_X-nNW30Db0v_jKUwBzUNLR_0Lq2XkXAPJMnvTY0UQ.png?r=eea",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABdNTuxr4l3VXLHQmtWy2CEZTzP3_6144JcItq-RwM85N_BICgJdPHsiHJnmIK7jSVdHg0N0n7lORcEeXInxQjfbjY8R6ogNirQ.png?r=d47",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABbCqgMj2UKOpVwUQMVZLHbLWId0nLwKkeSII1eP_hW2Q_JwNiNltV9koaKAsvL-MCdMH7msR6BLZJ5xLBoImW3fgyvU0rUok_A.png?r=ce4",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABRyh6-ChXj7xmOwS8dL_EGrHOpBSi0L8-HFD-tmjZIjy5vWCrfgm4w4ewLLE34I1C-X4yy2PxYSm30qXu0MqGeOyMY-gnyvZIw.png?r=181",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABbwrnniEWfnKrlposjqsHrnJvCsA_ieU_3kNrzDyXASBZVzGsD4o436zVOwV30EpLskC4Zf_nDBPHlKorkr_t9bksx69ZlBR0Q.png?r=ae9",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABRyxPiBupU2njbiy5xZ3ISc8TLqfcEj-pt3bmvmbFLjDodrLCNy-36WrF8HnOTASWlDT-mWr4mhaTeiulxnyjqPTRdlxSuQ_Og.png?r=ab6",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABRlwcqs_TQ8Hb6U3SsAyAS8LA6xrjIJHfVKhvHsa0GrXrF5qdORcpzwDWsX4MDJVl6YxXxTmvK6GoEWnEAabUFdFPTw9xXjgcw.png?r=bb0",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABcDJF06pNvD4q4MOPiIBQkVtrBcEJMwDwnOEsO63dmGMgot7BDaAC8CT6Z96eLfaFsmCja8BYf9-FtYrwd7Mq2QRAMEOvZVzsQ.png?r=15e",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABdFu41cMXRWNK1EkDj_yH1bxeh9a0udswBpkyBNBYFsgcCEANkojvc63RsB56mXTPWhSqhDnWfJQOH9V7BymHd5Jj8XGwUJ-eQ.png?r=e6e",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABeM78olwut6-E9a31v0mK2aOySAqJ_Jejdvpxxq6I7hyJBZBKRy6RG--GTrl0q6iCHOT50vB9TCX4G2GUbN0e6r9GNJzjAvpnQ.png?r=bd7",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABZFf8nyPJvLrgkkrv_qMWr1ZsA3L3D3f5fvCxG-7Ey4NpzMS-lx6XiEie4CAdOItt7DAqg0y6x1_pbV5KvtzUrHkgKA9eNgmrQ.png?r=1d4",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABQC_iTsdN1Oh4QbrsrOYYpf6el1T8CbDaVtV-VtYukuYyxgenT8b35wAIXA1lBw0Cob6FItS5AWqx5YsamDT69ks9b-2DojaEg.png?r=a4b",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABbu8g5jt-joveM5fZa6gp0b7aQeRBcxgDN60aMh4KQIw3aWLR0OwUGu0v_mYA4x6Ia_3MYx0h37QLpXqL3ExPkS0tNrFWz1uzg.png?r=229",
        "https://occ-0-616-621.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABZEwZmUZB6H1tKp8gauZK6AhrM6mWfatr-y4LSGl1nWaD0hYc2NMRp6vknlM5jqt_Zds3X7aRfv69hxR_B0ipuG9kGY5ENFo3w.png?r=98e",
    ]

    const sessionUser = useSelector(state => state.session.user);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedProfile = {
            ...profile,
            name,
            img,
            gameName,
            maturity
        };

        dispatch(updateUserProfile(updatedProfile))

        history.push("/ManageProfiles")
    }

    const handleCancel = async () => {
        history.push("/ManageProfiles")
    }

    const handleDelete = async () => {
        history.push(`/ManageProfiles/${profile.name}/delete`)
    }

    const handleChooseIcon = async () => {
        setChooseIcon(true);
    }

    const handleGoBack = async () => {
        setChooseIcon(false);
    }

    const handleSetImg = async (iconSelected) => {
        setIconImg(iconSelected)
        setConfirmIcon(true);
    }

    const handleCancelSetIcon = async () => {
        setConfirmIcon(false);
    }

    const handleConfirmIcon = async () => {
        setChooseIcon(false);
        setConfirmIcon(false);
        setImg(iconImg)
    }

    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 3; // Replace with the actual number of slides
    const slideWidth = 92;
    const handleNextSlide = () => {
        setAnimation("animating");
        setShowCaret("active");
        setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
    };

    const sliderStyle = {
        transform: `translate3d(-${currentSlide * slideWidth}%, 0px, 0px)`,

        // transform: `translateX(-${currentSlide * slideWidth}px)`,
    };

    return (
        <div className="edit-profile">
            <div className="header"/>
            <div className="edit-profile-container">
                {!chooseIcon ? (
                    <div className="edit-profile-center">
                        <form onSubmit={handleSubmit} className="edit-profile-wrapper">
                            <h1>Edit Profile</h1>
                            <div className="profile-entry">
                                <div className="profile-edit-icon-container">
                                    <div className="profile-edit-icon">
                                        <img
                                            src={img}
                                            alt="profile"/>
                                        <button onClick={handleChooseIcon} className="profile-edit-icon-button">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg" data-mirrorinrtl="true"
                                                 className="svg-icon svg-icon-edit ltr-4z3qvp e1svuwfo1"
                                                 data-name="Pencil"
                                                 aria-hidden="true">
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                      d="M19.1213 1.7071C17.9497 0.535532 16.0503 0.53553 14.8787 1.7071L13.2929 3.29289L12.5858 4L1.58579 15C1.21071 15.3751 1 15.8838 1 16.4142V21C1 22.1046 1.89543 23 3 23H7.58579C8.11622 23 8.62493 22.7893 9 22.4142L20 11.4142L20.7071 10.7071L22.2929 9.12132C23.4645 7.94975 23.4645 6.05025 22.2929 4.87868L19.1213 1.7071ZM15.5858 7L14 5.41421L3 16.4142L3 19C3.26264 19 3.52272 19.0517 3.76537 19.1522C4.00802 19.2527 4.2285 19.4001 4.41421 19.5858C4.59993 19.7715 4.74725 19.992 4.84776 20.2346C4.94827 20.4773 5 20.7374 5 21L7.58579 21L18.5858 10L17 8.41421L6.70711 18.7071L5.29289 17.2929L15.5858 7ZM16.2929 3.12132C16.6834 2.73079 17.3166 2.73079 17.7071 3.12132L20.8787 6.29289C21.2692 6.68341 21.2692 7.31658 20.8787 7.7071L20 8.58578L15.4142 4L16.2929 3.12132Z"
                                                      fill="currentColor"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="profile-edit-info">
                                    <div className="profile-edit-inputs">
                                        <input
                                            type="text"
                                            className=""
                                            placeholder="Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="game">
                                        <h2>Game Handle:</h2>
                                        <p>Your handle is a unique name that'll be used for playing with other Netflix
                                            members across all Netflix Games. </p>
                                        <div className="profile-edit-inputs">
                                            <input
                                                type="text"
                                                className=""
                                                placeholder="Create Hame Handle"
                                                value={gameName}
                                                onChange={(e) => setGameName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="profile-entry-restrictions">
                                        <h2 className="profile-entry-header">Maturity Settings:</h2>
                                        {maturity ? (
                                            <div>
                                                <ul>
                                                    <li className="profile-maturity-label">All Maturity Ratings</li>
                                                </ul>
                                                <p>Show titles of all maturity ratings for this profile.</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <ul>
                                                    <li className="profile-maturity-label">Kids</li>
                                                    <li className="profile-maturity-label">TV-PG, PG</li>
                                                </ul>
                                                <p>Only show titles rated <b>TV-PG, PG and below</b> for this profile.
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <NavLink className="profile-button" to="">Edit</NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="profile-button end save">Save</button>
                            <button className="profile-button end" onClick={handleCancel}>Cancel</button>
                            <button className="profile-button end" onClick={handleDelete}>Delete Profile</button>
                        </form>
                    </div>
                ) : (
                    <div>
                        {!confirmIcon ? (
                            <div>
                                <div className="profileIcon-header">
                                    <div className="left-header">
                                        <button className="profileIcon-back-button" onClick={handleGoBack}>
                                    <span className="button-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16"
                                             viewBox="0 0 512 512">
                                            <path
                                                d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"/></svg>
                                    </span>
                                        </button>
                                        <div className="left-header-text">
                                            <h1>Edit Profile</h1>
                                            <h2>Choose a profile icon.</h2>
                                        </div>
                                    </div>
                                    <div className="right-header">
                                        <span className="profileIcon-header-name">{profile.name}</span>
                                        <img src={profile.img} className="profileIcon-header-img" alt="profile"/>
                                    </div>
                                </div>
                                <div className="profile-lolopi-container">
                                    <ul className="list-container">
                                        <li className="lolopi-row slider-hover-trigger-layer lolopi-row-wide">
                                            <div className="ptrack-container">
                                                <h2 className="row-header">
                                                    <div className="lolopi-row-text">The Classics</div>
                                                </h2>
                                                <div className="slider">
                                            <span className={`handle handlePrev ${showCaret}`} tabIndex="-1"
                                                  onClick={handlePrevSlide}
                                            >
                                                <b className="indicator-icon icon-leftCaret"></b>
                                            </span>
                                                    <div className="sliderMask showPeek">
                                                        <div className={`sliderContent row-with-x-columns ${animation}`}
                                                             style={sliderStyle}
                                                             // style={{transform: `translate3d(${transformValue}%, 0px, 0px)`}}
                                                        >
                                                            {icons.map((icon, index) => (
                                                            <div className={`slider-item slider-item-${index}`} key={index}>
                                                                <div className="ptrack-content">
                                                                    <button className="lolopi-icon" tabIndex="0"
                                                                            style={{backgroundImage: `url(${icon})`}}
                                                                            onClick={() => handleSetImg(icon)}
                                                                    >
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="handle handleNext active" tabIndex="0"
                                                          role="button" aria-label="See more icons"
                                                          onClick={handleNextSlide}
                                                    >
                                                <b className="indicator-icon icon-rightCaret"></b>
                                            </span>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="edit-icon-center">
                                <div className="profile-lolopi-confirm">
                                    <h1>Change profile icon?</h1>
                                    <div className="lolopi-confirm-icons">
                                        <div>
                                            <span className="lolopi-icon-confirm"
                                                  style={{backgroundImage: `url(${img})`}}></span>
                                            <span>Current</span>
                                        </div>
                                        <span className="indicator-icon icon-rightCaret-confirm"></span>
                                        <div>
                                        <span className="lolopi-icon-confirm"
                                              style={{backgroundImage: `url(${iconImg})`}}></span>
                                            <span>New</span>
                                        </div>
                                    </div>
                                    <div className="lolopi-confirm-buttons">
                                <span className="profile-button preferred-action" onClick={handleConfirmIcon}>
                                    <span>Let's Do It</span>
                                </span>
                                        <span className="profile-button">
                                    <span onClick={handleCancelSetIcon}>Not Yet</span>
                                </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditProfilePage;