import React, { useState } from "react";

const EditUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    description: "",
    profilePicture: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission and update user data
    console.log(formData);
    // Reset form fields
    setFormData({
      username: "",
      name: "",
      email: "",
      password: "",
      description: "",
      profilePicture: ""
    });
  };

  return (
    <div className="container mx-auto p-4 mt-24">
      <h2 className="text-3xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-indigo-500 rounded-full"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-indigo-500 rounded-full"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-indigo-500 rounded-full"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-indigo-500 rounded-full"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-indigo-500 rounded-xl"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2" htmlFor="profilePicture">
            Profile Picture
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-indigo-500 rounded-full"
            type="file"
            name="profilePicture"
            onChange={handleChange}
          />
        </div>
        <button
          className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors duration-150 focus:outline-none"
          type="submit"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditUser;
