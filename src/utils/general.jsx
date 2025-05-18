import { useEffect, useState } from "react";

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const useScreenWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

export const genre = [
  "All",
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Thriller",
  "Romance",
  "Science Fiction",
  "Fantasy",
  "Adventure",
  "Mystery",
  "Animation",
  "Crime",
  "Family",
  "Documentary",
  "Sci-Fi",
  "ActionSci-Fi",
  "ActionAdventure",
  "ActionComedy",
  "ActionDrama",
  "ActionFantasy",
];

export const iMDbRating = [
  "All",
  "1 Star",
  "2 Stars",
  "3 Stars",
  "4 Stars",
  "5 Stars",
];

export const personalRating = [
  "All",
  "1 Star",
  "2 Stars",
  "3 Stars",
  "4 Stars",
  "5 Stars",
];

export const watched = ["All", "Watched", "Unwatched"];
export const typeOfVideo = ["All", "Movie", "Series"];
