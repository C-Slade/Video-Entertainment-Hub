import { createContext, useState, useContext, useEffect, useMemo } from "react";
import { auth, collectionData } from "../firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export const useApp = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const navigate = useNavigate();

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
      await createUserWithEmailAndPassword(auth, email, password);
      setLoadingUser(false);
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
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
    }),
    [user, toast, loadingUser]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
