import React from 'react';

const Chef = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('u dorzua');
  
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-2/3 border border-gray-300 rounded p-8 bg-indigo-100">
        <form onSubmit={handleSubmit}>
            <h1 className="w-2/3 text-indigo-400 mb-4">Chef Application</h1>
          <textarea className="w-full p-4 border border-gray-300 rounded mb-4" placeholder="Describe yourself here..." name="description"></textarea>
          <input className="w-full p-4 border border-gray-300 rounded mb-4" type="number" placeholder="Number" name="number" />
          <input className="w-full p-4 border border-gray-300 rounded mb-4" type="text" placeholder="Text" name="text" />
          <input className="w-full p-4 border bg-white border-gray-300 rounded mb-4" type="file" placeholder="File" name="file" />
          <button className="w-full p-4 bg-indigo-500 text-white rounded hover:bg-indigo-600" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Chef;