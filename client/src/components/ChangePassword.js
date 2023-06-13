import React, { useState } from "react";

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(passwords);
    setPasswords({
      currentPassword: "",
      newPassword: ""
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg">
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Change Password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-1" htmlFor="currentPassword">
                Current Password
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-indigo-500 placeholder-gray-400 text-gray-800"
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-1" htmlFor="newPassword">
                New Password
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-indigo-500 placeholder-gray-400 text-gray-800"
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                required
              />
            </div>
            <div>
              <button
                className="w-full bg-indigo-500 text-white py-3 px-8 rounded-full hover:bg-indigo-600 transition-colors duration-150 focus:outline-none"
                type="submit"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
