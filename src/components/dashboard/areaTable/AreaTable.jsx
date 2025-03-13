<<<<<<< HEAD
import React, { useState } from "react";
import AreaTableAction from "./AreaTableAction";
import EditUserForm from "./EditUserForm";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material'; // Import Material-UI components
import "./AreaTable.scss";

const TABLE_HEADS = ["Name", "User ID", "Email", "Status", "Role", "Action"];
const TABLE_DATA = [
  {
    id: 100,
    name: "John Doe",
    user_id: "U11232",
    email: "john.doe@example.com",
    status: "active",
    role: "Admin",
  },
  {
    id: 101,
    name: "Jane Smith",
    user_id: "U11233",
    email: "jane.smith@example.com",
    status: "inactive",
    role: "User",
  },
  {
    id: 102,
    name: "Alice Johnson",
    user_id: "U11234",
    email: "alice.johnson@example.com",
    status: "active",
    role: "User",
  },
  {
    id: 103,
    name: "Bob Brown",
    user_id: "U11235",
    email: "bob.brown@example.com",
    status: "active",
    role: "Admin",
  },
  {
    id: 104,
    name: "Charlie Davis",
    user_id: "U11236",
    email: "charlie.davis@example.com",
    status: "inactive",
    role: "User",
  },
];

const AreaTable = () => {
  const [tableData, setTableData] = useState(TABLE_DATA);
  const [editingUser, setEditingUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setOpen(true); // Open confirmation dialog
  };

  const confirmDelete = () => {
    setTableData((prevData) =>
      prevData.filter((user) => user.id !== userToDelete.id)
    );
    setOpen(false);
    setUserToDelete(null);
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  const handleClose = () => {
    setOpen(false);
    setUserToDelete(null);
  };
=======
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
>>>>>>> d499f1d (Initial commit)

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Users List</h4>
      </div>
      <div className="data-table-diagram">
<<<<<<< HEAD
        {editingUser ? (
          <EditUserForm
            user={editingUser}
            onSave={(updatedUser) => {
              setTableData((prevData) =>
                prevData.map((user) => (user.id === updatedUser.id ? updatedUser : user))
              );
              setEditingUser(null);
            }}
            onCancel={handleCancel}
          />
        ) : (
          <table>
            <thead>
              <tr>
                {TABLE_HEADS.map((th, index) => (
                  <th key={index}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.user_id}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="dt-status">
                      <span className={`dt-status-dot dot-${user.status}`}></span>
                      <span className="dt-status-text">{user.status}</span>
                    </div>
                  </td>
                  <td>{user.role}</td>
                  <td className="dt-cell-action">
                    <AreaTableAction user={user} onEdit={handleEdit} onDelete={handleDelete} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this user?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting this user cannot be undone. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
=======
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
>>>>>>> d499f1d (Initial commit)
    </section>
  );
};

export default AreaTable;
