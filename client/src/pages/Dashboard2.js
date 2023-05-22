import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faUtensils, faEdit, faTrash, faChartPie, faChartBar, faArrowUp, faArrowDown, faCommentAlt } from '@fortawesome/free-solid-svg-icons';
// import './Dashboard.css'

const Dashboard = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
  ];

  return (
    <div className="flex h-screen">
      <div className="w-1/6 bg-gray-900 text-white pt-3">
        <div className="p-6 pl-6">
          <h2 className="text-3xl font-bold mb-12 px-3">Magnolia</h2>
          <ul className="space-y-4">
            <li className="py-4 rounded-lg bg-gray-800">
              <a
                href="/"
                className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg py-2 px-4"
              >
                <FontAwesomeIcon icon={faHome} className="mr-4" />
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/users"
                className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg py-2 px-4"
              >
                <FontAwesomeIcon icon={faUsers} className="mr-4" />
                Users
              </a>
            </li>
            <li>
              <a
                href="/recipes"
                className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg py-2 px-4"
              >
                <FontAwesomeIcon icon={faUtensils} className="mr-4" />
                Recipes
              </a>
            </li>
          </ul>
          <div className="absolute bottom-0 py-4 px-8">
            <p className="text-xs text-gray-400">© 2023 Magnolia. All rights reserved.</p>
          </div>
        </div>
      </div>
      <div className="w-5/6 p-8 bg-gray-100">
        <h2 className="text-4xl font-bold mb-8 mx-6">Statistics</h2>
        <div className="flex flex-wrap">
        <div className="mt-4 xl:w-3/12 px-5">
        <div style={{ borderRadius: "0px" }} className="relative rounded-none flex flex-col min-w-0 break-words bg-white mb-3 xl:mb-0 shadow-lg">
            <div className="flex-auto p-4">
            <div className="flex flex-wrap">
                <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-gray-400 uppercase font-bold text-xs"> Traffic</h5>
                <span className="font-semibold text-xl text-gray-700">334,100</span>
                </div>
                <div className="relative w-auto pl-4 flex-initial">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-red-500">
                    <FontAwesomeIcon icon={faChartBar}/>

                </div>
                </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">
                <span className="text-emerald-500 mr-2"><FontAwesomeIcon icon={faArrowUp} /> 2,99% </span>
                <span className="whitespace-nowrap"> Since last month </span></p>
            </div>
        </div>
        </div>
        <div className="mt-4 xl:w-3/12 px-5">
        <div style={{ borderRadius: "0px" }} className="relative flex flex-col min-w-0 break-words bg-white mb-4 xl:mb-0 shadow-lg">
            <div className="flex-auto p-4">
            <div className="flex flex-wrap">
                <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-gray-400 uppercase font-bold text-xs">New users</h5>
                <span className="font-semibold text-xl text-gray-700">2,999</span>
                </div>
                <div className="relative w-auto pl-4 flex-initial">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-pink-500">
                    <FontAwesomeIcon icon={faChartPie}/>
                </div>
                </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">
                <span className="text-red-500 mr-2"><FontAwesomeIcon icon={faArrowDown} /> 4,01%</span>
                <span className="whitespace-nowrap"> Since last week </span></p>
            </div>
        </div>
        </div>
        <div className="mt-4 xl:w-3/12 px-5">
        <div style={{ borderRadius: "0px" }} className="relative flex flex-col min-w-0 break-words bg-white mb-6 xl:mb-0 shadow-lg">
            <div className="flex-auto p-4">
            <div className="flex flex-wrap">
                <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-gray-400 uppercase font-bold text-xs">Recipes Added</h5>
                <span className="font-semibold text-xl text-gray-700">901</span>
                </div>
                <div className="relative w-auto pl-4 flex-initial">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-blue-500">
                    <FontAwesomeIcon icon={faUtensils}/>
                </div>
                </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">
                <span className="text-red-500 mr-2"><FontAwesomeIcon icon={faArrowDown} /> 1,25% </span>
                <span className="whitespace-nowrap"> Since yesterday </span></p>
            </div>
        </div>
        </div>
        <div className="mt-4 xl:w-3/12 px-5">
        <div style={{ borderRadius: "0px" }} className="relative flex flex-col min-w-0 break-words bg-white mb-6 xl:mb-0 shadow-lg">
            <div className="flex-auto p-4">
            <div className="flex flex-wrap">
                <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-gray-400 uppercase font-bold text-xs">Performance</h5>
                <span className="font-semibold text-xl text-gray-700">51.02% </span>
                </div>
                <div className="relative w-auto pl-4 flex-initial">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-emerald-500">
                    <FontAwesomeIcon icon={faCommentAlt}/>
                </div>
                </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">
                <span className="text-emerald-500 mr-2"><FontAwesomeIcon icon={faArrowUp} /> 12%</span>
                <span className="whitespace-nowrap"> Since last mounth </span></p>
            </div>
        </div>
        </div>
        </div>

        <div className="mt-12 mx-6">
          <h2 className="text-4xl font-bold mb-12">User List</h2>
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="py-4 px-6 text-left">ID</th>
                <th className="py-4 px-6 text-left">Name</th>
                <th className="py-4 px-6 text-left">Email</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-100">
                  <td className="py-4 px-6">{user.id}</td>
                  <td className="py-4 px-6">{user.name}</td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6 text-center">
                    <button className="mr-2 text-blue-500 hover:text-blue-700">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
