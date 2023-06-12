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
                aux[index] = { ...aux[index], Seen: 1 };
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
        <div className={(notification.Seen == 1 ? "bg-gray-100" : "border-2 border-black bg-gray-200") + " w-3/4 pl-3 h-20 rounded-lg flex justify-between items-center mt-2"}>
            <h3 >{notification.Content}</h3>
            <div className="flex flex-col items-center">
                <h4 className="text-gray">{notification.TimeDifference} ago</h4>
                {notification.Seen == 0 && <button onClick={markAsSeen}>Mark as seen</button>}
                <button onClick={deleteNotification}>Delete notification</button>
            </div>
        </div>
    );
}