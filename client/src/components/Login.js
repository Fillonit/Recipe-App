import { useState } from "react";
import Icon from '../images/icon.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notifyConfig from "./notifyConfig";

export default function Login({ setLogIn, setUserId }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  console.log(setLogIn)
  async function handleLogin() {
    const id = toast.loading("Loggin In...", {
      autoClose: 3000
    })
    try {
      console.log({ username: username, password: password });
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      const data = await response.json();
      if (response.status !== 200) return toast.error('Logged in failed!', notifyConfig);
      const { accUsername, role, auth, userId } = data;
      localStorage.setItem('token', auth);
      localStorage.setItem('username', accUsername);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      setUserId(userId);
      // alert("Token set: " + localStorage.getItem('token'));
      // toast.success('Logged in sucessfully!', notifyConfig);
      toast.update(id, { 
          render: "Logged in sucessfully!", 
          type: "success", 
          isLoading: false, 
          autoClose: 3000, 
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light" 
  });
      if (response.status !== 200) {
        toast.update(id, { 
          render: "Logged in sucessfully!", 
          type: "success", 
          isLoading: false, 
          autoClose: 3000, 
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light" 
  });
      }
    } catch (error) {
      toast.update(id, { 
          render: "Log in failed!", 
          type: "error", 
          isLoading: false, 
          autoClose: 3000, 
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light" 
  });
      console.error(error);
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
      <div className="w-full max-w-xs m-auto bg-indigo-100 rounded-xl p-5">
        <header>
          <img className="w-20 mx-auto mb-5" src={Icon} alt={'logo'} />
        </header>
        <div>
          <label className="block mb-2 text-indigo-500">Username</label>
          <input className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-indigo-200 rounded-full" type="text" name="username" id={'username'} onChange={handleUsernameChange} autoComplete={'off'} />
        </div>
        <div>
          <label className="block mb-2 text-indigo-500">Password</label>
          <input className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-indigo-200 rounded-full" type="password" name="password" id={'password'} onChange={handlePasswordChange} />
        </div>
        <div>
          <button className="w-full bg-indigo-700 hover:bg-indigo-900 text-white font-bold py-2 px-4 mb-6 rounded" onClick={handleLogin}>Login</button>
        </div>
        <footer>
          <button className="text-indigo-700 hover:text-indigo-900 text-sm float-left">Forgot Password?</button>
          <button className="text-indigo-700 hover:text-indigo-900 text-sm float-right" onClick={() => { setLogIn(false) }}>Create Account</button>
        </footer>
      </div>
      <ToastContainer />
    </div>
  );
}
