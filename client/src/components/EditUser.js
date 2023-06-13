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
    console.log(formData);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-28 pb-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg">
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Edit Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-1" htmlFor="username">
                Username
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-indigo-500 placeholder-gray-400 text-gray-800"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-1" htmlFor="name">
                Name
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-indigo-500 placeholder-gray-400 text-gray-800"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-1" htmlFor="email">
                Email
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-indigo-500 placeholder-gray-400 text-gray-800"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-1" htmlFor="password">
                Password
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-indigo-500 placeholder-gray-400 text-gray-800"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 text-gray-800"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter a description"
                rows="4"
              ></textarea>
            </div>
            <div>
              <label className="block text-lg font-semibold mb-1" htmlFor="profilePicture">
                Profile Picture
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-indigo-500 placeholder-gray-400 text-gray-800"
                type="file"
                name="profilePicture"
                onChange={handleChange}
                accept="image/*"
                required
              />
            </div>
            <div>
              <button
                className="w-full bg-indigo-500 text-white py-3 px-8 rounded-full hover:bg-indigo-600 transition-colors duration-150 focus:outline-none"
                type="submit"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
