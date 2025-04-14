import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "./AreaCharts.scss";

const UserLocationsMap = () => {
  const [userLocations, setUserLocations] = useState([]); // State to store user locations

  // Fetch all users and their coordinates
  useEffect(() => {
    const fetchUsersAndGeocode = async () => {
      try {
        // Step 1: Fetch all users from the backend
        const usersResponse = await axios.get("https://agrowtein-5u7w.onrender.com/api/v1/users"); // Replace with your actual API endpoint
        const users = usersResponse.data;

        // Step 2: Geocode each user's city to get coordinates
        const apiKey = "f332bb8ac0c846b8869b185d45cf8cd0"; // Your OpenCage API key
        const geocodedUsers = await Promise.all(
          users.map(async (user) => {
            const { city, state, country } = user.address;
            try {
              const response = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${city},${state},${country}&key=${apiKey}`
              );

              if (response.data.results && response.data.results.length > 0) {
                const { lat, lng } = response.data.results[0].geometry;
                return {
                  id: user._id,
                  name: user.fullName,
                  coordinates: [lat, lng],
                  city,
                  state,
                  country,
                };
              }
            } catch (error) {
              console.error(`Error geocoding for user ${user.fullName}:`, error);
            }
            return null; // Return null for users without valid geocoding
          })
        );

        // Step 3: Filter out any null entries (failed geocoding)
        setUserLocations(geocodedUsers.filter((user) => user !== null));
      } catch (error) {
        console.error("Error fetching user data or geocoding:", error);
      }
    };

    fetchUsersAndGeocode();
  }, []);

  return (
    <div className="card">
      <h4 className="card-title">All Users Locations</h4>
      <div className="card-content map-wrapper">
        <MapContainer
          center={[20, 78]} // Centered on India
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocations.map((user) => (
            <Marker key={user.id} position={user.coordinates}>
              <Popup>
                {user.name} <br />
                {user.city}, {user.state}, {user.country}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default UserLocationsMap;
