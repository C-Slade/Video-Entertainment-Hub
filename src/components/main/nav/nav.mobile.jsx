import { useEffect, useRef, useState } from "react";
import search_icon from "../../../assets/search.png";
import filter_icon from "../../../assets/filter-blue.png";
import down_arrow from "../../../assets/down-arrow.png";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../../../context/appContext";

import {
  genre,
  iMDbRating,
  personalRating,
  watched,
  typeOfVideo,
} from "../../../utils/general";
import { Filter } from "./filter";

export const MobileNav = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const { searchVideo, setSearched, getVideos, user, searched, resetFilters } =
    useApp();

  useEffect(() => {
    if (isSearching) {
      setShowFilters(false);
    } else {
      const timeout = setTimeout(() => setShowFilters(true), 150);
      return () => clearTimeout(timeout);
    }
  }, [isSearching]);

  useEffect(() => {
    if (searchTerm.length === 0 && searched !== null) {
      setSearched(null);
      getVideos(user);
    }
    if (!searchTerm) return;
    const handler = setTimeout(() => {
      handleSearch();
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (isSearching) {
      resetFilters();
    }
  }, [isSearching]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.length > 0) searchVideo(searchTerm);
  };
  return (
    <>
      <motion.div
        className="mobile-nav-container"
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        exit={{ y: "-100%" }}
        transition={{ type: "tween", duration: 0.25 }}
        style={{ position: "absolute", top: 60, left: 0, width: "100%" }}
      >
        <motion.form
          className="search-container"
          onSubmit={handleSearch}
          animate={
            isSearching
              ? { width: "100%", justifyContent: "space-between" }
              : { width: "100%" }
          }
        >
          <img src={search_icon} alt="Search" className="search-icon" />
          <motion.input
            animate={isSearching ? { width: "100%" } : { width: "100%" }}
            type="text"
            placeholder="Search for movies, shows, etc."
            className="search-input"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            onFocus={() => setIsSearching(true)}
            onBlur={() => setIsSearching(false)}
          />
          <motion.button
            type="submit"
            className="search-button"
            animate={
              isSearching ? { opacity: 1 } : { opacity: 0, display: "none" }
            }
            onClick={() => {
              setIsSearching(false);
              handleSearch();
            }}
          >
            Search
          </motion.button>
          <motion.button
            type="text"
            className="reset-button"
            animate={
              isSearching ? { opacity: 1 } : { opacity: 0, display: "none" }
            }
            onClick={() => {
              setIsSearching(false);
              setSearched(null);
              setSearchTerm("");
              getVideos(user);
            }}
          >
            Reset
          </motion.button>
        </motion.form>
        {showFilters && (
          <div
            className="filter-container"
            onClick={() => setFilterOpen((filterOpen) => !filterOpen)}
            style={isSearching ? { display: "none" } : {}}
          >
            <img src={filter_icon} alt="Filter" className="filter-icon" />
            <h4>Filters</h4>
            <motion.img
              className="dropdown-arrow"
              src={down_arrow}
              animate={filterOpen ? { rotate: 180 } : { rotate: 0 }}
              alt=""
            />
          </div>
        )}
      </motion.div>
      <AnimatePresence>
        {filterOpen && (
          <motion.div
            className="filter-dropdown-overlay"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed",
              top: "100px",
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: "40px",
            }}
          >
            <div
              className="filter-options"
              style={{
                borderRadius: 8,
                padding: 24,
                minWidth: 250,
              }}
            >
              <h3>Filter Options</h3>
              <Filter
                filterOptions={genre}
                filterTitle={"Genre"}
                onMobile={true}
              />
              <Filter
                filterOptions={iMDbRating}
                filterTitle={"IMDb Rating"}
                onMobile={true}
              />
              <Filter
                filterOptions={personalRating}
                filterTitle={"Personal Rating"}
                onMobile={true}
              />
              <Filter
                filterOptions={watched}
                filterTitle={"Watched"}
                onMobile={true}
              />
              <Filter
                filterOptions={typeOfVideo}
                filterTitle={"Type"}
                onMobile={true}
              />
              <button
                onClick={() => {
                  resetFilters();
                  setFilterOpen(!filterOpen);
                }}
              >
                Reset Filters
              </button>
              <button onClick={() => setFilterOpen(!filterOpen)}>Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
