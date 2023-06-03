import { useState } from "react";
import Login from './Login';
import Register from "./Register";
export default function LogInPage({ setUserId }) {
    const [logIn, setLogIn] = useState(true);
    return (
        <>
            {logIn === true ? <Login setUserId={setUserId} setLogIn={setLogIn} /> : <Register setLogIn={setLogIn} />}
        </>
    );
}