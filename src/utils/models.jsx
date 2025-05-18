import { motion } from "framer-motion";
import "./styles/utils.css";
import close_icon from "../assets/close-white.png";
import { useApp } from "../context/appContext";
import { useState } from "react";
import { Spinner } from "./animations";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 100 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 100,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export const Model = ({ title, message, btn, executable }) => {
  const [loading, setLoading] = useState(false);

  const { resetModel } = useApp();

  const handleClick = async () => {
    setLoading(true);
    await executable();
    setLoading(false);
  };
  return (
    <>
      <div className="pop-up-model-container">
        <motion.div
          className="pop-up-model"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <div className="pop-up-model-header">
            {/* <h2>{title}</h2> */}
            <img
              className="close-model"
              onClick={resetModel}
              src={close_icon}
              alt=""
            />
          </div>
          <div className="pop-up-model-content">
            <p>{message}</p>
          </div>
          <button className="model-button" onClick={handleClick}>
            <motion.div
              className="animated-btn"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              animate={
                loading
                  ? { scale: 0, opacity: 0, display: "none" }
                  : { scale: 1, opacity: 1 }
              }
            >
              {btn}
            </motion.div>
            <Spinner
              conditional={loading}
              nameClass="model-loading-btn-animation"
            />
          </button>
        </motion.div>
      </div>
    </>
  );
};
