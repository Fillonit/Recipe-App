import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notifyConfig from "./notifyConfig";
import Notification from "./Notification";
export default function Notifications() {
    const [notifs, setNotifs] = useState([]);
    const [nextPage, setNextPage] = useState(2);

    // eslint-disable-next-line no-unused-vars
    async function seeMore() {
        try {
            const response = await fetch(`http://localhost:5000/api/notifications`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                    'page': nextPage,
                    'rows': 8
                }
            });
            if (response.status !== 200 && response.status !== 304) return;
            const json = await response.json();
            setNotifs(prev => [...prev, ...json.response]);
            setNextPage(prev => prev + 1);
        } catch (error) {
            console.log(error)
            toast.error('Failed to get notifications!', notifyConfig);
        }
    }

    async function setComponents() {
        try {
            const response = await fetch(`http://localhost:5000/api/notifications`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                    'page': 1,
                    'rows': 5
                }
            });
            if (response.status !== 200 && response.status !== 304) return;
            const json = await response.json();
            setNotifs(json.response);
        } catch (error) {
            console.log(error)
            toast.error('Failed to get notifications!', notifyConfig);
        }
    }
    async function seeMore() {
        try {
            const response = await fetch(`http://localhost:5000/api/notifications`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                    'page': nextPage,
                    'rows': 8
                }
            });
            if (response.status !== 200 && response.status !== 304) return;
            const json = await response.json();
            setNotifs(prev => [...prev, ...json.response]);
            setNextPage(prev => prev + 1)
        } catch (error) {
            console.log(error)
            toast.error('Failed to get notifications!', notifyConfig);
        }
    }
    useEffect(() => {
        setComponents();
    }, []);
    return (
        <div className="min-h-screen  w-full bg-indigo-200">
            <div className="h-full w-full flex flex-col items-center mt-40">
                {notifs.map((item, index) => {
                    return <Notification notification={item} setNotifications={setNotifs} index={index} />
                })}
            </div>
            <div className='w-full h-24 flex justify-center items-center'>
                <h2 onClick={seeMore} className={'hover:cursor-pointer text-xl border-indigo-300 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 uppercase'}>See more?</h2>
            </div>
            <ToastContainer />
        </div >
    );
}