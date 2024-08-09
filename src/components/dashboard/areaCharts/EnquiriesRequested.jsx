import React from 'react';
import { FaEnvelopeOpenText } from "react-icons/fa";
import "./AreaCharts.scss";

const EnquiriesRequested = () => {
  const enquiries = [
    { id: 1, user: "John Doe", date: "Aug 08, 2024", status: "Pending" },
    { id: 2, user: "Jane Smith", date: "Aug 07, 2024", status: "Completed" },
    { id: 3, user: "Alice Johnson", date: "Aug 06, 2024", status: "In Progress" },
  ];

  return (
    <div className="card">
      <h4 className="card-title">
        <FaEnvelopeOpenText />
        Enquiries Requested by Users
      </h4>
      <div className="card-content">
        <ul>
          {enquiries.map((enquiry) => (
            <li key={enquiry.id}>
              {enquiry.user} - {enquiry.date} - <span className={`status-badge status-${enquiry.status.toLowerCase().replace(' ', '-')}`}>{enquiry.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EnquiriesRequested;
