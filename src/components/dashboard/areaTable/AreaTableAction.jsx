<<<<<<< HEAD
import React, { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";

const AreaTableAction = ({ user, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);

=======
import { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { Link } from "react-router-dom";

const AreaTableAction = () => {
  const [showDropdown, setShowDropdown] = useState(false);
>>>>>>> d499f1d (Initial commit)
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
<<<<<<< HEAD
                <button className="dropdown-menu-link" onClick={() => onEdit(user)}>
                  Edit
                </button>
              </li>
              <li className="dropdown-menu-item">
                <button className="dropdown-menu-link" onClick={() => onDelete(user)}>
                  Delete
                </button>
=======
                <Link to="/edit" className="dropdown-menu-link">
                  Edit
                </Link>
              </li>
              <li className="dropdown-menu-item">
                <Link to="/delete" className="dropdown-menu-link">
                  Delete
                </Link>
>>>>>>> d499f1d (Initial commit)
              </li>
            </ul>
          </div>
        )}
      </button>
    </>
  );
};

export default AreaTableAction;
