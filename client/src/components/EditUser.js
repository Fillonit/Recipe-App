import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notifyConfig from "./notifyConfig";

const EditUser = () => {
  const image = useRef();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    description: "",
    profilePicture: ""
  });
  async function setComponents() {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${localStorage.getItem('userId')}`, {
        method: "GET",
        headers: {
          'R-A-Token': localStorage.getItem('token')
        }
      });
      if (response.status !== 200) return;
      const json = await response.json();

      setFormData({
        username: json.response.Username,
        name: json.response.Name,
        email: json.response.Email,
        password: "",
        description: json.response.Description,
      });
    } catch (error) {
      console.log(error);
      toast.error("Error occured while fetching user data", notifyConfig);
    }
  }
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('username', formData.username);
      form.append('name', formData.name);
      form.append('email', formData.email);
      form.append('password', formData.password);
      form.append('description', formData.description);
      form.append('image', image.current.files[0]);
      const response = await fetch(`http://localhost:5000/api/user`, {
        method: "PUT",
        headers: {
          'R-A-Token': localStorage.getItem('token')
        },
        body: form
      });
      if (response.status !== 200) return;
      // alert("successfullly updated");
      toast.success("Successfully updated", notifyConfig);
    } catch (error) {
      console.log(error);
      toast.error("Error occured while updating user data", notifyConfig);
    }
  };
  useEffect(() => {
    setComponents();
  }, [])
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-24">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg">
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
            Edit Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-2">
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
            <label className="block text-xs font-lighter mb-1 float-right text-gray-400">
              <a href="/me/password">Change Password? <FontAwesomeIcon icon={faLock} className={'text-indigo-500 text-xs'} /></a>
            </label>
            <div>
              <label className="block text-lg font-semibold mb-1 mt-4" htmlFor="description">
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
                ref={image}
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
      <ToastContainer />
    </div>
  );
};

export default EditUser;
