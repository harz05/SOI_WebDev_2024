import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css';

const EditProfile = () => {
  const [profile, setProfile] = useState({
    email: '',
    name: '',
    rollNo: '',
    about: '',
    photo: ''
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setProfile(storedUser);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.patch('https://localhost:3000/update-user', profile);
      localStorage.setItem('user', JSON.stringify(result.data));
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="edit-profile-container">
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <h2>Edit Profile</h2>
        <label>
          Name:
          <input type="text" name="name" value={profile.name} onChange={handleChange} />
        </label>
        <label>
          Roll No:
          <input type="text" name="rollNo" value={profile.rollNo} onChange={handleChange} />
        </label>
        <label>
          About:
          <input type="text" name="about" value={profile.about} onChange={handleChange} />
        </label>
        <label>
          Photo URL:
          <input type="text" name="photo" value={profile.photo} onChange={handleChange} />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProfile;
