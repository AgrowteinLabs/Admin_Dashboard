import { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, PageNotFound } from "./screens";
import Profile from './components/profile/Profile';
import Notifications from './components/Notifications/Notifications';
import Logout from './components/logout/Logout';
import { SidebarProvider } from './context/SidebarContext';
import { UserProvider } from "./context/UserContext";
import { ProductProvider } from "./context/ProductContext";  // Add ProductProvider
import ProtectedRoute from "./components/ProtectedRoute";  // Add ProtectedRoute
import Login from "./loginpage/login";
import UserManagement from "./components/user-management/UserManagement";
import ProductManagement from "./components/product-management/ProductManagement";
import SensorManagement from "./components/sensor-management/SensorManagement";
import ReportsManagement from "./components/reports/ReportsManagement";
import UserProductManagement from "./components/user-product-management/UserProductManagement";
import UserProductsPage from './components/user-product-management/UserProductPage';  // Import the new UserProductsPage

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <Router>
      <Routes>
        {/* Route for Login without providers */}
        <Route path="/login" element={<Login />} />

        {/* Main application routes with providers */}
        <Route
          element={
            <SidebarProvider>
              <UserProvider>
                <ProductProvider> {/* Wrap inside ProductProvider */}
                  <BaseLayout />
                </ProductProvider>
              </UserProvider>
            </SidebarProvider>
          }
        >
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-management"
            element={
              <ProtectedRoute>
                <ProductManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-product-management"
            element={
              <ProtectedRoute>
                <UserProductManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-products/:userId"  // Added User Products page with dynamic userId
            element={
              <ProtectedRoute>
                <UserProductsPage />  {/* Add UserProductsPage for dynamic route */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/sensor-management"
            element={
              <ProtectedRoute>
                <SensorManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>

      {/* Theme Toggle Button */}
      <button
        type="button"
        className="theme-toggle-btn"
        onClick={toggleTheme}
      >
        <img
          className="theme-icon"
          src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
          alt="Toggle theme"
        />
      </button>
    </Router>
  );
}

export default App;
