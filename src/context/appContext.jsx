import { createContext, useState, useContext, useEffect, useMemo } from "react";
import { auth, db } from "../firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AppContext = createContext();

const apiKey = import.meta.env.VITE_VIDEO_API_KEY;

export const useApp = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [searched, setSearched] = useState(null);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [unWatchedMovies, setUnWatchedMovies] = useState([]);
  const [watchedTVShows, setWatchedTVShows] = useState([]);
  const [unWatchedTVShows, setUnWatchedTVShows] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [toggleResetFilters, setToggleResetFilters] = useState(false);
  const [mobileFilterOptions, setMobileFilterOptions] = useState({
    Genre: "all",
    IMDbRating: "all",
    PersonalRating: "all",
    Watched: "all",
    Type: "all",
  });
  const [filters, setFilters] = useState({
    Genre: "all",
    IMDbRating: "all",
    PersonalRating: "all",
    Watched: "all",
    Type: "all",
  });
  const [model, setModel] = useState({
    title: "",
    message: "",
    btn: "",
    executable: null,
    show: false,
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const navigate = useNavigate();

  const searchVideo = async (searchTerm) => {
    const search = searchTerm.replace(/\s+/g, "+");

    try {
      const data = await fetch(
        `https://www.omdbapi.com/?t=${search}&apikey=${apiKey}`
      );
      const json = await data.json();
      if (json.Response === "False") throw new Error(json.Error);
      setSearched(json);
    } catch (error) {
      console.log(error.message);
      setToast({
        show: true,
        message: error.message,
        type: "error",
      });
      console.log(error);
    }
  };

  const resetFilters = () => {
    setToggleResetFilters(true);
    setMobileFilterOptions({
      Genre: "all",
      IMDbRating: "all",
      PersonalRating: "all",
      Watched: "all",
      Type: "all",
    });
    setFilters({
      Genre: "all",
      IMDbRating: "all",
      PersonalRating: "all",
      Watched: "all",
      Type: "all",
    });
  };

  const resetModel = () => {
    setModel({
      title: "",
      message: "",
      btn: "",
      executable: null,
      show: false,
    });
  };

  const resetToast = () => {
    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: "info",
      });
    }, 3000);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      setToast({
        show: true,
        message: "Error signing out. Please try again.",
        type: "error",
      });
    }
  };

  const signIn = async (email, password) => {
    setLoadingUser(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoadingUser(false);
      setToast({
        show: true,
        message: "Login successful!",
        type: "success",
      });
    } catch (error) {
      setLoadingUser(false);
      setToast({
        show: true,
        message: error.message,
        type: "error",
      });
      console.error("Error signing in:", error);
    }
  };

  const createAccount = async (email, password) => {
    setLoadingUser(true);
    try {
      const userRes = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", userRes.user.uid), {
        videos: [],
      });
      setToast({
        show: true,
        message: "Account created successfully!",
        type: "success",
      });
    } catch (error) {
      setLoadingUser(false);
      setToast({
        show: true,
        message: error.message,
        type: "error",
      });
      console.error("Error creating account:", error);
    }
  };

  const sortVideos = (videos) => {
    const watchedTV = videos.filter(
      (video) => video.watched === "watched" && video.Type === "series"
    );
    const unwatchedTV = videos.filter(
      (video) => video.watched === "unwatched" && video.Type === "series"
    );
    const watchedMovies = videos.filter(
      (video) => video.watched === "watched" && video.Type === "movie"
    );
    const unwatchedMovies = videos.filter(
      (video) => video.watched === "unwatched" && video.Type === "movie"
    );
    setWatchedMovies(watchedMovies);
    setUnWatchedMovies(unwatchedMovies);
    setWatchedTVShows(watchedTV);
    setUnWatchedTVShows(unwatchedTV);
  };

  const getVideos = async (user) => {
    setLoadingVideos(true);
    console.log("Fetching videos for user:", user?.uid);
    const docSnap = await getDoc(doc(db, "users", user.uid));
    console.log("docSnap.exists():", docSnap.exists());
    if (docSnap.exists()) {
      const videos = docSnap.data().videos || [];
      console.log("Fetched videos:", videos);
      setVideos(videos);
      sortVideos(videos);
    } else {
      setVideos([]);
    }

    console.log(docSnap.data());
    setLoadingVideos(false);
  };

  const addVideo = async (video) => {
    return getDoc(doc(db, "users", user.uid))
      .then((docSnap) => {
        if (docSnap.exists()) {
          const videos = docSnap.data().videos || [];
          const alreadyExists = videos.some((v) => v.imdbID === video.imdbID);
          if (alreadyExists) {
            setToast({
              show: true,
              message: "This video is already in your list.",
              type: "info",
            });
            throw new Error("This video is already in your list");
          }
          videos.push({ ...video, watched: "unwatched", rating: 0 });
          return setDoc(
            doc(db, "users", user.uid),
            { videos },
            { merge: true }
          );
        } else {
          throw new Error("There was an error adding the video");
        }
      })
      .then(() => {
        setToast({
          show: true,
          message: "Video added successfully!",
          type: "success",
        });
      })
      .catch((error) => {
        setLoadingUser(false);
        setToast({
          show: true,
          message: error.message,
          type: "error",
        });
        throw error;
      });
  };

  const deleteVideo = async (video) => {
    const docRef = doc(db, "users", user.uid);
    const videos = await getDoc(docRef);
    if (videos.exists()) {
      const videoList = videos.data().videos || [];
      const videoIndex = videoList.findIndex((v) => v.imdbID === video.imdbID);
      if (videoIndex !== -1) {
        videoList.splice(videoIndex, 1);
        await setDoc(docRef, { videos: videoList }, { merge: true });
        setToast({
          show: true,
          message: "Video deleted successfully!",
          type: "success",
        });
      }
    }

    resetModel();
    await getVideos(user);
  };

  const rateVideo = async (video, rating) => {
    const docRef = doc(db, "users", user.uid);
    const videos = await getDoc(docRef);
    if (videos.exists()) {
      const videoList = videos.data().videos || [];
      const videoIndex = videoList.findIndex((v) => v.imdbID === video.imdbID);
      if (videoIndex !== -1) {
        videoList[videoIndex].watched = "watched";
        videoList[videoIndex].rating = rating * 2;
        await setDoc(docRef, { videos: videoList }, { merge: true });
        setToast({
          show: true,
          message: "Video rated successfully!",
          type: "success",
        });
      }
    }

    getVideos(user);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        getVideos(user);
        navigate("/main");
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      toast,
      setToast,
      createAccount,
      resetToast,
      loadingUser,
      setLoadingUser,
      handleSignOut,
      signIn,
      searchVideo,
      searched,
      addVideo,
      setSearched,
      loadingVideos,
      videos,
      watchedMovies,
      unWatchedMovies,
      watchedTVShows,
      unWatchedTVShows,
      getVideos,
      rateVideo,
      model,
      setModel,
      resetModel,
      deleteVideo,
      filters,
      setFilters,
      resetFilters,
      setToggleResetFilters,
      toggleResetFilters,
      setMobileFilterOptions,
      mobileFilterOptions,
    }),
    [
      user,
      toast,
      loadingUser,
      searched,
      loadingVideos,
      model,
      filters,
      toggleResetFilters,
      mobileFilterOptions,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
