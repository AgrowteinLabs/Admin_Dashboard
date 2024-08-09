import React, { useState } from 'react';
import { MdReport, MdError, MdPrint } from 'react-icons/md';
import "./ReportsManagement.scss";

const ReportManagement = () => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [errorSensors, setErrorSensors] = useState([]);
  const [report, setReport] = useState(null);

  const generateCustomReport = () => {
    // Mock logic to generate a custom report
    setIsGeneratingReport(true);
    setTimeout(() => {
      setReport("Custom Report generated successfully.");
      setIsGeneratingReport(false);
    }, 2000); // Simulate report generation delay
  };

  const identifyErrorSensors = () => {
    // Mock logic to identify error sensors
    const mockErrorSensors = [
      { id: 1, name: "Temperature Sensor", issue: "Failed to respond" },
      { id: 2, name: "pH Sensor", issue: "Incorrect readings" },
      // Add more error sensors as needed
    ];
    setErrorSensors(mockErrorSensors);
  };

  return (
    <div className="report-management-page">
      <h1>Report Management</h1>

      <div className="report-actions">
        <button className="action-button" onClick={generateCustomReport}>
          <MdReport size={24} />
          Generate Custom Report
        </button>
        <button className="action-button" onClick={identifyErrorSensors}>
          <MdError size={24} />
          Identify Error Sensors
        </button>
      </div>

      {isGeneratingReport && (
        <div className="report-status">Generating Report...</div>
      )}

      {report && (
        <div className="report-result">
          <p>{report}</p>
          <button className="print-button" onClick={() => window.print()}>
            <MdPrint size={20} />
            Print Report
          </button>
        </div>
      )}

      {errorSensors.length > 0 && (
        <div className="error-sensor-list">
          <h2>Identified Error Sensors</h2>
          <ul>
            {errorSensors.map((sensor) => (
              <li key={sensor.id}>
                <strong>{sensor.name}</strong>: {sensor.issue}
              </li>
            ))}
          </ul>
          <button className="print-button" onClick={() => window.print()}>
            <MdPrint size={20} />
            Print Error Report
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportManagement;
