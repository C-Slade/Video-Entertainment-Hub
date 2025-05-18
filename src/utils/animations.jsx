import { motion } from "framer-motion";
import spinner_icon from "../assets/spinner.png";

export const Spinner = ({ conditional, nameClass, w = "20px", h = "20px" }) => {
  return (
    <motion.div
      className={nameClass}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      initial={{ scale: 0, opacity: 0, display: "none" }}
      animate={
        conditional
          ? { scale: 1, opacity: 1, display: "flex" }
          : { scale: 0, opacity: 0, display: "none" }
      }
    >
      <motion.img
        src={spinner_icon}
        alt=""
        className="spinner"
        animate={{ rotate: 360 }}
        style={{ width: w, height: h }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
    </motion.div>
  );
};
