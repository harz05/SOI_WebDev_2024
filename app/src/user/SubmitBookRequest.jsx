import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubmitBookRequest.css';

const SubmitBookRequest = () => {
  const [bookName, setBookName] = useState('');
  const [bookUrl, setBookUrl] = useState('');
  const [note, setNote] = useState('');
  const [submittedBooks, setSubmittedBooks] = useState([]);
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.email) {
      setEmail(storedUser.email);
      fetchProfile(storedUser.email);
    }
  }, []);

  const fetchProfile = async (email) => {
    try {
      const response = await axios.get(`https://localhost:3000/all-users/${email}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    axios
      .get('https://localhost:3000/bookRequests')
      .then(response => setSubmittedBooks(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSubmit = event => {
    event.preventDefault();
    const newBookRequest = {
      bookName,
      url: bookUrl,
      bookDesc: note,
      personName: profile ? profile.name : '',
      email: email,
      likes: 1,
      addedOn: new Date().toISOString(),
    };

    axios
      .post('https://localhost:3000/bookRequests', newBookRequest)
      .then(response => {
        setSubmittedBooks([...submittedBooks, response.data]);
        setBookName('');
        setBookUrl('');
        setNote('');
      })
      .catch(error => console.error('Error submitting book request:', error));
  };

  const handleLike = async (id) => {
    try {
      const response = await axios.patch(`https://localhost:3000/bookRequests/${id}/like`);
      setSubmittedBooks(submittedBooks.map(book => 
        book._id === id ? { ...book, likes: response.data.likes } : book
      ));
    } catch (error) {
      console.error('Error liking book request:', error);
    }
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(date).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="submit-book-request">
      <h2>Submit Book Request</h2>
      <form onSubmit={handleSubmit} className="book-request-form">
        <div className="form-group">
          <label htmlFor="bookName">Book Name *</label>
          <input
            type="text"
            id="bookName"
            value={bookName}
            onChange={e => setBookName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="bookUrl">Google/Amazon Book Url</label>
          <input
            type="url"
            id="bookUrl"
            value={bookUrl}
            onChange={e => setBookUrl(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="note">Note *</label>
          <textarea
            id="note"
            value={note}
            onChange={e => setNote(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">
          Submit Request
        </button>
      </form>
      <table className="submitted-books-table">
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Url</th>
            <th>BookDesc</th>
            <th>Likes (30)</th>
            <th>Added On</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {submittedBooks.map((book, index) => (
            <tr key={index}>
              <td>{book.bookName}</td>
              <td>
                <a
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit
                </a>
              </td>
              <td>{book.bookDesc}</td>
              <td>{book.likes}</td>
              <td>{formatDate(book.addedOn)}</td>
              <td>
                <button 
                  className="btn-action" 
                  onClick={() => handleLike(book._id)}
                >
                  👍
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmitBookRequest;
