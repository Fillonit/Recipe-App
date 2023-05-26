import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegistration() {
    try {
      const response = await fetch('http://localhost:5000/api/user', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      const data = await response.json();

      // Do something with the response data, e.g. show a success message
      alert(`Here is the user data: ${JSON.stringify(data)}`)
    } catch (error) {
      console.error(error);

      // Show an error message to the user
    }
  }

  async function handleLogin() {
    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      if (response.status !== 200) return;
      const data = await response.json();
      const { accUsername, role, auth } = data;
      localStorage.setItem('token', auth);
      localStorage.setItem('username', accUsername);
      localStorage.setItem('role', role);
      alert("Token set: " + localStorage.getItem('token'));

      // Do something with the response data, e.g. show a success message
      alert(`Here is the user data: ${JSON.stringify(data)}`)
    } catch (error) {
      console.error(error);

      // Show an error message to the user
    }
  }

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  return (
    <div className={"mt-32 flex justify-center items-center"}>
      <div className={"flex flex-col"}>
        <div className={"flex flex-col items-center"}>
          <h1 className={"text-4xl font-bold"}>Register</h1>
          <input
            className={"border-2 border-gray-400 rounded-lg p-2 m-2"}
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
          <input
            className={"border-2 border-gray-400 rounded-lg p-2 m-2"}
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <button
            className={"border-2 border-gray-400 rounded-lg p-2 m-2"}
            onClick={handleRegistration}
          >
            Register
          </button>

          <h1 className={"text-4xl font-bold"}>Login</h1>
          <input
            className={"border-2 border-gray-400 rounded-lg p-2 m-2"}
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
          <input
            className={"border-2 border-gray-400 rounded-lg p-2 m-2"}
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <button
            className={"border-2 border-gray-400 rounded-lg p-2 m-2"}
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>

  );
}
