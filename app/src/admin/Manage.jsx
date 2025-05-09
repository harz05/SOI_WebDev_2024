import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlus, FaMinus } from 'react-icons/fa';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Paper
} from '@mui/material';

const Manage = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  useEffect(() => {
    axios.get('https://localhost:3000/all-books')
      .then(response => {
        console.log('Fetched Books:', response.data);
        setBooks(response.data);
      })
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  const handleDelete = (id) => {
    fetch(`https://localhost:3000/book/${id}`, {
      method: "DELETE",
    }).then(res => res.json()).then(data => {
      alert("Book deleted successfully");
      setBooks(books.filter(book => book._id !== id));
    }).catch(error => console.error('Error deleting book:', error));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleIncrement = (id) => {
    axios.patch(`https://localhost:3000/book/${id}/increment`)
      .then(response => {
        setBooks(books.map(book => 
          book._id === id ? { ...book, count: book.count + 1 } : book
        ));
      })
      .catch(error => console.error('Error incrementing count:', error));
  };

  const handleDecrement = (id) => {
    axios.patch(`https://localhost:3000/book/${id}/decrement`)
      .then(response => {
        setBooks(books.map(book => 
          book._id === id ? { ...book, count: book.count - 1 } : book
        ));
      })
      .catch(error => console.error('Error decrementing count:', error));
  };

  const departments = ['All', ...new Set(books.map(book => book.department))];

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedDepartment === 'All' || book.department === selectedDepartment)
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label="Search by title..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
        />
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Department</InputLabel>
          <Select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            label="Department"
          >
            {departments.map((department, index) => (
              <MenuItem key={index} value={department}>
                {department}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="error"
          onClick={() => selectedBooks.forEach(id => handleDelete(id))}
        >
          Delete Selected
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Count</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.map(book => (
              <TableRow key={book._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedBooks.includes(book._id)}
                    onChange={() => setSelectedBooks(prevSelected => {
                      if (prevSelected.includes(book._id)) {
                        return prevSelected.filter(id => id !== book._id);
                      } else {
                        return [...prevSelected, book._id];
                      }
                    })}
                  />
                </TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.department}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {book.count}
                    <IconButton onClick={() => handleIncrement(book._id)} size="small" color="primary">
                      <FaPlus />
                    </IconButton>
                    <IconButton onClick={() => handleDecrement(book._id)} size="small" color="secondary">
                      <FaMinus />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Link to={`/admin/dashboard/edit/${book._id}`}>
                      <Button variant="contained" color="primary" sx={{ mr: 1 }}>Edit</Button>
                    </Link>
                    <Button variant="contained" color="error" onClick={() => handleDelete(book._id)}>Delete</Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>Submit</Button>
    </Container>
  );
};

export default Manage;
