import React, { useEffect, useState } from 'react';
import { Card } from "flowbite-react";

const AllBooks = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('All');

    useEffect(() => {
        fetch("https://localhost:3000/all-books")
            .then(res => res.json())
            .then(data => {
                setBooks(data);
                setFilteredBooks(data);
                const uniqueDepartments = ['All', ...new Set(data.map(book => book.department))];
                setDepartments(uniqueDepartments);
            });
    }, []);

    const filterByDepartment = (department) => {
        setSelectedDepartment(department);
        if (department === 'All') {
            setFilteredBooks(books);
        } else {
            setFilteredBooks(books.filter(book => book.department === department));
        }
    };

    return (
        <div className="mt-28 px-4 lg:px-24">
            <h2 className="text-5xl font-bold text-center">iit dharwad collections</h2>
            <div className="flex flex-wrap justify-center gap-4 my-4 w-full">
                {departments.map((department, index) => (
                    <button
                        key={index}
                        onClick={() => filterByDepartment(department)}
                        className={`px-4 py-2 rounded ${selectedDepartment === department ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        {department}
                    </button>
                ))}
            </div>
            <div className='w-full grid gap-6 my-12 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1'>
                {filteredBooks.map(book => (
                    <Card
                        className="max-w-sm flex flex-col justify-between"
                        imgAlt="Meaningful alt text for an image that is not purely decorative"
                        imgSrc="https://s26162.pcdn.co/wp-content/uploads/2019/11/A1NfEjobJnL-691x1024.jpg"
                        key={book._id} // Ensure each item has a unique key
                    >
                        <div>
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {book.title}
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                {book.description}
                            </p>
                        </div>
                        
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AllBooks;
