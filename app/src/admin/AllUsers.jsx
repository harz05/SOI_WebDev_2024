import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Collapse,
  IconButton,
  TextField
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('https://localhost:3000/all-users')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleDeleteUser = (id) => {
    fetch(`https://localhost:3000/users/${id}`, {
      method: "DELETE",
    }).then(res => res.json()).then(data => {
      alert("User deleted successfully");
      setUsers(users.filter(user => user._id !== id));
    }).catch(error => console.error(error));
  };

  const handleDeleteBook = (userId, bookId) => {
    fetch(`https://localhost:3000/users/${userId}/books/${bookId}`, {
      method: "DELETE",
    }).then(res => res.json()).then(data => {
      alert("Book deleted successfully");
      setUsers(users.map(user => {
        if (user._id === userId) {
          return { ...user, books: user.books.filter(book => book._id !== bookId) };
        }
        return user;
      }));
    }).catch(error => console.error(error));
  };

  const isBookActive = (book) => {
    const returnDate = new Date(book.returnDate);
    const today = new Date();
    return returnDate >= today;
  };

  const toggleExpandUser = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        All Users
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search by Roll Number"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Roll Number</TableCell>
              <TableCell>Books</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map(user => (
              <React.Fragment key={user._id}>
                <TableRow>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.rollNo}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => toggleExpandUser(user._id)}>
                      {user.books.filter(isBookActive).length} {expandedUserId === user._id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Link to={`/admin/dashboard/users/${user._id}`}>
                      <Button variant="contained" color="primary" sx={{ mr: 1 }}>
                        Issue books
                      </Button>
                    </Link>
                    <Button variant="contained" color="error" onClick={() => handleDeleteUser(user._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Collapse in={expandedUserId === user._id} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Borrowed Books
                        </Typography>
                        <Table size="small" aria-label="borrowed books">
                          <TableHead>
                            <TableRow>
                              <TableCell>Title</TableCell>
                              <TableCell>Return Date</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {user.books.filter(isBookActive).map(book => (
                              <TableRow key={book._id}>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{new Date(book.returnDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <Button variant="contained" color="error" onClick={() => handleDeleteBook(user._id, book._id)}>
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AllUsers;
