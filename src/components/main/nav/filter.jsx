import { useEffect, useState } from "react";
import "../styles/main.styles.css";
import down_arrow from "../../../assets/down-arrow.png";
import { motion } from "framer-motion";
import { useApp } from "../../../context/appContext";

const listVariants = {
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
      staggerDirection: 1,
    },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  open: { opacity: 1, y: 0, pointerEvents: "all" },
  closed: { opacity: 0, y: 20, pointerEvents: "none" },
};

const buttonVariants = {
  open: {
    borderBottomRightRadius: "0px",
    borderBottomLeftRadius: "0px",
  },
  closed: {
    borderBottomRightRadius: "5px",
    borderBottomLeftRadius: "5px",
  },
};

export const Filter = ({ filterOptions, filterTitle, onMobile }) => {
  const [selected, setSelected] = useState(filterOptions[0]);
  const [borderRad, setBorderRad] = useState(false);
  const [open, setOpen] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);

  const { setFilters, mobileFilterOptions, setMobileFilterOptions } = useApp();

  const handleFilter = (option) => {
    setSelected(option);
    setHasSelected(true);
    if (filterTitle === "Personal Rating" || filterTitle === "IMDb Rating") {
      const num = option.split(" ")[0];
      if (onMobile) {
        setMobileFilterOptions((prev) => ({
          ...prev,
          [filterTitle.replaceAll(" ", "")]:
            option.toLowerCase() === "all" ? "all" : parseInt(num),
        }));
      } else {
        setFilters((prev) => ({
          ...prev,
          [filterTitle.replaceAll(" ", "")]:
            option.toLowerCase() === "all" ? "all" : parseInt(num),
        }));
      }
    } else {
      if (onMobile) {
        setMobileFilterOptions((prev) => ({
          ...prev,
          [filterTitle]: option.toLowerCase(),
        }));
      } else {
        setFilters((prev) => ({
          ...prev,
          [filterTitle]: option.toLowerCase(),
        }));
      }
    }
  };

  const getValue = () => {
    if (hasSelected) {
      if (typeof selected === "number") {
        if (selected > 1) {
          return selected + " Stars";
        } else {
          return selected + " Star";
        }
      } else {
        return selected;
      }
    } else {
      return filterTitle;
    }
  };

  useEffect(() => {
    if (
      onMobile &&
      mobileFilterOptions[filterTitle.replaceAll(" ", "")] !== "all"
    ) {
      setSelected(mobileFilterOptions[[filterTitle.replaceAll(" ", "")]]);
      setHasSelected(true);
    }
  }, []);

  return (
    <div className="filter" onClick={() => setOpen(!open)}>
      <div className="dropdown" tabIndex={0}>
        <motion.button
          className="dropdown-selected"
          onClick={() => setOpen((o) => !o)}
          transition={{ duration: 0.5 }}
          animate={borderRad ? "closed" : "open"}
          variants={buttonVariants}
        >
          {/* {console.log(getValue())} */}
          {/* {hasSelected ? selected : filterTitle} */}
          {getValue()}
          <motion.img
            className="dropdown-arrow"
            src={down_arrow}
            animate={open ? { rotate: 180 } : { rotate: 0 }}
            alt=""
          />
        </motion.button>
        <motion.ul
          className="dropdown-menu"
          variants={listVariants}
          onAnimationComplete={() => {
            if (!open) setBorderRad(true);
            else setBorderRad(false);
          }}
          initial="closed"
          animate={open ? "open" : "closed"}
        >
          {filterOptions.map((option) => (
            <motion.li
              key={option}
              variants={itemVariants}
              className={`dropdown-item${
                option === selected ? " selected" : ""
              }`}
              onClick={() => {
                setHasSelected(true);
                setSelected(option);
                handleFilter(option);
                setOpen(false);
              }}
            >
              {option}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
};
