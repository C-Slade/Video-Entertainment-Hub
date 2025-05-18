import { useApp } from "../../../context/appContext";
import searchIcon from "../../../assets/search.png";
import "../styles/main.styles.css";
import { useEffect, useState } from "react";

const Header = () => {
  const { handleSignOut, searchVideo, searched, setSearched, getVideos, user } =
    useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    searchVideo(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearched(null);
    getVideos(user);
  };
  useEffect(() => {
    if (searchTerm.length === 0 && searched !== null) {
      handleClear();
    }
  }, [searchTerm]);
  return (
    <header className="header">
      <div className="app-name-container">
        <h1 className="app-name">Video Entertainment Hub</h1>
      </div>
      <form className="search-container" onSubmit={handleSearch}>
        <img src={searchIcon} alt="Search" className="search-icon" />
        <input
          type="text"
          placeholder="Search for movies, shows, etc."
          className="search-input"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <button type="submit" className="search-button">
          Search
        </button>
        <button className="clear-button" type="button" onClick={handleClear}>
          Clear
        </button>
      </form>
      <div className="signout-container">
        <button className="sign-out-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Header;
