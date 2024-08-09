import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";

const TABLE_HEADS = [
  "Name",
  "User ID",
  "Email",
  "Status",
  "Role",
  "Action",
];

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
  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Users List</h4>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS?.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_DATA?.map((dataItem) => {
              return (
                <tr key={dataItem.id}>
                  <td>{dataItem.name}</td>
                  <td>{dataItem.user_id}</td>
                  <td>{dataItem.email}</td>
                  <td>
                    <div className="dt-status">
                      <span
                        className={`dt-status-dot dot-${dataItem.status}`}
                      ></span>
                      <span className="dt-status-text">{dataItem.status}</span>
                    </div>
                  </td>
                  <td>{dataItem.role}</td>
                  <td className="dt-cell-action">
                    <AreaTableAction />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AreaTable;
