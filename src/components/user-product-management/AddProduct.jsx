import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlusCircle } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { format } from "date-fns";
import Select from "react-select/async";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { usersFetch } from "../../api/userslistfetch";
import { productsFetch } from "../../api/productsFetch";
import { Sensors } from "../../api/sensorFetch";
import {
  createUserProduct,
  updateUserProduct,
} from "../../api/userProductsFetch";
import "./AddProduct.scss";

const AddProduct = ({
  product = {},
  userId,
  onSubmit = () => { },
  onCancel = () => { },
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: product.userId || userId || "",
    productId: product.productId || "",
    uid: product.uid || "",
    alias: product.alias || "",
    type: product.type || "Farm", // Default to "Farm"
    location: product.location || "",
    installationDate: product.installationDate || "",
    sensors: product.sensors || [],
    controls: product.controls || [],
  });

  useEffect(() => {
    const loadEditData = async () => {
      if (product._id) {
        try {
          // Load users to get the selected user data
          const users = await usersFetch();
          const selectedUser = users.find(u => u._id === (product.userId?._id || product.userId));
          const userOption = selectedUser ? { value: selectedUser._id, label: selectedUser.fullName } : null;

          // Load products to get the selected product data
          const products = await productsFetch();
          const selectedProduct = products.find(p => p._id === (product.productId?._id || product.productId));
          const productOption = selectedProduct ? { value: selectedProduct._id, label: selectedProduct.name } : null;

          // Load all sensors to get names for existing sensors
          const allSensors = await Sensors();

          // Format sensors with proper structure
          const formattedSensors = (product.sensors || []).map(sensor => {
            const sensorId = sensor.sensorId?._id || sensor.sensorId || sensor;
            const sensorData = allSensors.find(s => s._id === sensorId);
            return {
              sensorId: sensorData ? { value: sensorData._id, label: sensorData.name } : { value: sensorId, label: "Unknown Sensor" }
            };
          });

          // Format installation date for input field (yyyy-MM-dd)
          let formattedDate = product.installationDate || "";
          if (formattedDate) {
            try {
              const dateObj = new Date(formattedDate);
              formattedDate = dateObj.toISOString().split('T')[0];
            } catch (e) {
              console.error("Date format error:", e);
            }
          }

          // Ensure controls have all required fields including offset
          const formattedControls = (product.controls || []).map(control => ({
            pin: control.pin || "",
            controlId: control.controlId || "",
            name: control.name || "",
            min: control.min ?? 0,
            max: control.max ?? 0,
            threshHold: control.threshHold ?? 0,
            offset: control.offset ?? 0,
            bypass: control.bypass ?? false,
            automate: control.automate ?? true,
            state: control.state || "OFF",
          }));

          setFormData({
            userId: userOption,
            productId: productOption,
            uid: product.uid || "",
            alias: product.alias || "",
            type: product.type || "Farm",
            location: product.location || "",
            installationDate: formattedDate,
            sensors: formattedSensors,
            controls: formattedControls,
          });
        } catch (error) {
          console.error("Error loading edit data:", error);
          Swal.fire("Error", "Failed to load product data for editing", "error");
        }
      }
    };

    loadEditData();
  }, [product, userId]);

  const loadUsers = async (inputValue) => {
    try {
      const fetched = await usersFetch();
      return fetched
        .filter(
          (user) =>
            user.role.toLowerCase() === "user" &&
            user.fullName.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((u) => ({ value: u._id, label: u.fullName }));
    } catch (err) {
      console.error("Users load error:", err);
      return [];
    }
  };

  const loadProducts = async (inputValue) => {
    try {
      const fetched = await productsFetch();
      return fetched
        .filter((p) =>
          p.name.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((p) => ({ value: p._id, label: p.name }));
    } catch (err) {
      console.error("Products load error:", err);
      return [];
    }
  };

  const loadSensors = async (inputValue) => {
    try {
      const fetched = await Sensors();
      return fetched
        .filter((s) =>
          s.name.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((s) => ({ value: s._id, label: s.name }));
    } catch (err) {
      console.error("Sensors load error:", err);
      return [];
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addSensor = (sensorOption) => {
    if (sensorOption) {
      setFormData((prev) => ({
        ...prev,
        sensors: [
          ...prev.sensors,
          { sensorId: sensorOption },
        ],
      }));
    }
  };

  const removeSensor = (index) => {
    setFormData((prev) => ({
      ...prev,
      sensors: prev.sensors.filter((_, i) => i !== index),
    }));
  };

  const addControl = () => {
    setFormData((prev) => ({
      ...prev,
      controls: [
        ...prev.controls,
        {
          pin: "",
          controlId: "",
          name: "",
          min: 0,
          max: 0,
          threshHold: 0,
          offset: 0,
          bypass: false,
          automate: true,
          state: "OFF",
        },
      ],
    }));
  };

  const handleControlChange = (index, field, value) => {
    const updated = [...formData.controls];
    if (field === "bypass" || field === "automate") {
      updated[index][field] = !!value;
    } else if (field === "min" || field === "max" || field === "threshHold" || field === "offset") {
      updated[index][field] = Number(value);

      // Auto-validate threshHold when min, max, or threshHold changes
      if (field === "min" || field === "max" || field === "threshHold") {
        const min = field === "min" ? Number(value) : updated[index].min;
        const max = field === "max" ? Number(value) : updated[index].max;
        const threshold = field === "threshHold" ? Number(value) : updated[index].threshHold;

        // Clamp threshold to valid range if needed
        if (min !== undefined && max !== undefined && threshold !== undefined) {
          if (threshold < min) {
            updated[index].threshHold = min;
          } else if (threshold > max) {
            updated[index].threshHold = max;
          }
        }
      }
    } else {
      updated[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, controls: updated }));
  };

  const removeControl = (index) => {
    setFormData((prev) => ({
      ...prev,
      controls: prev.controls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEditing = Boolean(product && product._id);

    // Validate controls before submission
    const invalidControls = formData.controls.filter((control) => {
      const min = Number(control.min);
      const max = Number(control.max);
      const threshold = Number(control.threshHold);

      if (threshold < min || threshold > max) {
        return true;
      }
      return false;
    });

    if (invalidControls.length > 0) {
      Swal.fire(
        "❌ Validation Error",
        "ThreshHold must be between Min and Max values for all controls. Please check your control settings.",
        "error"
      );
      return;
    }

    try {
      let result;

      if (isEditing) {
        // For updates, only send the fields that can be updated
        const updatePayload = {
          alias: formData.alias,
          location: formData.location,
          type: formData.type,
          controls: formData.controls.map(control => ({
            pin: control.pin,
            controlId: control.controlId,
            name: control.name,
            min: Number(control.min),
            max: Number(control.max),
            threshHold: Number(control.threshHold),
            offset: Number(control.offset),
            bypass: Boolean(control.bypass),
            automate: Boolean(control.automate),
          })),
        };
        result = await updateUserProduct(formData.uid, updatePayload);
      } else {
        // For creation, send all fields
        const formattedDate = format(new Date(formData.installationDate), "yyyy-MM-dd");

        const sensorsFormatted = (formData.sensors || []).map(sensor => {
          if (sensor?.sensorId?.value) {
            return { sensorId: sensor.sensorId.value };
          } else if (sensor?.sensorId && typeof sensor.sensorId === "string") {
            return { sensorId: sensor.sensorId };
          } else if (sensor?.value) {
            return { sensorId: sensor.value };
          } else if (typeof sensor === "string") {
            return { sensorId: sensor };
          }
          return null;
        }).filter(Boolean);

        const createPayload = {
          userId: formData.userId?.value || formData.userId,
          productId: formData.productId?.value || formData.productId,
          uid: formData.uid,
          alias: formData.alias,
          type: formData.type,
          location: formData.location,
          installationDate: formattedDate,
          sensors: sensorsFormatted,
          controls: formData.controls.map(control => ({
            pin: control.pin,
            controlId: control.controlId,
            name: control.name,
            min: Number(control.min),
            max: Number(control.max),
            threshHold: Number(control.threshHold),
            offset: Number(control.offset),
            bypass: Boolean(control.bypass),
            automate: Boolean(control.automate),
          })),
        };
        result = await createUserProduct(createPayload);
      }

      Swal.fire("✅ Success", result.message || "User product saved successfully", "success");
      onSubmit(result);
      navigate("/user-product-management?productSaved=true");
    } catch (error) {
      console.error("❌ Submit error:", error);
      Swal.fire("❌ Error", error?.response?.data?.message || "Failed to save user product", "error");
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
            <div className="form-group">
              <label>User ID:</label>
              <Select
                name="userId"
                loadOptions={loadUsers}
                defaultOptions
                value={formData.userId}
                onChange={(opt) => handleChange("userId", opt)}
                isSearchable
                placeholder="Select a User"
                isDisabled={Boolean(product._id)}
                required
              />
            </div>

            <div className="form-group">
              <label>Product ID:</label>
              <Select
                name="productId"
                loadOptions={loadProducts}
                defaultOptions
                value={formData.productId}
                onChange={(opt) => handleChange("productId", opt)}
                isSearchable
                placeholder="Select a Product"
                isDisabled={Boolean(product._id)}
                required
              />
            </div>

            <div className="form-group">
              <label>UID:</label>
              <input
                type="text"
                name="uid"
                value={formData.uid}
                onChange={(e) =>
                  handleChange(e.target.name, e.target.value)
                }
                placeholder="e.g., U123456"
                disabled={Boolean(product._id)}
                required
              />
            </div>

            <div className="form-group">
              <label>Alias:</label>
              <input
                type="text"
                name="alias"
                value={formData.alias}
                onChange={(e) =>
                  handleChange(e.target.name, e.target.value)
                }
                placeholder="Enter alias for the product"
                required
              />
            </div>

            <div className="form-group">
              <label>Type:</label>
              <select
                name="type"
                value={formData.type}
                onChange={e => handleChange("type", e.target.value)}
                required
              >
                <option value="Farm">Farm</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={(e) =>
                  handleChange(e.target.name, e.target.value)
                }
                placeholder="Enter location"
                required
              />
            </div>

            <div className="form-group">
              <label>Installation Date:</label>
              <input
                type="date"
                name="installationDate"
                value={formData.installationDate}
                onChange={(e) =>
                  handleChange(e.target.name, e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Sensors Used:</label>
              <Select
                name="sensor"
                loadOptions={loadSensors}
                defaultOptions
                onChange={addSensor}
                isSearchable
                placeholder="Select a Sensor"
              />
              <ul>
                {formData.sensors.map((sensor, i) => (
                  <li key={i}>
                    {sensor.sensorId?.label || sensor.sensorId?.name || "Sensor"}
                    <button type="button" onClick={() => removeSensor(i)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="form-group">
              <label>Controls:</label>
              <Tooltip id="controls-help">
                Configure control limits, bypass, automation.
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
                      value={control.min ?? 0}
                      onChange={(e) =>
                        handleControlChange(index, "min", Number(e.target.value))
                      }
                      required
                    />
                  </label>
                  <label>
                    Max:
                    <input
                      type="number"
                      value={control.max ?? 0}
                      onChange={(e) =>
                        handleControlChange(index, "max", Number(e.target.value))
                      }
                      required
                    />
                  </label>
                  <label>
                    ThreshHold:
                    <input
                      type="number"
                      value={control.threshHold ?? 0}
                      min={control.min ?? 0}
                      max={control.max ?? 100}
                      onChange={(e) =>
                        handleControlChange(
                          index,
                          "threshHold",
                          Number(e.target.value)
                        )
                      }
                      required
                      title={`Must be between ${control.min ?? 0} and ${control.max ?? 100}`}
                    />
                    {(control.threshHold < control.min || control.threshHold > control.max) && (
                      <span style={{ color: 'red', fontSize: '0.85em', display: 'block' }}>
                        Must be between {control.min} and {control.max}
                      </span>
                    )}
                  </label>
                  <label>
                    Offset:
                    <input
                      type="number"
                      value={control.offset ?? 0}
                      onChange={(e) =>
                        handleControlChange(
                          index,
                          "offset",
                          Number(e.target.value)
                        )
                      }
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
                    onClick={() => removeControl(index)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addControl}
                className="add-button"
              >
                Add Control
              </button>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                {product._id ? "Update Product" : "Add Product"}
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
