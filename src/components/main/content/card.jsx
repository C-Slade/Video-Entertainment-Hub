import { useEffect, useState } from "react";
import full_star_icon from "../../../assets/Full-star.png";
import half_star_icon from "../../../assets/Half-star.png";
import empty_star_icon from "../../../assets/empty-star.png";
import empty_star_gold from "../../../assets/empty-star-gold.png";
import delete_icon from "../../../assets/minus-button.png";
import { extractColors } from "extract-colors";
import { motion } from "framer-motion";
import { Spinner } from "../../../utils/animations";
import { useApp } from "../../../context/appContext";

export const Card = ({ videoInfo, personal }) => {
  const [color, setColor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(null);

  const { setToast, addVideo, rateVideo, setModel, deleteVideo, searched } =
    useApp();

  const getPersonalRating = () => {
    const value = videoInfo.rating / 2;
    const decimal = value % 1;
    const roundedRating = Math.floor(value);

    if (videoInfo.watched === "unwatched") {
      return (
        <div className="rating">
          {Array.from({ length: 5 }, (_, index) => (
            <motion.img
              key={index}
              src={
                hoveredRating !== null && index <= hoveredRating
                  ? full_star_icon
                  : empty_star_icon
              }
              onMouseEnter={() => setHoveredRating(index)}
              onMouseLeave={() => setHoveredRating(null)}
              onClick={() => rateVideo(videoInfo, index + 1)}
              alt="empty star"
            />
          ))}
        </div>
      );
    } else if (videoInfo.watched === "watched") {
      return (
        <div className="rating">
          {Array.from({ length: roundedRating }, (_, index) => (
            <img key={index} src={full_star_icon} alt="Full Star" />
          ))}
          {decimal >= 0.5 && <img src={half_star_icon} alt="Half Star" />}
          {Array.from(
            { length: 5 - roundedRating - (decimal >= 0.5 ? 1 : 0) },
            (_, index) => (
              <img key={index} src={empty_star_gold} alt="Empty Star" />
            )
          )}
        </div>
      );
    }
  };

  const getRating = () => {
    const value = videoInfo.imdbRating / 2;
    const decimal = value % 1;
    const roundedRating = Math.floor(value);

    if (decimal >= 0.5) {
      return (
        <div className="rating">
          {Array.from({ length: roundedRating }, (_, index) => (
            <img key={index} src={full_star_icon} alt="Full Star" />
          ))}
          <img src={half_star_icon} alt="Half Star" />
          {Array.from(
            { length: 5 - roundedRating - (decimal >= 0.5 ? 1 : 0) },
            (_, index) => (
              <img key={index} src={empty_star_gold} alt="Empty Star" />
            )
          )}
        </div>
      );
    } else {
      return (
        <div className="rating">
          {Array.from({ length: roundedRating }, (_, index) => (
            <img key={index} src={full_star_icon} alt="Full Star" />
          ))}
          {Array.from(
            { length: 5 - roundedRating - (decimal >= 0.5 ? 1 : 0) },
            (_, index) => (
              <img key={index} src={empty_star_gold} alt="Empty Star" />
            )
          )}
        </div>
      );
    }
  };

  const formatGenre = () => {
    const genres = videoInfo.Genre.split(", ");
    return genres.map((genre, index) => (
      <span key={index} className="genre">
        {videoInfo.Genre.length - index === 1 ? `${genre}` : `${genre} - `}
        {genre}
      </span>
    ));
  };

  const getColor = async () => {
    const colors = await extractColors(videoInfo.Poster);
    const color = colors[0].hex;
    setColor(color);
  };

  const handleAddVideo = async () => {
    setLoading(true);

    try {
      await addVideo(videoInfo);
    } catch (error) {
      setToast({
        show: true,
        message: error.message,
        type: "error",
      });
    }

    setLoading(false);
  };

  const handleDeleteVideo = () => {
    setModel({
      show: true,
      title: "Delete Video",
      message: "Are you sure you want to delete this video?",
      btn: "Delete",
      executable: async () => {
        try {
          await deleteVideo(videoInfo);
          setToast({
            show: true,
            message: "Video deleted successfully",
            type: "success",
          });
        } catch (error) {
          setToast({
            show: true,
            message: error.message,
            type: "error",
          });
        }
      },
    });
  };

  useEffect(() => {
    setColor(null);
    getColor();
  }, [videoInfo]);

  return (
    <>
      {color && (
        <div className="videoCard" style={{ border: `1px solid ${color}` }}>
          {searched === null && (
            <div className="deleteCard">
              <div className="delete-btn" onClick={handleDeleteVideo}>
                <img src={delete_icon} alt="" />
              </div>
            </div>
          )}
          <img
            src={videoInfo.Poster}
            className="poster"
            draggable="false"
            alt=""
            style={{
              boxShadow: `0 5px 20px 5px ${color}`,
              border: `1px solid ${color}`,
            }}
          />
          <div className="videoCard-info">
            <h3>{videoInfo.Title}</h3>
            {!personal && (
              <button
                className="add-movie"
                style={{ backgroundColor: `${color}` }}
              >
                <motion.div
                  className="animated-btn"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ position: "re" }}
                  animate={
                    loading
                      ? { scale: 0, opacity: 0, display: "none" }
                      : { scale: 1, opacity: 1 }
                  }
                  onClick={handleAddVideo}
                >
                  Add
                </motion.div>
                <Spinner
                  conditional={loading}
                  nameClass="animated-video-add-btn"
                />
              </button>
            )}

            {videoInfo.watched === "watched" && (
              <div className="personal-rating-container">
                <p>Personal Rating</p>
                <div className="rating-container">
                  {getPersonalRating(true)}
                </div>
              </div>
            )}
            {videoInfo.watched === "unwatched" && (
              <div className="personal-rating-container">
                <p>Personal Rating</p>
                <div className="rating-container">
                  {getPersonalRating(false)}
                </div>
              </div>
            )}
            <div className="imdb-rating-container">
              <p>IMDb Rating</p>
              <div className="rating-container">{getRating()}</div>
            </div>
            <div className="imdb-rating-container">
              <p>Genre</p>
              <div className="genre-container">{formatGenre()}</div>
            </div>
            <div className="description-container">
              <div className="description">{videoInfo.Plot}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
