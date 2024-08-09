import { MdOutlineMenu } from "react-icons/md";
import "./AreaTop.scss";
import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "../../../context/SidebarContext";

const AreaTop = () => {
  const { openSidebar } = useContext(SidebarContext);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="content-area-top">
      <div className="area-top-l">
        {/* <button
          className="sidebar-open-btn"
          type="button"
          onClick={openSidebar}
        >
          <MdOutlineMenu size={24} />
        </button> */}
        <h2 className="area-top-title">Dashboard</h2>
      </div>
      <div className="area-top-r">
        <div className="time-display">
          <span className="current-time">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </section>
  );
};

export default AreaTop;
