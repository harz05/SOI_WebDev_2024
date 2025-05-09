import { Button } from 'flowbite-react';
import React, { useState } from 'react';

const Upload = () => {
  const bookDepartments = [
    "Computer Science",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Engineering Physics"
  ];
  const [selectedBookDepartment, setSelectedBookDepartment] = useState('');

  const handleChange = (event) => {
    setSelectedBookDepartment(event.target.value);
  };

  const handleBookSubmit = (event)=>{
    // clg
    event.preventDefault()
    const form = event.target

    const title=form.title.value
    const description=form.description.value
    const author=form.author.value
    const genre=form.genre.value
    const department=form.department.value
    const count=form.count.value
    const vendor=form.vendor.value
    const vendor_id=form.vendor_id.value
    const publisher=form.publisher.value
    const publisher_id=form.publisher_id.value

    const bookObj = {
      title,description,author,genre,department,count,vendor,vendor_id,publisher,publisher_id
    }
    //console.log(bookObj)
    fetch("https://localhost:3000/upload-book", { 
      method: "POST",
      headers:{
        "Content-type": "application/json"
      },
      body: JSON.stringify(bookObj)
    }).then(res => res.json()).then(data =>{
      console.log(data)
      alert("book has been uploaded")
    })
  }
  return (
    <div className="px-4 my-12">
      <h2 className="mb-8 text-3xl font-bold text-center">Upload Book</h2>
      <form onSubmit={handleBookSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* 1st row */}
        <div className='flex gap-8'>
          {/* Title input */}
          <div className="mb-4 lg:w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Book Title
            </label>
            <input
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              name='title'
              type="text"
              required
              placeholder="Book Name"
            />
          </div>
          {/* Author input */}
          <div className="mb-4 lg:w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
              Book Author
            </label>
            <input
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              id="author"
              name='author'
              type="text"
              required
              placeholder="Author name"
            />
          </div>
        </div>
        {/* 2nd row */}
        <div className='flex gap-8'>
          {/* Genre input */}
          <div className="mb-4 lg:w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genre">
              Book Genre
            </label>
            <input
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              id="genre"
              name='genre'
              type="text"
              required
              placeholder="Genre"
            />
          </div>
          {/* Department input */}
          <div className="mb-4 lg:w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="inputState">
              Book Category
            </label>
            <div className="relative">
              <select
                id='inputState'
                name='department'
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                value={selectedBookDepartment}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select a department</option>
                {
                  bookDepartments.map((option) => <option key={option} value={option}>{option}</option>)
                }
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.516 7.548l2.58-2.578a1 1 0 011.415 1.415l-3.589 3.588a1 1 0 01-1.415 0L.931 6.386a1 1 0 111.415-1.415l2.579 2.578z"/></svg>
              </div>
            </div>
          </div>
        </div>
        {/* 3rd row */}
        <div className='flex gap-8'>
          {/* Publisher input */}
          <div className="mb-4 lg:w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publisher">
              Book Publisher
            </label>
            <input
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              id="publisher"
              name='publisher'
              type="text"
              required
              placeholder="Publisher name"
            />
          </div>
          {/* Publisher ID input */}
          <div className="mb-4 lg:w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publisher_id">
              Book Publisher ID
            </label>
            <input
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              id="publisher_id"
              name='publisher_id'
              type="tel"
              required
              placeholder="Publisher ID"
            />
          </div>
        </div>
        {/* 4th row */}
        <div className='flex gap-8'>
          {/* Vendor input */}
          <div className="mb-4 lg:w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vendor">
              Book Vendor name
            </label>
            <input
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              id="vendor"
              name='vendor'
              type="text"
              required
              placeholder="Vendor name"
            />
          </div>
          {/* Vendor ID input */}
          <div className="mb-4 lg:w-2/5">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vendor_id">
              Vendor ID
            </label>
            <input
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              id="vendor_id"
              name='vendor_id'
              type="tel"
              required
              placeholder="Vendor ID"
            />
          </div>
          {/* Book count input */}
          <div className="mb-4 lg:w-1/10">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="count">
              Book Count
            </label>
            <input
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              id="count"
              name='count'
              type="tel"
              required
              placeholder="Number of books"
            />
          </div>
        </div>
        {/* 5th row */}
        <div className='flex gap-8'>
          {/* Book description textarea */}
          <div className="mb-4 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Book Description
            </label>
            <textarea
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name='description'
              required
              placeholder="Book Description"
              rows="5"
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
           >
             Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
