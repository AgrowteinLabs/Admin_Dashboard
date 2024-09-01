import { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, PageNotFound } from "./screens";
import Profile from './components/profile/Profile'; // Import the Profile component
import Notifications from './components/Notifications/Notifications'; // Import the Notifications component
import Logout from './components/logout/Logout'; // Import the Logout component
import { SidebarProvider } from './context/SidebarContext'; // Import SidebarProvider
import { UserProvider } from "./context/UserContext";
import UserManagement from "./components/user-management/UserManagement";
import ProductManagement from "./components/product-management/ProductManagement"; // Import the ProductManagement component
import SensorManagement from "./components/sensor-management/SensorManagement"; // Import the SensorManagement component
import ReportsManagement from "./components/reports/ReportsManagement"; // Import the ReportsManagement component
import UserProductManagement from "./components/userProduct-management/userProductManagement"; // Import the UserProductManagement component

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
    <SidebarProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route element={<BaseLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/product-management" element={<ProductManagement />} /> 
              <Route path="/usersproduct-management" element={<UserProductManagement />} /> 
              <Route path="/sensor-management" element={<SensorManagement />} />
              <Route path="/reports" element={<ReportsManagement />}/>
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>

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
      </UserProvider>
    </SidebarProvider>
  );
}

export default App;
