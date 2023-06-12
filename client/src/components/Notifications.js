import { useState, useEffect } from "react";
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
                    'rows': 5
                }
            });
            if (response.status !== 200 && response.status !== 304) return;
            const json = await response.json();
            setNotifs(prev => [...prev, ...json.response]);
            setNextPage(prev => prev + 1);
        } catch (error) {
            console.log(error)
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
        </div>
    );
}