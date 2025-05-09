import React, { useEffect, useState } from 'react';
import 'font-awesome/css/font-awesome.min.css'; // Ensure you have font-awesome installed
import axios from 'axios';

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get('https://localhost:3000/all-users');
        setUserCount(response.data.length);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchBookCount = async () => {
      try {
        const response = await axios.get('https://localhost:3000/all-books');
        setBookCount(response.data.length);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchUserCount();
    fetchBookCount();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>
      <div className="flex flex-wrap justify-center -mx-2">
        <div className="w-full md:w-1/3 px-2 mb-4">
          <div className="bg-gray-400 bg-opacity-20 backdrop-blur-lg shadow-lg rounded-lg text-center h-full hover:shadow-2xl hover:bg-gradient-to-r from-blue-100 to-blue-600 transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="p-4">
              <h4 className="text-xl font-semibold mb-2">Current Users</h4>
              <h2 className="shadow-md">
                <i className="fa fa-user fa-3x"></i>
              </h2>
              <h3 className="text-2xl font-bold mt-4">{userCount}</h3>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <div className="bg-gray-400 bg-opacity-20 backdrop-blur-lg shadow-lg rounded-lg text-center h-full hover:shadow-2xl hover:bg-gradient-to-r from-green-100 to-green-600 transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="p-4">
              <h4 className="text-xl font-semibold mb-2">Books in Library</h4>
              <h2 className="shadow-md">
                <i className="fa fa-book fa-3x"></i>
              </h2>
              <h3 className="text-2xl font-bold mt-4">{bookCount}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;