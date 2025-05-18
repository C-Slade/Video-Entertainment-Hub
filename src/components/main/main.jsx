import { useEffect, useState } from "react";
import Content from "./content/content";
import Header from "./header/header";
import DesktopNav from "./nav/nav.desktop";
import { useScreenWidth } from "../../utils/general";
import "./styles/main.styles.css";
import MobileNav from "./nav/nav.mobile";

const Main = () => {
  const [onMobile, setOnMobile] = useState(false);
  const width = useScreenWidth();

  useEffect(() => {
    const handleResize = () => {
      if (width < 650) {
        setOnMobile(true);
      } else {
        setOnMobile(false);
      }
    };

    handleResize();
  }, [width]);
  return (
    <>
      <div className="main-content-container">
        <Header />
        <div className="bottom-content-container">
          {onMobile && <MobileNav />}
          {!onMobile && <DesktopNav />}
          <Content onMobile={onMobile} />
        </div>
      </div>
    </>
  );
};

export default Main;
