import React, { useState } from 'react';
import './Contacts.css';
import Footer from "./Footer";

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:3000/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Message sent successfully');
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className='contacts-p-20'>
      <div className="contacts-container mx-auto contacts-p-4 flex flex-col items-center space-y-6 pt-24">
        <h2 className="text-3xl font-semibold text-center mb-6">Contact Us</h2>
        <div className="w-full flex flex-col md:flex-row items-center md:justify-around space-y-6 md:space-y-0">
          <div className="contacts-glass-card w-full md:w-1/2 p-4">
            <form className="shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
              <div className="contacts-mb-4">
                <label className="contacts-block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                <input
                  className="contacts-shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                />
              </div>
              <div className="contacts-mb-4">
                <label className="contacts-block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                <input
                  className="contacts-shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="contacts-mb-6">
                <label className="contacts-block text-gray-700 text-sm font-bold mb-2" htmlFor="message">Message</label>
                <textarea
                  className="contacts-shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message"
                  rows="4"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="contacts-bg-blue-500 hover:bg-blue-700 text-red font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className='w-full'>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Contacts;
