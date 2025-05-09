import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const UpdateUserBooks = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [books, setBooks] = useState([{ title: '', issueDate: '', returnDate: '' }]);

  useEffect(() => {
    
  }, []);

  useEffect(() => {
    // Fetch user details
    axios.get(`https://localhost:3000/users/${id}`)
      .then(response => {
        setUser(response.data);
        setBooks(response.data.books.length ? response.data.books : [{ title: '', issueDate: '', returnDate: '' }]);
      })
      .catch(error => console.error("Error fetching user:", error));
  }, [id]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newBooks = [...books];
    newBooks[index][name] = value;
    setBooks(newBooks);
  };

  const handleAddBook = () => {
    setBooks([...books, { title: '', issueDate: '', returnDate: '' }]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.patch(`https://localhost:3000/users/${id}/books`, { books })
      .then(response => {
        alert("Books updated successfully");
        navigate('/admin/dashboard/manage'); // Navigate after alert
      })
      .catch(error => console.error("Error updating books:", error));
  };

  return (
    <div className="container">
      <h2>Update Books for {user.name} ({user.rollNo})</h2>
      <form onSubmit={handleSubmit}>
        <table className="table">
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Issue Date</th>
              <th>Return Date</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={book.title}
                    onChange={(event) => handleInputChange(index, event)}
                    required
                  />
                </td>
                <td>
                  <input
                    type="date"
                    className="form-control"
                    name="issueDate"
                    value={book.issueDate}
                    onChange={(event) => handleInputChange(index, event)}
                    required
                  />
                </td>
                <td>
                  <input
                    type="date"
                    className="form-control"
                    name="returnDate"
                    value={book.returnDate}
                    onChange={(event) => handleInputChange(index, event)}
                    required
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="btn btn-secondary" onClick={handleAddBook}>Add Book</button>
        <button type="submit" className="btn btn-primary">Update Books</button>
        <Link to={'/admin/dashboard/manage'} className="btn btn-link">Back to Manage</Link>
      </form>
    </div>
  );
};

export default UpdateUserBooks;
