import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Card } from "./card";
import { useApp } from "../../../context/appContext";

export const VideoSection = ({ title, videos, onMobile }) => {
  const [filteredVideos, setFilteredVideos] = useState(videos);
  const carouselRef = useRef(null);
  const controls = useAnimation();
  const { filters, mobileFilterOptions } = useApp();

  const checkForFilters = () => {
    const { PersonalRating, Genre, IMDbRating, Watched, Type } = onMobile
      ? mobileFilterOptions
      : filters;

    let filtered = videos;

    if (Genre !== "all") {
      filtered = filtered.filter((video) => {
        if (!video.Genre) return false;
        return video.Genre.split(",")
          .map((g) => g.trim().toLowerCase())
          .includes(Genre.trim().toLowerCase());
      });
    }

    if (IMDbRating !== "all")
      filtered = filtered.filter(
        (video) => video.imdbRating >= IMDbRating * 2 - 1
      );

    if (PersonalRating !== "all")
      filtered = filtered.filter(
        (video) => video.rating >= PersonalRating * 2 - 1
      );

    if (Watched !== "all")
      filtered = filtered.filter((video) => video.watched === Watched);

    if (Type !== "all")
      filtered = filtered.filter((video) => video.Type === Type);

    setFilteredVideos(filtered);
  };

  useEffect(() => {
    if (videos.length > 0) {
      checkForFilters();
    }
  }, [filters, mobileFilterOptions]);

  useEffect(() => {
    if (filteredVideos.length > 0) {
      checkForFilters();
    }
    if (filteredVideos.length > 1) {
      controls
        .start({
          x: -220,
          transition: { duration: 1.5, ease: "easeInOut" },
        })
        .then(() => {
          controls.start({
            x: 0,
            transition: { duration: 1.5, ease: "easeInOut" },
          });
        });
    }
  }, [filteredVideos.length, controls]);
  return (
    <div
      className="video-section"
      style={
        filteredVideos.length === 0 ? { display: "none" } : { display: "flex" }
      }
    >
      <h2>{title}</h2>
      <div className="carousel-outer" style={{ width: "100%" }}>
        <motion.div
          className="carousel-inner"
          ref={carouselRef}
          style={{ display: "flex", gap: "10rem", cursor: "grab" }}
          drag="x"
          dragConstraints={{
            left: -((filteredVideos.length - 1) * 320),
            right: 0,
          }}
          whileTap={{ cursor: "grabbing" }}
          animate={controls}
        >
          {filteredVideos.map((video) => (
            <div
              key={video.imdbID}
              style={{ minWidth: 200, flex: "0 0 200px" }}
            >
              <Card videoInfo={video} personal={true} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
