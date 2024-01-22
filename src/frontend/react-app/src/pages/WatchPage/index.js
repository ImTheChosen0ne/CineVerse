import React, {useContext, useEffect, useRef, useState} from "react";
import "./Watch.css"
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getMovies} from "../../store/movies";
import {ProfileContext} from "../../context/Profile";


function Watch() {
    const { movieId } = useParams();
    const { profile } = useContext(ProfileContext);

    const dispatch = useDispatch();
    const history = useHistory();
    const videoRef = useRef(null);
    const movies = Object.values(useSelector((state) => state.movies));
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [sliderValue, setSliderValue] = useState(0);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            if (isPlaying) {
                videoElement.play();
            } else {
                videoElement.pause();
            }
        }

        videoElement.muted = volume;

    }, [isPlaying, volume]);

    const skipDuration = 10;

    const skipForward = () => {
        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.currentTime += skipDuration;
        }
    };

    const skipBackward = () => {
        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.currentTime -= skipDuration;
        }
    };

    useEffect(() => {
        dispatch(getMovies());
    }, [dispatch]);

    const movie = movies?.find((movie) => movie.movieId.toString() === movieId);

    return (
        <div className="watch-video" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div className="watch-video--player-view">
                <div className="uma" id="uma" role="region"></div>
                <div className="passive ltr-fntwn3">
                    <div className=" ltr-18tyyic">
                        <div style={{position: "relative", width: "100%", height: "100%", overflow: "hidden"}}>
                            <div style={{position: "relative", width: "100%", height: "100%", overflow: "hidden"}} id="80094721">
                                <video src={movie?.trailer} style={{height: "1612px", width: "100%"}} ref={videoRef}></video>
                                <div className="player-timedtext" style={{display: "none", direction: "ltr"}}></div>
                            </div>
                        </div>
                    </div>
                    <div className={`ltr-1m81c36 ${isHovered ? "visible" : "hidden"}`} style={{alignItems: "normal", justifyContent: "flex-end"}}>
                        <div className="ltr-gpipej" style={{alignItems: "flex-start", flexGrow: 1, justifyContent: "flex-start"}}>
                            <div className="ltr-1npqywr" style={{alignItems: "normal", justifyContent: "normal"}}>
                                <div className="watch-video--back-container ltr-gpipej" style={{alignItems: "normal", flexGrow: 1, justifyContent: "flex-start"}}>
                                    <div className="medium ltr-1dcjcj4">
                                        <button className=" ltr-1enhvti" onClick={() => history.push(`/browse/${profile.name}`)}>
                                            <div className="control-medium ltr-iyulz3" role="presentation">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg" data-mirrorinrtl="true"
                                                     className="ltr-4z3qvp e1svuwfo1" data-name="ArrowLeft"
                                                     aria-hidden="true">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                          d="M6.41421 10.9998L21 10.9998L21 12.9998L6.41421 12.9998L11.7071 18.2927L10.2929 19.7069L3.29289 12.7069C2.90237 12.3164 2.90237 11.6832 3.29289 11.2927L10.2929 4.29272L11.7071 5.70694L6.41421 10.9998Z"
                                                          fill="currentColor"></path>
                                                </svg>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                {/*<div className="watch-video--flag-container ltr-gpipej" style={{alignItems: "normal", flexGrow: 1, justifyContent: "flex-end"}}>*/}
                                {/*    <div className="medium ltr-1dcjcj4">*/}
                                {/*        <button className=" ltr-1enhvti">*/}
                                {/*            <div className="control-medium ltr-iyulz3">*/}
                                {/*                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"*/}
                                {/*                     xmlns="http://www.w3.org/2000/svg" className="ltr-4z3qvp e1svuwfo1"*/}
                                {/*                     data-name="Flag" aria-hidden="true">*/}
                                {/*                    <path fill-rule="evenodd" clip-rule="evenodd"*/}
                                {/*                          d="M3 2C2.44772 2 2 2.44772 2 3V4V9.57143V22H4L4 10.5789C5.85067 10.608 7.2411 10.721 9 10.9127V13.5714C9 14.0183 9.2965 14.4109 9.72632 14.5332C13.0256 15.4721 15.8727 16 21 16C21.5523 16 22 15.5523 22 15V8.42857C22 7.87629 21.5523 7.42857 21 7.42857C18.6167 7.42857 17.0614 7.31194 15 7.08734V4.42857C15 3.98169 14.7035 3.58906 14.2737 3.46675C10.9744 2.52795 8.12734 2 3 2ZM4 8.57872C6.2574 8.613 7.85904 8.76736 10.1134 9.02478L11 9.12601V10.0183V12.8111C13.616 13.5166 16.0515 13.9337 20 13.9927V9.42128C17.7426 9.387 16.141 9.23264 13.8866 8.97522L13 8.87399V7.98168V5.18886C10.384 4.48336 7.94853 4.06629 4 4.00726V8.57872Z"*/}
                                {/*                          fill="currentColor"></path>*/}
                                {/*                </svg>*/}
                                {/*            </div>*/}
                                {/*        </button>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                        <div className="watch-video--bottom-controls-container ltr-gpipej" style={{alignItems: "flex-end", justifyContent: "center"}}>
                            <div className="ltr-1wnafyo">
                                <div className="ltr-100d0a9">
                                    <div className="ltr-1npqywr" style={{alignItems: "normal", justifyContent: "normal"}}>
                                        <div className="ltr-gpipej" style={{alignItems: "center", flexGrow: 1, justifyContent: "normal"}}>
                                            <div className="medium ltr-13q34j2" max="6596881" min="0">
                                                <div className="ltr-lbmpgb">
                                                    <div style={{width: "36.9079px"}} className="ltr-1i0opbk"></div>
                                                    <div style={{width: "0.540961px"}} className="ltr-lxhdy4"></div>
                                                    <button role="slider" style={{left: "calc(0.540961px - 0.75rem)"}} className="ltr-1df5qmm"></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ltr-lb3bic" style={{alignItems: "center", justifyContent: "center"}}>
                                            <span className="ltr-1qtcbde">1:49:55</span>
                                        </div>
                                    </div>
                                    <div className="ltr-1npqywr" style={{height: "3rem", minHeight: "3rem", minWidth: "100%", width: "100%"}}></div>
                                    <div className="ltr-100d0a9">
                                        <div className="ltr-1npqywr" style={{alignItems: "normal", justifyContent: "normal"}}>
                                            <div className="ltr-gpipej" style={{alignItems: "normal", justifyContent: "normal"}}>
                                                <div className="medium ltr-1dcjcj4">
                                                    <button className=" ltr-1enhvti" onClick={() => setIsPlaying(!isPlaying)}>
                                                        <div className="control-medium ltr-iyulz3">
                                                            {isPlaying ? (
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg"
                                                                 className="svg-icon-nfplayerPause ltr-4z3qvp e1svuwfo1"
                                                                 data-name="Pause" aria-hidden="true">
                                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                                      d="M4.5 3C4.22386 3 4 3.22386 4 3.5V20.5C4 20.7761 4.22386 21 4.5 21H9.5C9.77614 21 10 20.7761 10 20.5V3.5C10 3.22386 9.77614 3 9.5 3H4.5ZM14.5 3C14.2239 3 14 3.22386 14 3.5V20.5C14 20.7761 14.2239 21 14.5 21H19.5C19.7761 21 20 20.7761 20 20.5V3.5C20 3.22386 19.7761 3 19.5 3H14.5Z"
                                                                      fill="currentColor"></path>
                                                            </svg>
                                                            ) : (
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg"
                                                                 className="svg-icon-nfplayerPlay ltr-4z3qvp e1svuwfo1"
                                                                 data-name="Play" aria-hidden="true">
                                                                <path
                                                                    d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"
                                                                    fill="currentColor"></path>
                                                            </svg>
                                                            )}
                                                        </div>
                                                    </button>
                                                </div>
                                                <div className="ltr-1npqywr" style={{minWidth: "3rem", width: "3rem"}}></div>
                                                <div className="medium ltr-1dcjcj4">
                                                    <button className=" ltr-1enhvti" onClick={skipBackward}>
                                                        <div className="control-medium ltr-iyulz3">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg"
                                                                 className="ltr-4z3qvp e1svuwfo1" data-name="Back10"
                                                                 aria-hidden="true">
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0198 2.04817C13.3222 1.8214 15.6321 2.39998 17.5557 3.68532C19.4794 4.97066 20.8978 6.88324 21.5694 9.09717C22.241 11.3111 22.1242 13.6894 21.2388 15.8269C20.3534 17.9643 18.7543 19.7286 16.714 20.8192C14.6736 21.9098 12.3182 22.2592 10.0491 21.8079C7.77999 21.3565 5.73759 20.1323 4.26989 18.3439C2.80219 16.5555 2 14.3136 2 12L0 12C-2.74181e-06 14.7763 0.962627 17.4666 2.72387 19.6127C4.48511 21.7588 6.93599 23.2278 9.65891 23.7694C12.3818 24.3111 15.2083 23.8918 17.6568 22.5831C20.1052 21.2744 22.0241 19.1572 23.0866 16.5922C24.149 14.0273 24.2892 11.1733 23.4833 8.51661C22.6774 5.85989 20.9752 3.56479 18.6668 2.02238C16.3585 0.479973 13.5867 -0.214321 10.8238 0.0578004C8.71195 0.265799 6.70517 1.02858 5 2.2532V1H3V5C3 5.55228 3.44772 6 4 6H8V4H5.99999C7.45608 2.90793 9.19066 2.22833 11.0198 2.04817ZM2 4V7H5V9H1C0.447715 9 0 8.55228 0 8V4H2ZM14.125 16C13.5466 16 13.0389 15.8586 12.6018 15.5758C12.1713 15.2865 11.8385 14.8815 11.6031 14.3609C11.3677 13.8338 11.25 13.2135 11.25 12.5C11.25 11.7929 11.3677 11.1758 11.6031 10.6488C11.8385 10.1217 12.1713 9.71671 12.6018 9.43388C13.0389 9.14463 13.5466 9 14.125 9C14.7034 9 15.2077 9.14463 15.6382 9.43388C16.0753 9.71671 16.4116 10.1217 16.6469 10.6488C16.8823 11.1758 17 11.7929 17 12.5C17 13.2135 16.8823 13.8338 16.6469 14.3609C16.4116 14.8815 16.0753 15.2865 15.6382 15.5758C15.2077 15.8586 14.7034 16 14.125 16ZM14.125 14.6501C14.5151 14.6501 14.8211 14.4637 15.043 14.0909C15.2649 13.7117 15.3759 13.1814 15.3759 12.5C15.3759 11.8186 15.2649 11.2916 15.043 10.9187C14.8211 10.5395 14.5151 10.3499 14.125 10.3499C13.7349 10.3499 13.4289 10.5395 13.207 10.9187C12.9851 11.2916 12.8741 11.8186 12.8741 12.5C12.8741 13.1814 12.9851 13.7117 13.207 14.0909C13.4289 14.4637 13.7349 14.6501 14.125 14.6501ZM8.60395 15.8554V10.7163L7 11.1405V9.81956L10.1978 9.01928V15.8554H8.60395Z"
                                                                      fill="currentColor"></path>
                                                            </svg>
                                                        </div>
                                                    </button>
                                                </div>
                                                <div className="ltr-1npqywr" style={{minWidth: "3rem", width: "3rem"}}></div>
                                                <div className="medium ltr-1dcjcj4">
                                                    <button className=" ltr-1enhvti" onClick={skipForward}>
                                                        <div className="control-medium ltr-iyulz3">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg"
                                                                 className="ltr-4z3qvp e1svuwfo1" data-name="Forward10"
                                                                 aria-hidden="true">
                                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                                      d="M6.4443 3.68532C8.36795 2.39998 10.6778 1.8214 12.9802 2.04817C14.8093 2.22833 16.5439 2.90793 18 4H16V6H20C20.5523 6 21 5.55229 21 5V1H19V2.2532C17.2948 1.02859 15.2881 0.2658 13.1762 0.057802C10.4133 -0.214319 7.64154 0.479975 5.33316 2.02238C3.02478 3.56479 1.32262 5.85989 0.516718 8.51661C-0.289188 11.1733 -0.148981 14.0273 0.913451 16.5922C1.97588 19.1572 3.8948 21.2744 6.34325 22.5831C8.79169 23.8918 11.6182 24.3111 14.3411 23.7694C17.064 23.2278 19.5149 21.7588 21.2761 19.6127C23.0374 17.4666 24 14.7763 24 12L22 12C22 14.3136 21.1978 16.5555 19.7301 18.3439C18.2624 20.1323 16.22 21.3565 13.9509 21.8079C11.6818 22.2592 9.32641 21.9098 7.28604 20.8192C5.24567 19.7286 3.64657 17.9643 2.76121 15.8269C1.87585 13.6894 1.75901 11.3111 2.4306 9.09718C3.10219 6.88324 4.52065 4.97067 6.4443 3.68532ZM22 4V7H19V9H23C23.5523 9 24 8.55229 24 8V4H22ZM12.6018 15.5758C13.0389 15.8586 13.5466 16 14.125 16C14.7034 16 15.2078 15.8586 15.6382 15.5758C16.0753 15.2865 16.4116 14.8815 16.6469 14.3609C16.8823 13.8338 17 13.2135 17 12.5C17 11.7929 16.8823 11.1759 16.6469 10.6488C16.4116 10.1217 16.0753 9.71671 15.6382 9.43389C15.2078 9.14463 14.7034 9 14.125 9C13.5466 9 13.0389 9.14463 12.6018 9.43389C12.1713 9.71671 11.8385 10.1217 11.6031 10.6488C11.3677 11.1759 11.25 11.7929 11.25 12.5C11.25 13.2135 11.3677 13.8338 11.6031 14.3609C11.8385 14.8815 12.1713 15.2865 12.6018 15.5758ZM15.043 14.0909C14.8211 14.4637 14.5151 14.6501 14.125 14.6501C13.7349 14.6501 13.429 14.4637 13.207 14.0909C12.9851 13.7117 12.8741 13.1814 12.8741 12.5C12.8741 11.8186 12.9851 11.2916 13.207 10.9187C13.429 10.5395 13.7349 10.3499 14.125 10.3499C14.5151 10.3499 14.8211 10.5395 15.043 10.9187C15.2649 11.2916 15.3759 11.8186 15.3759 12.5C15.3759 13.1814 15.2649 13.7117 15.043 14.0909ZM8.60395 10.7163V15.8554H10.1978V9.01929L7 9.81956V11.1405L8.60395 10.7163Z"
                                                                      fill="currentColor"></path>
                                                            </svg>
                                                        </div>
                                                    </button>
                                                </div>
                                                <div className="ltr-1npqywr" style={{minWidth: "3rem", width: "3rem"}}></div>
                                                <div className="medium ltr-1dcjcj4">
                                                    <button className=" ltr-1enhvti" onClick={() => setVolume(!volume)}>
                                                        <div className="control-medium ltr-iyulz3">
                                                            {volume ? (
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg"
                                                                 className="ltr-4z3qvp e1svuwfo1" data-name="VolumeOff"
                                                                 aria-hidden="true">
                                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                                      d="M11 4.00003C11 3.59557 10.7564 3.23093 10.3827 3.07615C10.009 2.92137 9.57889 3.00692 9.29289 3.29292L4.58579 8.00003H1C0.447715 8.00003 0 8.44774 0 9.00003V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00003ZM5.70711 9.70714L9 6.41424V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70714ZM15.2929 9.70714L17.5858 12L15.2929 14.2929L16.7071 15.7071L19 13.4142L21.2929 15.7071L22.7071 14.2929L20.4142 12L22.7071 9.70714L21.2929 8.29292L19 10.5858L16.7071 8.29292L15.2929 9.70714Z"
                                                                      fill="currentColor"></path>
                                                            </svg>
                                                                ) : (
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg"
                                                                 className="ltr-4z3qvp e1svuwfo1" data-name="VolumeHigh"
                                                                 aria-hidden="true">
                                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                                      d="M24 12C24 8.28693 22.525 4.72597 19.8995 2.10046L18.4853 3.51468C20.7357 5.76511 22 8.81736 22 12C22 15.1826 20.7357 18.2348 18.4853 20.4852L19.8995 21.8995C22.525 19.2739 24 15.713 24 12ZM11 3.99995C11 3.59549 10.7564 3.23085 10.3827 3.07607C10.009 2.92129 9.57889 3.00685 9.29289 3.29285L4.58579 7.99995H1C0.447715 7.99995 0 8.44767 0 8.99995V15C0 15.5522 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0786 10.3827 20.9238C10.7564 20.7691 11 20.4044 11 20V3.99995ZM5.70711 9.70706L9 6.41417V17.5857L5.70711 14.2928L5.41421 14H5H2V9.99995H5H5.41421L5.70711 9.70706ZM16.0001 12C16.0001 10.4087 15.368 8.88254 14.2428 7.75732L12.8285 9.17154C13.5787 9.92168 14.0001 10.9391 14.0001 12C14.0001 13.0608 13.5787 14.0782 12.8285 14.8284L14.2428 16.2426C15.368 15.1174 16.0001 13.5913 16.0001 12ZM17.0709 4.92889C18.9462 6.80426 19.9998 9.3478 19.9998 12C19.9998 14.6521 18.9462 17.1957 17.0709 19.071L15.6567 17.6568C17.157 16.1565 17.9998 14.1217 17.9998 12C17.9998 9.87823 17.157 7.8434 15.6567 6.34311L17.0709 4.92889Z"
                                                                      fill="currentColor"></path>
                                                            </svg>
                                                                )}
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="ltr-lapyk4"
                                                 style={{alignItems: "normal", flexGrow: 1, justifyContent: "normal"}}>
                                                <div className="ltr-1npqywr" style={{minWidth: "3rem", width: "3rem"}}></div>
                                                <div className="ltr-4utd8f" style={{alignItems: "normal", flexGrow: 1, justifyContent: "normal"}}>
                                                    <div className="medium ltr-m1ta4i">{movie.title}</div>
                                                </div>
                                            </div>
                                            <div className="ltr-gpipej" style={{alignItems: "normal", justifyContent: "flex-end"}}>
                                                <div className="ltr-1npqywr" style={{minWidth: "3rem", width: "3rem"}}></div>
                                                <div className="ltr-1npqywr" style={{minWidth: "3rem", width: "3rem"}}></div>
                                                <div className="medium ltr-1dcjcj4">
                                                    <button className=" ltr-1enhvti" >
                                                        <div className="control-medium ltr-iyulz3">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg"
                                                                 className="ltr-4z3qvp e1svuwfo1" data-name="Subtitles"
                                                                 aria-hidden="true">
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M1 3C1 2.44772 1.44772 2 2 2H22C22.5523 2 23 2.44772 23 3V17C23 17.5523 22.5523 18 22 18H19V21C19 21.3688 18.797 21.7077 18.4719 21.8817C18.1467 22.0557 17.7522 22.0366 17.4453 21.8321L11.6972 18H2C1.44772 18 1 17.5523 1 17V3ZM3 4V16H12H12.3028L12.5547 16.1679L17 19.1315V17V16H18H21V4H3ZM10 9L5 9V7L10 7V9ZM19 11H14V13H19V11ZM12 13L5 13V11L12 11V13ZM19 7H12V9H19V7Z"
                                                                      fill="currentColor"></path>
                                                            </svg>
                                                        </div>
                                                    </button>
                                                </div>
                                                <div className="ltr-1npqywr" style={{minWidth: "3rem", width: "3rem"}}></div>
                                                <div className="medium ltr-1dcjcj4">
                                                    <button className=" ltr-1enhvti" >
                                                        <div className="control-medium ltr-iyulz3" role="presentation">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg"
                                                                 className="ltr-4z3qvp e1svuwfo1"
                                                                 data-name="InternetSpeed" aria-hidden="true">
                                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                                      d="M19.0569 6.27006C15.1546 2.20629 8.84535 2.20629 4.94312 6.27006C1.01896 10.3567 1.01896 16.9985 4.94312 21.0852L3.50053 22.4704C-1.16684 17.6098 -1.16684 9.7454 3.50053 4.88481C8.18984 0.0013696 15.8102 0.0013696 20.4995 4.88481C25.1668 9.7454 25.1668 17.6098 20.4995 22.4704L19.0569 21.0852C22.981 16.9985 22.981 10.3567 19.0569 6.27006ZM15 14.0001C15 15.6569 13.6569 17.0001 12 17.0001C10.3431 17.0001 9 15.6569 9 14.0001C9 12.3432 10.3431 11.0001 12 11.0001C12.4632 11.0001 12.9018 11.105 13.2934 11.2924L16.2929 8.29296L17.7071 9.70717L14.7076 12.7067C14.895 13.0983 15 13.5369 15 14.0001Z"
                                                                      fill="currentColor"></path>
                                                            </svg>
                                                        </div>
                                                    </button>
                                                </div>
                                                <div className="ltr-1npqywr" style={{minWidth: "3rem", width: "3rem"}}></div>
                                                <div className="medium ltr-1dcjcj4">
                                                    <button className=" ltr-1enhvti" onClick={() => setFullscreen(!fullscreen)}>
                                                        <div className="control-medium ltr-iyulz3">
                                                            {fullscreen ? (
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg"
                                                                 className="ltr-4z3qvp e1svuwfo1"
                                                                 data-name="FullscreenExit" aria-hidden="true"
                                                                 data-uia="control-fullscreen-exit">
                                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                                      d="M24 8H19V3H17V9V10H18H24V8ZM0 16H5V21H7V15V14H6H0V16ZM7 10H6H0V8H5V3H7V9V10ZM19 21V16H24V14H18H17V15V21H19Z"
                                                                      fill="currentColor"></path>
                                                            </svg>
                                                            ) : (
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg"
                                                                 className="ltr-4z3qvp e1svuwfo1"
                                                                 data-name="FullscreenEnter" aria-hidden="true"
                                                                 data-uia="control-fullscreen-enter">
                                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                                      d="M0 5C0 3.89543 0.895431 3 2 3H9V5H2V9H0V5ZM22 5H15V3H22C23.1046 3 24 3.89543 24 5V9H22V5ZM2 15V19H9V21H2C0.895431 21 0 20.1046 0 19V15H2ZM22 19V15H24V19C24 20.1046 23.1046 21 22 21H15V19H22Z"
                                                                      fill="currentColor"></path>
                                                            </svg>
                                                            )}
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ltr-1npqywr" style={{height: "3rem", minHeight: "3rem", minWidth: "100%", width: "100%"}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*<div className="watch-video--evidence-overlay-container">*/}
                    {/*    <div className="medium ltr-1qyrjck">*/}
                    {/*        <span className="ltr-d2lqiv">You're watching</span>*/}
                    {/*        <h2 className="ltr-er2d3m">{movie.title}</h2>*/}
                    {/*        <h3 className="ltr-1i1gvl2">*/}
                    {/*            <span>2016</span>*/}
                    {/*            <span>{movie.maturity}</span>*/}
                    {/*            <span>{movie.runtime}</span>*/}
                    {/*        </h3>*/}
                    {/*        <p className="ltr-13kxr7x">{movie.description}</p>*/}
                    {/*        <span className="ltr-1fk66sm">Paused</span>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
}

export default Watch;
