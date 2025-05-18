import { useState } from "react";
import eye_icon_hide from "../../assets/hide-grey.png";
import eye_icon_show from "../../assets/show-grey.png";
import { motion } from "framer-motion";
import spinner_icon from "../../assets/spinner.png";
import "./styles/auth-styles.css";
import { Link } from "react-router";
import { useApp } from "../../context/appContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, setToast } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoggingIn(true);

    try {
      await signIn(email, password);
    } catch (error) {
      setToast({
        show: true,
        message: "There was an error logging in. Please try again.",
        type: "error",
      });
      console.error("Error creating account:", error);
    }
  };

  const togglePassword = () => setShowPassword((prev) => !prev);
  return (
    <>
      <div className="login-container">
        <h2>Video Entertainment Hub Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              id="email"
              placeholder="Email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className="form-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              name="password"
              required
            />
            <button
              type="button"
              onClick={togglePassword}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#888",
                fontSize: "1rem",
                padding: 0,
              }}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <img src={eye_icon_show} alt="toggle password" />
              ) : (
                <img src={eye_icon_hide} alt="toggle password" />
              )}
            </button>
          </div>
          <div className="forgotPassword">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>
          <button type="submit" className="login-btn">
            <motion.div
              className="animated-login-text"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              animate={
                loggingIn
                  ? { scale: 0, opacity: 0, display: "none" }
                  : { scale: 1, opacity: 1 }
              }
            >
              Login
            </motion.div>
            <motion.div
              className="animated-login-spinner"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                loggingIn
                  ? { scale: 1, opacity: 1, display: "flex" }
                  : { scale: 0, opacity: 0, display: "none" }
              }
            >
              <motion.img
                src={spinner_icon}
                alt=""
                className="spinner"
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear",
                }}
              />
            </motion.div>
          </button>
        </form>
        <div className="create-account">
          <p>
            Don't have an account?{" "}
            <Link to="/createAccount" className="create-account-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
