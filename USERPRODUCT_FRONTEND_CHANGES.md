# UserProduct Schema Updates - Frontend Implementation Guide

## 📋 Overview

This document outlines the changes made to the Admin Dashboard to support the updated UserProduct schema with new automation features.

---

## 🎯 Key Changes Implemented

### 1. **Global Mode Field (Product Level)**

- New `mode` field added with values: `"manual"` | `"automate"`
- Default value: `"manual"`
- Controls automation behavior for all controls in a product

### 2. **Hardware Automation Support (Control Level)**

- New `supportsAuto` field for each control
- Default value: `true`
- Indicates if control hardware supports automation
- Controls with `supportsAuto: false` are manual-only

### 3. **Enhanced Validation**

- Threshold must be within min-max range
- Offset must be within min-max range
- Min must be less than Max
- ControlId must be 3-6 characters
- Automate can only be true if supportsAuto is true

---

## 📁 Files Modified

### 1. **AddProduct.jsx**

**Location:** `src/components/user-product-management/AddProduct.jsx`

#### Changes:

- ✅ Added `mode` field to formData state
- ✅ Added `supportsAuto` field to controls
- ✅ Enhanced validation logic for threshold and offset
- ✅ Added global mode toggle UI
- ✅ Added supportsAuto checkbox for each control
- ✅ Disabled threshold input when supportsAuto is false
- ✅ Disabled automate checkbox when supportsAuto is false
- ✅ Auto-clamping of threshold and offset values

#### New Form Fields:

```jsx
// Global Mode Selector
<div className="form-group">
  <label>Global Mode:</label>
  <select name="mode" value={formData.mode}>
    <option value="manual">🪜 Manual Mode</option>
    <option value="automate">🤖 Automate Mode</option>
  </select>
</div>

// Per-Control Fields
<label>
  Supports Auto:
  <input type="checkbox" checked={control.supportsAuto} />
</label>
<label>
  Automate:
  <input
    type="checkbox"
    checked={control.automate}
    disabled={!control.supportsAuto}
  />
</label>
```

### 2. **userProductsFetch.js**

**Location:** `src/api/userProductsFetch.js`

#### New API Function:

```javascript
/**
 * Update global mode for a product (affects all controls)
 * @param {string} uid - Unique identifier of the product
 * @param {string} mode - "manual" or "automate"
 */
export const updateProductMode = async (uid, mode) => {
  const response = await axios.post(
    `${API_BASE_URL}/v1/product/${uid}/mode`,
    { mode },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};
```

#### Response Format:

```javascript
{
  uid: "ABC123",
  mode: "automate",
  updatedControls: ["C1", "C2"],    // Controls that were automated
  skippedControls: ["C3"]           // Manual-only controls
}
```

### 3. **AddProduct.scss**

**Location:** `src/components/user-product-management/AddProduct.scss`

#### Enhancements:

- ✅ Styled control entries with hover effects
- ✅ Enhanced mode selector appearance
- ✅ Added disabled state styling for inputs
- ✅ Added validation message styles
- ✅ Improved visual hierarchy

---

## 🚀 Usage Examples

### Creating a New Product with Mixed Control Types

```javascript
const newProduct = {
  userId: "user123",
  productId: "product456",
  uid: "CTRL1",
  alias: "Greenhouse Controller",
  mode: "automate", // ⭐ Global automation mode
  type: "Farm",
  location: "North Field",
  installationDate: "2026-02-27",
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
      supportsAuto: true, // ⭐ Can be automated
      automate: true, // ⭐ Currently automated
      state: "OFF",
    },
    {
      pin: "GPIO27",
      controlId: "light1",
      name: "Grow Light",
      min: 0,
      max: 100,
      threshHold: 0,
      offset: 0,
      bypass: true,
      supportsAuto: false, // ⭐ Manual-only hardware
      automate: false, // ⭐ Cannot be automated
      state: "OFF",
    },
  ],
};
```

### Updating Global Mode

```javascript
import { updateProductMode } from "../../api/userProductsFetch";

// Switch to automation mode
const result = await updateProductMode("CTRL1", "automate");

console.log(result);
// Output:
// {
//   uid: "CTRL1",
//   mode: "automate",
//   updatedControls: ["pump1"],     // Automated
//   skippedControls: ["light1"]     // Stayed manual (supportsAuto: false)
// }
```

---

## 🎨 UI/UX Features

### 1. **Global Mode Indicator**

- Visual emoji icons: 🪜 for Manual, 🤖 for Automate
- Descriptive help text below selector
- Highlighted border for mode selector

### 2. **Control Cards**

- Each control displayed in a bordered card
- Hover effect highlights active control
- Visual grouping of related fields

### 3. **Smart Field Behavior**

#### When `supportsAuto = false`:

- ❌ Threshold input is disabled
- ❌ Automate checkbox is disabled
- ℹ️ Shows "(Manual only)" label
- ℹ️ Shows helper text explaining limitation

#### When `supportsAuto = true`:

- ✅ Threshold input is enabled
- ✅ Automate checkbox is enabled
- 🎯 Full automation capabilities

### 4. **Validation Feedback**

- Real-time error messages below invalid fields
- Red text for validation errors
- Input clamping prevents out-of-range values
- Comprehensive form submission validation

---

