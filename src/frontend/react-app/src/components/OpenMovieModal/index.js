import React, {useEffect, useRef} from "react";
import { useMiniModal } from "../../context/MiniModal";
import "./OpenMovieModal.css";


function OpenMovieModal({movie, position}) {
  const { closeModal } = useMiniModal();
  const onMouseLeave = () => {
    closeModal();
  };

  const modalStyle = {
    position: "absolute",
    display: "flex",
    top: position.top + window.scrollY  - 100 + "px",
    left: position.left - 40 + "px",
    width: position.width + 80 + "px",
    height: position.height + 300 + "px"
  };

  return (
        <div style={modalStyle} className="modal-wrapper" onMouseLeave={onMouseLeave}>
          <div className="modal-content" >
            <div>
              <video
                  src={movie?.trailer}
                  autoPlay
                  playsInline={true}
                  controls
                  muted
                  height="200px"
                  width="350px"
              />
            </div>
            <div>
              <button>Play</button>
              <button>My list</button>
              <button>Like</button>
            </div>
            <div>
              <div>{movie?.runtime}</div>
            </div>
            <div>
              {movie?.genres.map((genre, index) => (
                  <p key={index}>{genre}</p>
              ))}
            </div>
          </div>
        </div>
  );
}

export default OpenMovieModal;
