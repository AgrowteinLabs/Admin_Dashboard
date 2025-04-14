import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { format } from "date-fns";
import Select from "react-select/async";
import { usersFetch } from "../../api/userslistfetch";
import { productsFetch } from "../../api/productsFetch";
import { Sensors } from "../../api/sensorFetch";
import {
  createUserProduct,
  updateUserProduct,
} from "../../api/userProductsFetch"; // Import the update API function
import "./AddProduct.scss";
import PropTypes from "prop-types";

const AddProduct = ({
  product = {},
  userId,
  onSubmit = () => {},
  onCancel = () => {},
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: product.userId || userId || "",
    productId: product.productId || "", // Ensure productId is initialized to an empty string if not present
    uid: product.uid || "",
    alias: product.alias || "",
    location: product.location || "",
    installationDate: product.installationDate || "", // Initialize as empty or with a date
    sensors: product.sensors || [],  // No need for individual sensor arrays
    controls: product.controls || [],
  });

  useEffect(() => {
    if (product._id) {
      setFormData({
        userId: product.userId || userId || "",
        productId: product.productId || "",
        uid: product.uid || "",
        alias: product.alias || "",
        location: product.location || "",
        installationDate: product.installationDate || "",
        sensors: product.sensors || [], // Use product.sensors as is
        controls: product.controls || [],
      });
    }
  }, [product, userId]);
  const loadUsers = async (inputValue) => {
    try {
      const fetchedData = await usersFetch();
      const filteredUsers = fetchedData
        .filter(
          (user) =>
            user.role.toLowerCase() === "user" &&
            user.fullName.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((user) => ({ value: user._id, label: user.fullName }));
      return filteredUsers;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const loadProducts = async (inputValue) => {
    try {
      const fetchedData = await productsFetch();
      const filteredProducts = fetchedData
        .filter((product) =>
          product.name.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((product) => ({ value: product._id, label: product.name }));
      return filteredProducts;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  const loadSensors = async (inputValue) => {
    try {
      const fetchedData = await Sensors();
      const filteredSensors = fetchedData
        .filter((sensor) =>
          sensor.name.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((sensor) => ({ value: sensor._id, label: sensor.name }));
      return filteredSensors;
    } catch (error) {
      console.error("Error fetching sensors:", error);
      return [];
    }
  };

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addSensor = (selectedSensor) => {
    if (selectedSensor) {
      // Add only the sensorId (without the state)
      setFormData((prevData) => ({
        ...prevData,
        sensors: [
          ...prevData.sensors,
          { sensorId: selectedSensor.value },  // Only add the sensorId here
        ],
      }));
    }
  };
  
  
  

  const removeSensor = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      sensors: prevData.sensors.filter((_, i) => i !== index),
    }));
  };

  const addControl = () => {
    setFormData((prevData) => ({
      ...prevData,
      controls: [
        ...prevData.controls,
        {
          pin: "",
          controlId: "",
          name: "",
          min: 0,
          max: 0,
          threshHold: 0,
          bypass: false,
          automate: true,
          state: "OFF",
        },
      ],
    }));
  };

  const handleControlChange = (index, field, value) => {
    const updatedControls = [...formData.controls];
    updatedControls[index][field] =
      field === "bypass" || field === "automate" ? !!value : value;
    setFormData((prevData) => ({
      ...prevData,
      controls: updatedControls,
    }));
  };

  const removeControl = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      controls: prevData.controls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format the installation date to match the expected format
    const formattedData = {
      ...formData,
      installationDate: format(new Date(formData.installationDate), "yyyy-MM-dd"),
    };
  
    // Only include the sensor IDs (no state)
    const sensorsOnlyIds = formattedData.sensors.map(sensor => sensor.sensorId);  // Only extract sensorId
  
    // Prepare the payload for updating the product
    const updateData = {
      productId: formattedData.productId,  // Product ID (_id of the product)
      alias: formattedData.alias,
      location: formattedData.location,
      sensors: sensorsOnlyIds,  // Only send sensor IDs, no state
      controls: formattedData.controls,  // Controls remain the same
    };
  
    try {
      let result;
      if (formattedData.uid) {
        console.log("Updating product with UID:", formattedData.uid);
        // Send the update request
        result = await updateUserProduct(formattedData.uid, updateData);  // Send the updated data
      } else {
        result = await createUserProduct(updateData);  // Create new product if no UID
      }
  
      onSubmit(result);  // Return the result to the parent component
      navigate("/user-product-management?productAdded=true");  // Navigate after form submission
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  
  
  
  return (
    <div className="add-product-container">
      <div className="card create-sensor-card">
        <button className="back-button" onClick={onCancel}>
          <FaArrowLeft /> Back
        </button>

        <h4 className="card-title">
          <FaPlusCircle />
          {product._id ? "Edit Product" : "Add Product"}
        </h4>

        <div className="card-content">
          <form onSubmit={handleSubmit} className="scrollable-form">
            {/* User ID Section with UID selection */}
            <div className="form-group">
              <label>User ID:</label>
              <Select
                name="userId"
                loadOptions={loadUsers}
                value={
                  formData.userId
                    ? { value: formData.userId, label: formData.userId }
                    : null
                } // Ensure controlled component
                onChange={(selectedOption) =>
                  handleChange("userId", selectedOption)
                }
                isSearchable
                placeholder="Select a User"
                required
              />
            </div>

            {/* Product ID Section */}
            <div className="form-group">
              <label>Product ID:</label>
              <Select
                name="productId"
                loadOptions={loadProducts}
                value={
                  formData.productId
                    ? {
                        value: formData.productId,
                        label: formData.productId.name,
                      }
                    : null
                } // Ensure you're passing the correct properties
                onChange={(selectedOption) =>
                  handleChange("productId", selectedOption)
                }
                isSearchable
                placeholder="Select a Product"
                required
              />
            </div>

            {/* UID Field */}
            <div className="form-group">
              <label>UID:</label>
              <input
                type="text"
                name="uid"
                value={formData.uid}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                placeholder="e.g., U123456"
                required
              />
            </div>

            {/* Alias, Location, Installation Date */}
            <div className="form-group">
              <label>Alias:</label>
              <input
                type="text"
                name="alias"
                value={formData.alias}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                placeholder="Enter alias for the product"
                required
              />
            </div>

            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                placeholder="Enter location of installation"
                required
              />
            </div>

            <div className="form-group">
              <label>Installation Date:</label>
              <input
                type="date"
                name="installationDate"
                value={formData.installationDate}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                required
              />
            </div>

            {/* Sensor Data Section */}
            <div className="form-group">
              <label>Sensors Used:</label>
              <Select
                name="sensor"
                loadOptions={loadSensors}
                onChange={addSensor}
                isSearchable
                placeholder="Select a Sensor"
              />
              <div className="selected-sensors-list">
                <ul>
                  {formData.sensors.map((sensor, index) => (
                    <li key={index}>
                      {/* Safely access sensorId properties */}
                      <p>
                        <strong>Sensor:</strong>{" "}
                        {sensor.sensorId?.name || "Unknown Sensor"}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {sensor.sensorId?.description || "No description available"}
                      </p>
                      <button type="button" onClick={() => removeSensor(index)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Controls Section */}
            <div className="form-group">
              <label>Controls:</label>
              <Tooltip id="controls-help">
                Configure control limits, bypass options, and automation.
              </Tooltip>
              {formData.controls.map((control, index) => (
                <div key={index} className="control-entry">
                  <label>
                    Pin:
                    <input
                      type="text"
                      value={control.pin}
                      onChange={(e) =>
                        handleControlChange(index, "pin", e.target.value)
                      }
                      placeholder="Pin"
                      required
                    />
                  </label>
                  <label>
                    Control ID:
                    <input
                      type="text"
                      value={control.controlId}
                      onChange={(e) =>
                        handleControlChange(index, "controlId", e.target.value)
                      }
                      placeholder="Control ID"
                      required
                    />
                  </label>
                  <label>
                    Name:
                    <input
                      type="text"
                      value={control.name}
                      onChange={(e) =>
                        handleControlChange(index, "name", e.target.value)
                      }
                      placeholder="Control name"
                      required
                    />
                  </label>
                  <label>
                    Min:
                    <input
                      type="number"
                      value={control.min}
                      onChange={(e) =>
                        handleControlChange(index, "min", e.target.value)
                      }
                      placeholder="Min value"
                      required
                    />
                  </label>
                  <label>
                    Max:
                    <input
                      type="number"
                      value={control.max}
                      onChange={(e) =>
                        handleControlChange(index, "max", e.target.value)
                      }
                      placeholder="Max value"
                      required
                    />
                  </label>
                  <label>
                    ThreshHold:
                    <input
                      type="number"
                      value={control.threshHold}
                      onChange={(e) =>
                        handleControlChange(index, "threshHold", e.target.value)
                      }
                      placeholder="Threshold"
                      required
                    />
                  </label>
                  <label>
                    Bypass:
                    <input
                      type="checkbox"
                      checked={control.bypass}
                      onChange={(e) =>
                        handleControlChange(index, "bypass", e.target.checked)
                      }
                    />
                  </label>
                  <label>
                    Automate:
                    <input
                      type="checkbox"
                      checked={control.automate}
                      onChange={(e) =>
                        handleControlChange(index, "automate", e.target.checked)
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeControl(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="add-button" onClick={addControl}>
                Add Control
              </button>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="form-actions">
              <button type="submit" className="submit-button">
                {product.id ? "Update Product" : "Add Product"}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
AddProduct.propTypes = {
  product: PropTypes.object,
  userId: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default AddProduct;
