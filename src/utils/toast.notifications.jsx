import { motion, AnimatePresence } from "framer-motion";
import success_icon from "../assets/success.png";
import error_icon from "../assets/error.png";
import "./styles/toast.styles.css";
import { useEffect, useState } from "react";
import { useApp } from "../context/appContext";

const toastVariants = {
  initial: { opacity: 0, y: 40, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
  exit: { opacity: 0, y: 40, scale: 0.95, transition: { duration: 0.2 } },
};

export const ToastError = ({ message }) => {
  const [show, setShow] = useState(false);
  const { resetToast } = useApp();

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      resetToast();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="toast toast-error"
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <img src={error_icon} alt="Error" />
          <div className="toast-message">{message}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export const ToastSuccess = ({ message }) => {
  const [show, setShow] = useState(false);
  const { resetToast } = useApp();

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      resetToast();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="toast toast-success"
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <img src={success_icon} alt="Success" />
          <div className="toast-message">{message}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
