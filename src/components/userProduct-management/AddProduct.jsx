import React, { useState, useEffect } from 'react';
import { FaPlusCircle } from "react-icons/fa";
import "../../components/dashboard/areaCharts/AreaCharts.scss";
import "./userProductManagement.scss";

const AddProduct = ({ product = {}, userId, onSubmit = () => {}, onCancel = () => {} }) => {
  const [formData, setFormData] = useState({
    userId: product.userId || userId || "",
    productId: product.productId || "",
    uid: product.uid || "",
    location: product.location || "",
    installationDate: product.installationDate || "",
    sensors: product.sensors || [],
    property: product.property || {}
  });

  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      userId: userId
    }));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSensorChange = (index, e) => {
    const { name, value } = e.target;
    const newSensors = formData.sensors.map((sensor, i) => 
      i === index ? { ...sensor, [name]: value } : sensor
    );
    setFormData((prevData) => ({
      ...prevData,
      sensors: newSensors
    }));
  };

  const addSensor = () => {
    setFormData(prevData => ({
      ...prevData,
      sensors: [...prevData.sensors, { sensorId: "" }]
    }));
  };

  const removeSensor = (index) => {
    setFormData(prevData => ({
      ...prevData,
      sensors: prevData.sensors.filter((_, i) => i !== index)
    }));
  };

  const handlePropertyChange = (key, value) => {
    setFormData(prevData => ({
      ...prevData,
      property: {
        ...prevData.property,
        [key]: value
      }
    }));
  };

  const removeProperty = (key) => {
    const updatedProperty = { ...formData.property };
    delete updatedProperty[key];
    setFormData(prevData => ({
      ...prevData,
      property: updatedProperty
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = mapFormDataToProductData(formData);

    try {
      // const result = await productCreation(productData);
      const result = "ok";
      onSubmit(result);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const mapFormDataToProductData = (formData) => {
    return {
      userId: formData.userId,
      productId: formData.productId,
      uid: formData.uid,
      location: formData.location,
      installationDate: formData.installationDate,
      sensors: formData.sensors.map(sensor => ({
        sensorId: sensor.sensorId
      })),
      property: formData.property
    };
  };

  return (
    <div className="card add-product-card">
      <h4 className="card-title">
        <FaPlusCircle />
        {product.id ? "Edit Product" : "Add Product"}
      </h4>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="scrollable-form">
          <div className="form-group">
            <label>User ID:</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Product ID:</label>
            <input
              type="text"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>UID:</label>
            <input
              type="text"
              name="uid"
              value={formData.uid}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Installation Date:</label>
            <input
              type="date"
              name="installationDate"
              value={formData.installationDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Sensor Data:</label>
            {formData.sensors.map((sensor, index) => (
              <div key={index} className="sensor-entry">
                <input
                  type="text"
                  name="sensorId"
                  value={sensor.sensorId}
                  onChange={(e) => handleSensorChange(index, e)}
                  placeholder="Sensor ID"
                  required
                />
                <button type="button" className='remove-button' onClick={() => removeSensor(index)}>Remove</button>
              </div>
            ))}
            <button type="button" className='add-button' onClick={addSensor}>Add Sensor</button>
          </div>
          <div className="form-group">
            <label>Additional Properties:</label>
            {Object.entries(formData.property).map(([key, value], index) => (
              <div key={index} className="property-entry">
                <input
                  type="text"
                  value={key}
                  readOnly
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handlePropertyChange(key, e.target.value)}
                />
                <button type="button" className="remove-button" onClick={() => removeProperty(key)}>Delete</button>
              </div>
            ))}
            <button type="button" onClick={() => handlePropertyChange(prompt("Enter property key:"), prompt("Enter property value:"))}>Add Property</button>
          </div>
          <button type="submit" className="submit-button">
            {product.id ? "Update Product" : "Add Product"}
          </button>
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
