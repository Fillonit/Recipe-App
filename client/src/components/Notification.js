import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
export default function Notification({ notification, setNotifications, index }) {
    async function markAsSeen() {
        try {
            const response = await fetch(`http://localhost:5000/api/notifications/${notification.NotificationId}`, {
                method: "PUT",
                headers: {
                    'R-A-Token': localStorage.getItem('token')
                }
            });
            if (response.status !== 200) return;
            setNotifications(prev => {
                const aux = prev.slice();
                aux[index] = { ...aux[index], Seen: true };
                return aux;
            })
        } catch (error) {
            console.log(error);
        }
    }
    async function deleteNotification() {
        try {
            const response = await fetch(`http://localhost:5000/api/notifications/${notification.NotificationId}`, {
                method: "DELETE",
                headers: {
                    'R-A-Token': localStorage.getItem('token')
                }
            });
            if (response.status !== 204) return;
            setNotifications(prev => {
                return [...prev.slice(0, index), ...prev.slice(index + 1, prev.length)];
            })
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className={`w-3/4 pl-3 h-20 rounded-lg flex justify-between items-center mt-2 ${notification.Seen === true ? "bg-gray-100" : "border-2 border-black bg-gray-100"}`}>
            <h3>{notification.Content}</h3>
            <div className="flex flex-col items-center">
                <h4 className="text-gray">{notification.TimeDifference} ago</h4>
                {!notification.Seen && (
                    <button onClick={markAsSeen} className="text-blue-500 hover:text-blue-700">
                        <FontAwesomeIcon icon={faEye} /> Mark as seen
                    </button>
                )}
                <button onClick={deleteNotification} className="text-red-500 hover:text-red-700">
                    <FontAwesomeIcon icon={faTrashAlt} /> Delete notification
                </button>
            </div>
        </div>
    );
}