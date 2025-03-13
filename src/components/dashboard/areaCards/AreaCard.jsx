import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FiUsers, FiServer, FiCalendar } from "react-icons/fi";
<<<<<<< HEAD
import data from "./apifetch";
=======
import data from "../../../api/count";
>>>>>>> d499f1d (Initial commit)
import { CircularProgress } from "@mui/material";

const AreaCard = ({ colors, cardInfo, type }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userCount, setUserCount] = useState(null);
  const [sensorCount, setSensorCount] = useState(null);

  useEffect(() => {
    // Fetch the data when the component mounts
    const fetchData = async () => {
<<<<<<< HEAD
      const { usersdata, sensorsdata } = await data();
      setUserCount(usersdata.length);
      setSensorCount(sensorsdata.length);
=======
      const { usersno, sensorsno } = await data();
      setUserCount(usersno);
      setSensorCount(sensorsno);
>>>>>>> d499f1d (Initial commit)
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (type === "date") {
      const timer = setInterval(() => {
        setCurrentDate(new Date());
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [type]);

  const renderValue = () => {
    switch (type) {
      case "users":
        return userCount !== null ? userCount : <CircularProgress/>; // Show user count when available
      case "sensors":
        return sensorCount !== null ? sensorCount : <CircularProgress/>; // Show sensor count when available
      case "date":
        return currentDate.toLocaleDateString();
      default:
        return cardInfo.value;
    }
  };

  const renderIcon = () => {
    switch (type) {
      case "users":
        return <FiUsers size={48} color={colors[1]} />;
      case "sensors":
        return <FiServer size={48} color={colors[1]} />;
      case "date":
        return <FiCalendar size={48} color={colors[1]} />;
      default:
        return null;
    }
  };

  return (
    <div className="area-card">
      <div className="area-card-info">
        <h5 className="info-title">{cardInfo.title}</h5>
        <div className="info-value">{renderValue()}</div>
      </div>
      <div className="area-card-icon">{renderIcon()}</div>
    </div>
  );
};

export default AreaCard;

AreaCard.propTypes = {
  colors: PropTypes.array.isRequired,
  cardInfo: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};
