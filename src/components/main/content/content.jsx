import { useEffect, useState } from "react";
import { useApp } from "../../../context/appContext";
import { Card } from "./card";
import { VideoSection } from "./videoSection";
import { Spinner } from "../../../utils/animations";

const Content = ({ onMobile }) => {
  const {
    searched,
    loadingVideos,
    watchedMovies,
    unWatchedMovies,
    watchedTVShows,
    unWatchedTVShows,
  } = useApp();

  const noConetent = () => {
    if (
      (unWatchedMovies.length === 0 &&
        unWatchedTVShows.length === 0 &&
        watchedMovies.length === 0 &&
        watchedTVShows.length === 0) ||
      (searched !== null && searched.length === 0)
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <main className="content-container">
        {searched !== null ? (
          <>
            <div className="content-header">
              <h2>Search Results</h2>
            </div>
            <Card videoInfo={searched} />
          </>
        ) : (
          <>
            {loadingVideos ? (
              <Spinner
                conditional={loadingVideos}
                nameClass="loading-videos"
                w="40px"
                h="40px"
              />
            ) : (
              <>
                {noConetent() && (
                  <div className="no-content">
                    <h2>No Content Found</h2>
                    <p>
                      Start adding videos by searching for them in the search
                      bar.
                    </p>
                  </div>
                )}
                {unWatchedTVShows.length > 0 && (
                  <VideoSection
                    title="Unwatched TV-Shows"
                    videos={unWatchedTVShows}
                    onMobile={onMobile}
                  />
                )}
                {unWatchedMovies.length > 0 && (
                  <VideoSection
                    title="Unwatched Movies"
                    videos={unWatchedMovies}
                    onMobile={onMobile}
                  />
                )}
                {watchedTVShows.length > 0 && (
                  <VideoSection
                    title="Watched TV-Shows"
                    videos={watchedTVShows}
                    onMobile={onMobile}
                  />
                )}
                {watchedMovies.length > 0 && (
                  <VideoSection
                    title="Watched Movies"
                    videos={watchedMovies}
                    onMobile={onMobile}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default Content;
