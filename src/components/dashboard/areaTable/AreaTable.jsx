import React, { useState, useEffect } from "react";
import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";
import { usersFetch } from "../../../api/userslistfetch";

const TABLE_HEADS = [
  "Name",
  "User ID",
  "Email",
  "Status",
  "Role",
];

const AreaTable = () => {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await usersFetch();
        const formattedUsers = users.map((user, index) => ({
          id: index + 1, // Assign a unique id based on index
          name: user.fullName,
          user_id: user._id, // Use MongoDB ID as user_id
          email: user.email,
          status: "active", // Assuming all users are active, modify this based on your logic
          role: user.role,
        }));
        setTableData(formattedUsers);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Users List</h4>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((dataItem) => (
              <tr key={dataItem.id}>
                <td>{dataItem.name}</td>
                <td>{dataItem.user_id}</td>
                <td>{dataItem.email}</td>
                <td>
                  <div className="dt-status">
                    <span className={`dt-status-dot dot-${dataItem.status}`}></span>
                    <span className="dt-status-text">{dataItem.status}</span>
                  </div>
                </td>
                <td>{dataItem.role}</td>
                {/* <td className="dt-cell-action">
                  <AreaTableAction />
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default AreaTable;
