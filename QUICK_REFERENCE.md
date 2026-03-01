# Quick Reference: UserProduct Updates

## 🎯 What Changed?

### New Fields

1. **`mode`** (Product level) - Controls global automation mode
   - Values: `"manual"` | `"automate"`
   - Default: `"manual"`

2. **`supportsAuto`** (Control level) - Hardware automation capability
   - Values: `true` | `false`
   - Default: `true`

---

## 🔧 Code Examples

### 1. Creating a Control with Automation Support

```javascript
// Automated control (pump)
{
  pin: "GPIO17",
  controlId: "pump1",
  name: "Water Pump",
  min: 0,
  max: 100,
  threshHold: 65,            // Activates when value < 65
  offset: 0,
  bypass: false,
  supportsAuto: true,        // ✅ Hardware supports automation
  automate: true,            // ✅ Automation is enabled
  state: "OFF"
}

// Manual-only control (light)
{
  pin: "GPIO27",
  controlId: "light1",
  name: "Grow Light",
  min: 0,
  max: 100,
  threshHold: 0,             // Not used for manual controls
  offset: 0,
  bypass: true,
  supportsAuto: false,       // ❌ Hardware doesn't support automation
  automate: false,           // ❌ Cannot be automated
  state: "OFF"
}
```

### 2. Using the Global Mode API

```javascript
import { updateProductMode } from "../../api/userProductsFetch";

// Switch entire controller to automation mode
try {
  const result = await updateProductMode("CTRL1", "automate");

  console.log(`Mode changed to: ${result.mode}`);
  console.log(`Controls automated: ${result.updatedControls.join(", ")}`);
  console.log(`Controls skipped: ${result.skippedControls.join(", ")}`);

  // Example output:
  // Mode changed to: automate
  // Controls automated: pump1, fan1
  // Controls skipped: light1
} catch (error) {
  console.error("Mode update failed:", error.message);
}
```

### 3. Form Validation Example

```javascript
// Validate control before submission
const validateControl = (control) => {
  const errors = [];

  // Check min/max relationship
  if (control.min >= control.max) {
    errors.push("Min must be less than Max");
  }

  // Validate threshold
  if (control.threshHold < control.min || control.threshHold > control.max) {
    errors.push(`ThreshHold must be between ${control.min} and ${control.max}`);
  }

  // Validate offset
  if (control.offset < control.min || control.offset > control.max) {
    errors.push(`Offset must be between ${control.min} and ${control.max}`);
  }

  // Check automation compatibility
  if (control.automate && !control.supportsAuto) {
    errors.push("Cannot enable automation - hardware doesn't support it");
  }

  // Validate controlId length
  if (control.controlId.length < 3 || control.controlId.length > 6) {
    errors.push("Control ID must be 3-6 characters");
  }

  return errors;
};

// Usage
const errors = validateControl(myControl);
if (errors.length > 0) {
  alert(errors.join("\n"));
}
```

### 4. Conditional UI Rendering

```javascript
// Show automation options only if supported
const ControlForm = ({ control, onChange }) => {
  return (
    <div className="control-entry">
      {/* Basic fields always shown */}
      <input
        type="text"
        value={control.name}
        onChange={(e) => onChange("name", e.target.value)}
      />

      {/* Threshold - only editable if automation supported */}
      <input
        type="number"
        value={control.threshHold}
        disabled={!control.supportsAuto}
        onChange={(e) => onChange("threshHold", e.target.value)}
      />

      {/* Supports Auto checkbox */}
      <label>
        <input
          type="checkbox"
          checked={control.supportsAuto ?? true}
          onChange={(e) => onChange("supportsAuto", e.target.checked)}
        />
        Hardware Supports Automation
      </label>

      {/* Automate checkbox - disabled if hardware doesn't support */}
      <label>
        <input
          type="checkbox"
          checked={control.automate}
          disabled={!control.supportsAuto}
          onChange={(e) => onChange("automate", e.target.checked)}
        />
        Enable Automation
        {!control.supportsAuto && <span>(Manual only)</span>}
      </label>
    </div>
  );
};
```

