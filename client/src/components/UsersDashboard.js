import DashboardSidebar from "./DashboardSidebar";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faEdit, faTrash, faChartPie, faChartBar, faArrowUp, faArrowDown, faCommentAlt, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import { XYPlot, VerticalBarSeries, XAxis, YAxis, RadialChart } from 'react-vis';
import 'react-vis/dist/style.css';
import {
    Chart,
    initTE,
} from "tw-elements";

initTE({ Chart });
export default function UsersDashboard() {
    const [users, setUsers] = useState([]);
    const [data, setData] = useState([]);
    const [radialData, setRadialData] = useState({});
    const [lastPage, setLastPage] = useState(1);
    const currentSearchString = useRef();
    const [searchString, setSearchString] = useState('');
    const page = useRef();

    async function deleteUser(id) {
        const usersResponse = await fetch(`http://localhost:5000/api/admin/user/${id}`, {
            method: "DELETE",
            headers: {
                'R-A-Token': localStorage.getItem('token'),
            },
        });
        if (usersResponse.status !== 204) {
            alert("Could not delete user: " + usersResponse.status);
            return;
        }
        changePage(lastPage);
    }
    async function changePage(page) {
        const usersResponse = await fetch(`http://localhost:5000/api/user/all`, {
            method: "GET",
            headers: {
                'R-A-Token': localStorage.getItem('token'),
                'page': page,
                'query': searchString,
                'rows': 4
            }
        });
        if (usersResponse.status !== 200) return;
        const json = await usersResponse.json();
        setLastPage(page);
        setUsers(json.response);
    }
    async function setComponents() {
        try {
            const usersResponse = await fetch(`http://localhost:5000/api/user/all`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                    'page': 1,
                    'query': '',
                    'rows': 4
                }
            })
            const chartResponse = await fetch(`http://localhost:5000/api/admin/userChart`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token')
                }
            });
            const chartData = await chartResponse.json();
            const userData = [];
            for (const row of chartData.response[0])
                userData.unshift({ x: row.DaysAgo, y: row.Users });
            console.log(chartData.response[0]);
            const usersJson = await usersResponse.json();
            if (usersResponse.status === 200 && usersJson.response !== undefined) setUsers(usersJson.response);
            setData(userData);
            setRadialData({
                'chefs': chartData.response[1][1].Count,
                'users': chartData.response[1][2].Count,
                'admins': chartData.response[1][0].Count
            })
        } catch (err) {
            console.log(err);
        }
    }
    async function searchUsers() {
        try {
            const response = await fetch('http://localhost:5000/api/user/all', {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                    page: 1,
                    query: currentSearchString.current.value,
                    'rows': 4
                }
            });
            if (response.status !== 200) return;
            const users = await response.json();
            setUsers(users.response);
            setSearchString(currentSearchString.current.value);
            setLastPage(1);
        } catch (error) {
            console.log(error);
        }
    }
    const colorRange = ['#FF7F0E', '#1F77B4', '#93C572']
    const chefPercentage = (radialData.chefs / (radialData.chefs + radialData.users + radialData.admins)) * 100;
    const adminPercentage = (radialData.admins / (radialData.chefs + radialData.users + radialData.admins)) * 100;
    const userPercentage = (radialData.users / (radialData.chefs + radialData.users + radialData.admins)) * 100;
    const angles = [
        { angle: chefPercentage, label: `Chefs(${Math.round(chefPercentage)}%)` },
        { angle: adminPercentage, label: `Admins(${Math.round(adminPercentage)}%)` },
        { angle: userPercentage, label: `Users(${Math.round(userPercentage)}%)` },
    ];

    useEffect(() => {
        setComponents();
    }, []);
    return (
        <div className="flex h-screen">
            <DashboardSidebar />
            <div className="mx-4 w-5/6 flex flex-col justify-start items-center">
                {data.length !== 0 &&
                    <div className="h-96 w-5/6 flex justify-evenly items-center mt-11 shadow-lg">
                        <XYPlot width={600} height={350} xType="ordinal">
                            <XAxis />
                            <YAxis />
                            <VerticalBarSeries data={data} />
                        </XYPlot>
                        <RadialChart
                            width={400}
                            height={300}
                            data={angles}
                            colorRange={colorRange}
                            labelsRadiusMultiplier={0.8}
                            labelsStyle={{
                                fontSize: 13,
                                fontWeight: 600,
                                fill: '#000000',
                            }}
                            showLabels
                        />
                    </div>}
                <div className="w-full  flex justify-evenly items-center h-20" >
                    <h2 className="text-4xl ml-24 font-bold text-gray-800">User List</h2>
                    <div className="h-16 ml-72 flex items-center">
                        <div id={'Search1'}>
                            <input type='text' placeholder='Username' ref={currentSearchString} className={'p-2 mx-2 border-2 border-gray-500 focus:outline-none focus:border-indigo-500 font-bold'} />
                            <button onClick={searchUsers} className={'text-white bg-gray-800 p-2 border-2 border-gray-800 hover:bg-indigo-500 hover:border-indigo-500'}><FontAwesomeIcon icon={faFilter} className={'px-2'} /></button>
                        </div>
                        <div id={'Search1'}>
                            <input
                                type="number"
                                placeholder="Page"
                                ref={page}
                                className="p-2 m-2 border-2 border-gray-500 focus:outline-none focus:border-indigo-500 w-16 font-bold text-center"
                                defaultValue={1}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                    e.target.value = value;
                                }}
                                style={{ '-moz-appearance': 'textfield', 'appearance': 'textfield' }}
                            />
                        </div>
                        <button onClick={() => { changePage(page.current.value) }} className={'text-white bg-gray-800 p-2 border-2 border-gray-800 hover:bg-indigo-500 hover:border-indigo-500'}><FontAwesomeIcon icon={faSearch} className={'px-2'} /></button>
                    </div>
                </div>
                <div className="h-auto w-5/6 mx-6">
                    <table className="w-full bg-white rounded-lg shadow-md">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-4 px-6 text-left">ID</th>
                                <th className="py-4 px-6 text-left">Name</th>
                                <th className="py-4 px-6 text-left">Email</th>
                                <th className="py-4 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.UserId} className="border-b hover:bg-gray-900">
                                    <td className="py-4 px-6 group-hover:bg-slate-100">{user.UserId}</td>
                                    <td className="py-4 px-6 group-hover:bg-slate-100" >{user.Username}</td>
                                    <td className="py-4 px-6 group-hover:bg-slate-100" >{user.Email == null ? "User doesnt have email." : user.Email}</td>
                                    <td className="py-4 px-6  group-hover:bg-slate-100 text-center">
                                        <button className="mr-2 text-blue-500 hover:text-blue-700">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button onClick={() => {
                                            deleteUser(user.UserId);
                                        }} className="text-red-500 hover:text-red-700">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <script
                type="text/javascript"
                src="../node_modules/tw-elements/dist/js/tw-elements.umd.min.js"></script>
        </div>
    );
}