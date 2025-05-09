import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './IssuedBooks.css';

const IssuedBooks = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.email) {
        try {
          const response = await axios.get(`https://localhost:3000/all-users/${storedUser.email}`);
          setIssuedBooks(response.data.books);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchBooks();
  }, []);

  const calculateDaysToGo = (issueDate) => {
    const issueDateObj = new Date(issueDate);
    const oneMonthLater = new Date(issueDateObj);
    oneMonthLater.setMonth(issueDateObj.getMonth() + 1);
    const today = new Date();
    const timeDiff = oneMonthLater - today;
    const daysToGo = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysToGo;
  };

  return (
    <div className="issued-books">
      <h2>My Issued Books List</h2>
      <table className="issued-books-table">
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Issued Date</th>
            <th>Date Due</th>
            <th>Days To Go</th>
            <th>Instruction</th>
          </tr>
        </thead>
        <tbody>
          {issuedBooks.map((book, index) => (
            <tr key={index}>
              <td>{book.title}</td>
              <td>{new Date(book.issueDate).toLocaleDateString()}</td>
              <td>{new Date(book.returnDate).toLocaleDateString()}</td>
              <td>{calculateDaysToGo(book.issueDate)}</td>
              <td colSpan="6" style={{ textAlign: 'center', fontStyle: 'italic', color: 'green' }}>
                {/* Display Status or any other information */}
                pl return book on time
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssuedBooks;
