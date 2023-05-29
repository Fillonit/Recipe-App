import { useState } from "react";
import Icon from '../images/icon.png';
import { useRef } from "react";

export default function Register({ setLogIn }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const email = useRef(), image = useRef(), fullName = useRef(), description = useRef();
    async function handleRegistration() {
        try {
            const form = new FormData();
            form.append('username', username);
            form.append('password', password);
            form.append('email', email.current.value);
            form.append('fullName', fullName.current.value);
            form.append('description', description.current.value);
            form.append('image', image.current.files[0]);
            const response = await fetch('http://localhost:5000/api/user', {
                method: "POST",
                body: form
            });
            if (response.status !== 201) return;
            alert("Registered account successfully!");
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
        <div className="flex justify-center items-center h-screen w-full bg-indigo-700">
            <div className="w-1/2 mt-16 bg-indigo-100 rounded p-5">
                <header>
                    <img className="w-20 mx-auto mb-5" src={Icon} alt={'logo'} />
                </header>
                <div className="flex w-full">
                    <div className="w-1/2 p-3">
                        <div>
                            <label className="block mb-2 text-indigo-500">Username</label>
                            <input className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-indigo-200" type="text" name="username" id={'username'} onChange={handleUsernameChange} autoComplete={'off'} />
                        </div>
                        <div>
                            <label className="block mb-2 text-indigo-500">Password</label>
                            <input className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-indigo-200" type="password" name="password" id={'password'} onChange={handlePasswordChange} />
                        </div>
                        <div>
                            <label className="block mb-2 text-indigo-500">Email</label>
                            <input
                                ref={email}
                                className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-indigo-200 max-w-xl max-h-20"
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="w-1/2 p-3">
                        <div>
                            <label className="block mb-2 text-indigo-500">Description</label>
                            <textarea ref={description} className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-indigo-200" type="text" />
                        </div>
                        <div>
                            <label className="block mb-2 text-indigo-500">Full name</label>
                            <input ref={fullName} className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-indigo-200" type="text" />
                        </div>
                        <div>
                            <label className="block mb-2 text-indigo-500">Profile picture</label>
                            <input ref={image} className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-indigo-200" type="file" accept="image/*" name="image" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button className="w-25 bg-indigo-700 hover:bg-indigo-900 text-white font-bold py-2 px-4 mb-6 rounded" onClick={handleRegistration}>Register</button>
                </div>
                <footer>
                    <button className="text-indigo-700 hover:text-indigo-900 text-sm float-right" onClick={() => { setLogIn(true) }}>Already have an account? Log in!</button>
                </footer>
            </div>
        </div>
    );
}
