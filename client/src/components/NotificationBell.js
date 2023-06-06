import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCircle } from '@fortawesome/free-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
library.add(faLayerGroup);
export default function NotificationBell() {
    const [notificationCount, setNotificationCount] = useState(undefined);
    console.log(notificationCount);
    async function setComponents() {
        try {
            const response = await fetch('http://localhost:5000/api/notifications/count', {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token')
                }
            });
            const json = await response.json();
            if (json.response !== undefined)
                setNotificationCount(json.response[0].NotificationCount);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        setComponents();
    })
    return (
        <div className="cursor-pointer relative">
            <FontAwesomeIcon className='cursor-pointer' icon={faBell} size="lg" />
            {notificationCount !== undefined && NotificationBell != 0 &&
                <div style={{ transform: "translate(70%, -150%)", border: "1px solid #3949AB" }} className="h-4 w-4 bg-red-600 absolute flex justify-center items-center rounded-full">
                    <p className='text-sm text-white'>{notificationCount}</p>
                </div>}
        </div>
    );
}

