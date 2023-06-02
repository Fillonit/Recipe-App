import { useState, useEffect } from "react";
import DashboardSidebar from "./DashboardSidebar";
import ChefApplication from "./ChefApplication";
export default function DashboardChefApplications() {
    const [applications, setApplications] = useState([]);
    async function setComponents() {
        try {
            const response = await fetch(`http://localhost:5000/api/chefApplications`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                    'page': 1,
                    'pageSize': 5
                }
            })
            if (response.status !== 200) return;
            const json = await response.json();
            setApplications(json.response);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        setComponents();
    }, []);
    return (
        <div className="flex h-screen">
            <DashboardSidebar />
            <div className="w-5/6 bg-indigo-200 h-full overflow-y-auto pl-10 pr-10 flex flex-col items-center">
                {applications.map((item, index) => {
                    return <ChefApplication chef={item} setApplications={setApplications} index={index} />
                })}
            </div>
        </div>
    );
}