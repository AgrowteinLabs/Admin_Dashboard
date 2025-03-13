<<<<<<< HEAD
import  { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import "./Profile.scss";
import defaultProfileIcon from '../../assets/defaultProfileIcon.png'; // Path to the fixed profile icon

const Profile = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <div>Loading...</div>; // Show a loading state while user data is being fetched
=======
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import "./Profile.scss";
import defaultProfileIcon from '../../assets/defaultProfileIcon.png'; // Path to the fixed profile icon
import { fetchUser } from '../../api/fetchuser';
import { CircularProgress } from '@mui/material';

const Profile = () => {
  const { user } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUser();
      if (data.error) {
        setError(data.error);
        return;
      }
      setUserData(data);
    };

    getUserData();
  }, []);

  if (error) {
    // Handle error (e.g., redirect to login page or show an error message)
    return (
      <div className="error-state">
        <h1>{error}</h1>
        <p>Go to the login page.</p>
        <button  onClick={() => window.location.href = '/login'}>Login</button>
      </div>
    );
  }

  if (!user || !userData) {
    return (
      <div className="loading-state">
        <CircularProgress />
      </div>
    );
>>>>>>> d499f1d (Initial commit)
  }

  return (
    <div className="profile-page">
      <div className="profile-info">
        <img
          src={defaultProfileIcon}  // Use fixed profile icon for all users
          alt="Profile"
          className="profile-picture"
        />
<<<<<<< HEAD
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-bio">{user.bio}</p>
=======
        <h1 className="profile-name">{userData.fullName}</h1>
        <p className="profile-bio">
            {`${userData.address.city}, ${userData.address.state}, ${userData.address.country} - ${userData.address.postalCode}`}
          </p>
>>>>>>> d499f1d (Initial commit)
      </div>
      <div className="profile-content">
        <div className="profile-card">
          <h2>Contact Information</h2>
<<<<<<< HEAD
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
        </div>
        <div className="profile-card">
          <h2>Personal Details</h2>
          <p>Location: {user.location}</p>
          <p>Joined: {user.joined}</p>
        </div>
        <div className="profile-card">
          <h2>Interests</h2>
          <p>{user.interests.join(', ')}</p>
=======
          <p>Email: {userData.email}</p>
          <p>Phone: {userData.phoneNumber}</p>
        </div>
        <div className="profile-card">
          <h2>Personal Details</h2>
          <p>Location: {`${userData.address.city}, ${userData.address.state}`}</p>
          <p>Joined: {new Date(userData.dayOfRegistration).toLocaleDateString()}</p>
        </div>
        <div className="profile-card">
          <h2>Interests</h2>
          <p>{user.interests ? user.interests.join(', ') : "No interests listed"}</p>
>>>>>>> d499f1d (Initial commit)
        </div>
      </div>
    </div>
  );
};

export default Profile;
