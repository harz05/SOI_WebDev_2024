import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.email) {
        try {
          const response = await axios.get(`https://localhost:3000/all-users/${storedUser.email}`);
          setProfile(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className={`dashboard-container ${profile ? 'fade-in' : ''}`}>
      {profile ? (
        <div className="profile-card">
          <img src={profile.photo} alt="Profile" className="profile-photo" />
          <h2>{profile.name}</h2>
          <p className="profile-rollno">{profile.rollNo}</p>
          <p className="profile-email">{profile.email}</p>
          <p className="profile-about">{profile.about}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
