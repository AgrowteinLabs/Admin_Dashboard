import React, { useState } from "react";
import AreaTableAction from "./AreaTableAction";
import EditUserForm from "./EditUserForm"; // Make sure this import is correct
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

  const handleEdit = (user) => {
    setEditingUser(user); // Set the editing user
  };

  const handleSave = (updatedUser) => {
    setTableData((prevData) =>
      prevData.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setEditingUser(null); // Reset editing user
  };

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
                  <AreaTableAction user={user} onEdit={handleEdit} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingUser && (
        <EditUserForm user={editingUser} onSave={handleSave} />
      )}
    </section>
  );
};

export default AreaTable;
