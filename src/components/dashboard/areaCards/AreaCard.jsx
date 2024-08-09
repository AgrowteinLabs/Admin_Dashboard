import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FiUsers, FiServer, FiCalendar } from "react-icons/fi";

const AreaCard = ({ colors, cardInfo, type }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

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
        return "150"; // Replace with actual total users value
      case "sensors":
        return "25"; // Replace with actual total sensors value
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
