import React, { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";

const AreaTableAction = ({ user, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="action-dropdown-btn"
        onClick={handleDropdown}
      >
        <HiDotsHorizontal size={18} />
        {showDropdown && (
          <div className="action-dropdown-menu" ref={dropdownRef}>
            <ul className="dropdown-menu-list">
              <li className="dropdown-menu-item">
                <button className="dropdown-menu-link" onClick={() => onEdit(user)}>
                  Edit
                </button>
              </li>
              <li className="dropdown-menu-item">
                <button className="dropdown-menu-link" onClick={() => onDelete(user)}>
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </button>
    </>
  );
};

export default AreaTableAction;
