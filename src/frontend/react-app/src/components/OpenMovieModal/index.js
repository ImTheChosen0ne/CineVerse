import React from "react";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";


function OpenMovieModal({movie}) {
  const { closeModal } = useModal();
  const handleSubmit = async (e) => {
    e.preventDefault();

  };

  return (
      <>
        <div>
          <div>
            <div>
              <video
                  src={movie.trailer}
                  autoPlay
                  playsInline={true}
                  controls
                  muted
              />
            </div>
            <div>
              <button>Play</button>
              <button>My list</button>
              <button>Like</button>
            </div>
            <div>
              <div>{movie.runtime}</div>
            </div>
            <div>
              {movie.genres.map((genre, index) => (
                  <p key={index}>{genre}</p>
              ))}
            </div>
          </div>
        </div>
      </>
  );
}

export default OpenMovieModal;
