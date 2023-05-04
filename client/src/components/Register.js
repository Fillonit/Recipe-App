// import { json } from "express";
// import { useRef } from "react";
// export default function LogIn() {
//     const username = useRef();
//     const password = useRef();
//     async function add() {
//         const response = await fetch(`http://localhost:5000/user`, {
//             method: "POST",
//             headers: {
//                 'Content-type': 'application/json'
//             },
//             body: JSON.stringify({
//                 username: username.current.value,
//                 password: password.current.value
//             })
//         });

//     }
//     return (
//         <div>
//             <input ref={username} type="text" placeholder="username" value={"user"} />
//             <input ref={password} type="text" placeholder="password" value={"password"} />
//             <button onClick={add}>REGISTER</button>
//         </div>
//     )
// }

import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegistration() {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
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
      const response = await fetch('http://localhost:5000/api/users', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

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
      <input type="text" placeholder="Username" value={username} onChange={handleUsernameChange} />
      <input type="text" placeholder="Password" value={password} onChange={handlePasswordChange} />
      <button onClick={handleRegistration}>Register</button>
      <button onClick={handleLogin}>LOG IN</button>
    </div>
  );
}
