import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reminder.css'; // Import CSS file for styling

const Reminder = () => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await axios.get('https://localhost:3000/reminders');
      setReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  return (
    <div className="admin-dashboard"> {/* Apply CSS class */}
      <h2>Student Reminders</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Person Name</th>
            <th>Book Name</th>
            <th>Book Desc</th>
            <th>URL</th>
            <th>Added On</th>
          </tr>
        </thead>
        <tbody>
          {reminders.map((reminder, index) => (
            <tr key={index}>
              <td>{reminder.email}</td>
              <td>{reminder.personName}</td>
              <td>{reminder.bookName}</td>
              <td>{reminder.bookDesc}</td>
              <td>
                <a href={reminder.url} target="_blank" rel="noopener noreferrer">Visit</a>
              </td>
              <td>{new Date(reminder.addedOn).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reminder;
