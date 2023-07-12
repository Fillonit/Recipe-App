import DashboardSidebar from "./DashboardSidebar";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEdit, faTrash, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import {
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Legend,
    Bar,
    PieChart, Cell, Pie,
    Label
} from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notifyConfig from "./notifyConfig";
export default function UsersDashboard() {
    const [users, setUsers] = useState([]);
    const [data, setData] = useState([]);
    const [radialData, setRadialData] = useState([]);
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
            // alert("Could not delete user: " + usersResponse.status);
            toast.error(`Could not delete user: ${usersResponse.status}`, notifyConfig);
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
        if (usersResponse.status !== 200) return toast.error(`An error has occured!`, notifyConfig);
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
                userData.unshift({ name: row.DaysAgo, value: row.Users });
            console.log(chartData.response[0]);
            const usersJson = await usersResponse.json();
            if (usersResponse.status === 200 && usersJson.response !== undefined) setUsers(usersJson.response);
            setData(userData);
            setRadialData([{
                name: 'chefs', value: chartData.response[1][1].Count
            },
            { name: 'users', value: chartData.response[1][2].Count },
            { name: 'admins', value: chartData.response[1][0].Count }])
        } catch (err) {
            console.log(err);
            toast.error(`An error has occured!`, notifyConfig);
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
            if (response.status !== 200) return toast.error(`An error has occured!`, notifyConfig);
            const users = await response.json();
            setUsers(users.response);
            setSearchString(currentSearchString.current.value);
            setLastPage(1);
        } catch (error) {
            console.log(error);
            toast.error(`An error has occured!`, notifyConfig);
        }
    }
    const colorRange = ['#FF7F0E', '#1F77B4', '#93C572']
    useEffect(() => {
        setComponents();
    }, []);
    return (
        <div className="flex h-screen">
            <DashboardSidebar />
            <div className="mx-4 w-5/6 flex flex-col justify-start items-center">
                <div style={{ height: "350px" }} className="bg-slate-800 rounded-2xl w-11/12 flex justify-evenly items-center mt-4 shadow-lg">
                    {data.length !== 0 && (
                        <>
                            <div className="w-2/3 flex justify-center items-center">
                                <BarChart width={600} height={300} data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" stroke="#fff">
                                        <Label value="Days(s) ago" position="insideBottomRight" offset={-1} />
                                    </XAxis>
                                    <YAxis stroke="#fff">
                                        <Label value="Users created" position="insideLeft" angle={-90} />
                                    </YAxis>
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </div>
                            <div className="1/3 flex justify-center mb-6 items-center">
                                <PieChart width={400} height={380}>
                                    <Pie
                                        data={radialData}
                                        cx={200}
                                        cy={200}
                                        outerRadius={130}
                                        fill="#8884d8"
                                        label
                                    >
                                        {radialData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colorRange[index % colorRange.length]} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </div>
                        </>
                    )}</div>
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
                                <tr key={user.UserId} className="border-b hover:bg-gray-500">
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
                <ToastContainer />
            </div>
            <script
                type="text/javascript"
                src="../node_modules/tw-elements/dist/js/tw-elements.umd.min.js"></script>
        </div>
    );
}