## 🔍 Validation Rules Enforced

### Product Level

| Field   | Validation                     |
| ------- | ------------------------------ |
| `mode`  | Must be "manual" or "automate" |
| `uid`   | Required, cannot be empty      |
| `alias` | Required, cannot be empty      |

### Control Level

| Field        | Validation                               | Error Message                                               |
| ------------ | ---------------------------------------- | ----------------------------------------------------------- |
| `min`        | Must be < `max`                          | "Min must be less than Max"                                 |
| `threshHold` | Must be: `min ≤ threshHold ≤ max`        | "ThreshHold (X) must be between min and max"                |
| `offset`     | Must be: `min ≤ offset ≤ max`            | "Offset (X) must be between min and max"                    |
| `controlId`  | 3-6 characters                           | "Control ID must be 3-6 characters"                         |
| `automate`   | Can only be true if `supportsAuto: true` | "Cannot enable automation when hardware doesn't support it" |

---

## 🧪 Testing Checklist

### ✅ Form Creation Tests

- [ ] Create product with mode="manual"
- [ ] Create product with mode="automate"
- [ ] Add control with supportsAuto=true
- [ ] Add control with supportsAuto=false
- [ ] Verify threshold is disabled when supportsAuto=false
- [ ] Verify automate is disabled when supportsAuto=false

### ✅ Validation Tests

- [ ] Submit with threshold < min (should fail)
- [ ] Submit with threshold > max (should fail)
- [ ] Submit with offset < min (should fail)
- [ ] Submit with offset > max (should fail)
- [ ] Submit with min >= max (should fail)
- [ ] Submit with controlId length < 3 or > 6 (should fail)
- [ ] Submit with automate=true and supportsAuto=false (should fail)

### ✅ Edit Mode Tests

- [ ] Edit existing product and verify mode is loaded
- [ ] Edit existing product and verify supportsAuto is loaded
- [ ] Change mode from manual to automate
- [ ] Change mode from automate to manual
- [ ] Update control supportsAuto from true to false
- [ ] Verify automate becomes false when supportsAuto changes to false

### ✅ UI/UX Tests

- [ ] Mode selector shows emoji icons
- [ ] Help text appears below mode selector
- [ ] Control cards have hover effect
- [ ] Disabled fields show visual indication
- [ ] Validation messages appear in real-time
- [ ] Helper tooltips work correctly

---

## 🔄 Migration & Backward Compatibility

### Existing Data Handling

- **Backend handles missing fields automatically** ✅
- Old products without `mode` → Return `mode: "manual"`
- Old controls without `supportsAuto` → Return `supportsAuto: true`
- Frontend code treats all products uniformly

### No Special Handling Required

```javascript
// This works for both old and new products
const product = await userProductByUidFetch("ABC123");
console.log(product.mode); // Always exists
console.log(product.controls[0].supportsAuto); // Always exists
```

---

## 📚 Related Backend Endpoints

### 1. Create Product

```
POST /api/user/product
Body: { userId, productId, uid, alias, mode, type, location, installationDate, controls, sensors }
```

### 2. Update Product

```
PUT /api/user/product/{uid}
Body: { alias, mode, location, type, controls, sensors }
```

### 3. Update Global Mode ⭐ NEW

```
POST /api/v1/product/{uid}/mode
Body: { mode: "manual" | "automate" }
Response: { uid, mode, updatedControls[], skippedControls[] }
```

### 4. Get Product by UID

```
GET /api/user/product/uid/{uid}
Response: Full UserProduct with mode and supportsAuto fields
```

---

## 🎓 Best Practices

### DO ✅

- Always check `supportsAuto` before displaying automation options
- Use the global mode endpoint for bulk control updates
- Display which controls were skipped in mode updates
- Validate threshold and offset before submission
- Show clear visual indicators for disabled fields
- Provide helpful tooltips and descriptions

### DON'T ❌

- Allow manual override of supportsAuto limitations
- Display automation UI for manual-only controls
- Submit values outside min-max range
- Ignore backend validation errors
- Assume all controls support automation
- Show technical field names in UI (e.g., "supportsAuto")

---

## 🐛 Troubleshooting

### Issue: Threshold input is disabled

**Cause:** `supportsAuto` is set to `false`
**Solution:** This is intentional. Only enable supportsAuto if the hardware truly supports automation.

### Issue: Validation fails on submit

**Cause:** Values are outside min-max range
**Solution:** Check that threshold and offset are between min and max values.

### Issue: Global mode change doesn't affect all controls

**Cause:** Some controls have `supportsAuto: false`
**Solution:** This is expected behavior. Check `skippedControls` in API response.

### Issue: Old products missing new fields

**Cause:** Database record predates schema update
**Solution:** No action needed - backend automatically fills missing fields with defaults.

---

## 🔗 Additional Resources

- [Backend API Documentation](../../docs/API.md)
- [UserProduct Schema Documentation](./USERPRODUCT_SCHEMA.md)
- [Validation Rules Reference](./VALIDATION_RULES.md)

---

## 📞 Support

For questions or issues:

- Backend Team: Contact for API-related questions
- Frontend Team: Check this documentation first
- GitHub Issues: Report bugs or suggest improvements

---

**Last Updated:** February 27, 2026
**Version:** 2.0
