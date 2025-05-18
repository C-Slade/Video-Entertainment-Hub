import { Filter } from "./filter.jsx";
import "../styles/main.styles.css";
import { use, useState } from "react";
import { useApp } from "../../../context/appContext.jsx";
import {
  genre,
  iMDbRating,
  personalRating,
  watched,
  typeOfVideo,
} from "../../../utils/general.jsx";

const DesktopNav = () => {
  const { resetFilters } = useApp();

  return (
    <nav>
      <div className="nav-name">
        <h4>Filters</h4>
      </div>
      <Filter filterOptions={genre} filterTitle={"Genre"} />
      <Filter filterOptions={iMDbRating} filterTitle={"IMDb Rating"} />
      <Filter filterOptions={personalRating} filterTitle={"Personal Rating"} />
      <Filter filterOptions={watched} filterTitle={"Watched"} />
      <Filter filterOptions={typeOfVideo} filterTitle={"Type"} />
      <button
        className="reset-button"
        onClick={() => {
          resetFilters();
        }}
      >
        Reset Filters
      </button>
    </nav>
  );
};

export default DesktopNav;
