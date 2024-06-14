// src/components/LatestArrivals.jsx
import React from 'react';

const LatestArrivals = () => {
  const books = [
    { title: 'Book 1', author: 'Author 1', image: 'link-to-image-1' },
    { title: 'Book 2', author: 'Author 2', image: 'link-to-image-2' },
    { title: 'Book 3', author: 'Author 3', image: 'link-to-image-3' },
  ];

  return (
    <div className="py-10 bg-white dark:bg-gray-900">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Latest Arrivals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {books.map((book, index) => (
            <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <img src={book.image} alt={book.title} className="w-full h-64 object-cover mb-4 rounded-lg" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{book.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{book.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestArrivals;
