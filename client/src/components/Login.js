import { useState } from "react";
import Icon from '../images/icon.png';

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
      console.log({username: username, password: password});
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      // if (response.status !== 200) return;
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
    <div className="flex h-screen bg-indigo-700">
      <div className="w-full max-w-xs m-auto bg-indigo-100 rounded p-5">   
      <header>
        <img className="w-20 mx-auto mb-5" src={Icon} alt={'logo'} />
      </header>   
        <div>
          <label className="block mb-2 text-indigo-500">Username</label>
          <input className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-indigo-200" type="text" name="username" id={'username'} onChange={handleUsernameChange} autoComplete={'off'}/>
        </div>
        <div>
          <label className="block mb-2 text-indigo-500">Password</label>
          <input className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-indigo-200" type="password" name="password" id={'password'}  onChange={handlePasswordChange}/>
        </div>
        <div>          
          <button className="w-full bg-indigo-700 hover:bg-indigo-900 text-white font-bold py-2 px-4 mb-6 rounded" onClick={handleLogin}>Login</button>
        </div>       
      <footer>
        <button className="text-indigo-700 hover:text-indigo-900 text-sm float-left">Forgot Password?</button>
        <button className="text-indigo-700 hover:text-indigo-900 text-sm float-right" onClick={handleRegistration}>Create Account</button>
      </footer>   
    </div>
</div>
  );
}