### 5. Product Creation Payload

```javascript
// Complete create payload with new fields
const createPayload = {
  userId: "user123",
  productId: "product456",
  uid: "CTRL1",
  alias: "Main Controller",
  mode: "automate", // ⭐ New field
  type: "Farm",
  location: "Greenhouse A",
  installationDate: "2026-02-27",
  sensors: [{ sensorId: "sensor789" }],
  controls: [
    {
      pin: "GPIO17",
      controlId: "pump1",
      name: "Water Pump",
      min: 0,
      max: 100,
      threshHold: 65,
      offset: 0,
      bypass: false,
      supportsAuto: true, // ⭐ New field
      automate: true,
      state: "OFF",
    },
  ],
};

// Send to backend
const result = await createUserProduct(createPayload);
```

### 6. Update Payload

```javascript
// Update existing product
const updatePayload = {
  alias: "Updated Controller Name",
  mode: "manual", // ⭐ Change mode
  location: "New Location",
  type: "Farm",
  controls: [
    {
      pin: "GPIO17",
      controlId: "pump1",
      name: "Water Pump",
      min: 0,
      max: 100,
      threshHold: 65,
      offset: 5, // Updated offset
      bypass: false,
      supportsAuto: true,
      automate: false, // Disabled automation
      state: "OFF",
    },
  ],
};

const result = await updateUserProduct("CTRL1", updatePayload);
```

---

## 📊 Mode Behavior Matrix

| Global Mode | Control supportsAuto | Control automate | Threshold Input | Behavior                     |
| ----------- | -------------------- | ---------------- | --------------- | ---------------------------- |
| manual      | true                 | false            | Disabled        | Manual operation only        |
| manual      | false                | false            | Disabled        | Manual operation only        |
| automate    | true                 | true             | Enabled         | Automated based on threshold |
| automate    | false                | false            | Disabled        | Manual operation only        |

---

## 🎨 UI States Reference

### State 1: Automated Control (Good to go!)

```
┌────────────────────────────────┐
│ Water Pump                     │
│ State: ON ✓                    │
│                                │
│ 🤖 Automation Enabled          │
│ Threshold: ████•──── 65%       │
│ [Min: 0] ──── [Max: 100]       │
└────────────────────────────────┘
```

### State 2: Manual-Only Control

```
┌────────────────────────────────┐
│ Grow Light                     │
│ State: OFF ✕                   │
│                                │
│ 🪜 Manual Control Only         │
│ ⚠️ Hardware limitation         │
│                                │
│ [ON] [OFF]                     │
└────────────────────────────────┘
```

---

## 🚨 Common Pitfalls

### ❌ Don't Do This:

```javascript
// Setting automate=true when supportsAuto=false
{
  supportsAuto: false,
  automate: true,        // ❌ This will fail validation!
}
```

### ✅ Do This Instead:

```javascript
// Proper handling
{
  supportsAuto: false,
  automate: false,       // ✅ Correct
}
```

---

### ❌ Don't Do This:

```javascript
// Setting threshold outside range
{
  min: 0,
  max: 100,
  threshHold: 150,      // ❌ Out of range!
}
```

### ✅ Do This Instead:

```javascript
// Validate and clamp
{
  min: 0,
  max: 100,
  threshHold: Math.min(Math.max(value, min), max), // ✅ Clamped to range
}
```

---

## 🔗 Quick Links

- **Full Documentation:** [USERPRODUCT_FRONTEND_CHANGES.md](./USERPRODUCT_FRONTEND_CHANGES.md)
- **API File:** [userProductsFetch.js](./src/api/userProductsFetch.js)
- **Form Component:** [AddProduct.jsx](./src/components/user-product-management/AddProduct.jsx)
- **Styles:** [AddProduct.scss](./src/components/user-product-management/AddProduct.scss)

---

**Last Updated:** February 27, 2026
