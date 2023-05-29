import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faUtensils, faEdit, faTrash, faChartPie, faChartBar, faArrowUp, faArrowDown, faCommentAlt, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from 'react';
// import './Dashboard.css'

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
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
      const userIncreaseResponse = await fetch(`http://localhost:5000/api/admin/stats/user`, {
        method: "GET",
        headers: {
          'R-A-Token': localStorage.getItem('token')
        }
      });
      const recipeIncreaseResponse = await fetch(`http://localhost:5000/api/admin/stats/recipe`, {
        method: "GET",
        headers: {
          'R-A-Token': localStorage.getItem('token')
        }
      });
      const trafficIncreaseResponse = await fetch(`http://localhost:5000/api/admin/stats/traffic`, {
        method: "GET",
        headers: {
          'R-A-Token': localStorage.getItem('token')
        }
      });
      const usersJson = await usersResponse.json();
      const userIncreaseJson = await userIncreaseResponse.json();
      const recipeIncreaseJson = await recipeIncreaseResponse.json();
      const trafficIncreaseJson = await trafficIncreaseResponse.json();
      const objToAssign = {};
      console.log(usersJson);
      if (userIncreaseResponse.status === 200) objToAssign['user'] = { increase: userIncreaseJson.response[0].Percentage, count: userIncreaseJson.response[0].Count };
      if (recipeIncreaseResponse.status === 200) objToAssign['recipe'] = { increase: recipeIncreaseJson.response[0].Percentage, count: recipeIncreaseJson.response[0].Count };
      if (trafficIncreaseResponse.status === 200) objToAssign['traffic'] = { increase: trafficIncreaseJson.response[0].Percentage, count: trafficIncreaseJson.response[0].Count };
      if (usersResponse.status === 200 && usersJson.response !== undefined) setUsers(usersJson.response);
      setStats(objToAssign);
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
      console.log(error)
    }
  }
  useEffect(() => {
    setComponents();
  }, []);
  const userCount = stats.user === undefined ? "Loading..." : stats.user.count;
  const userIncrease = stats.user === undefined ? "Loading..." : stats.user.increase;
  const recipeCount = stats.recipe === undefined ? "Loading..." : stats.recipe.count;
  const recipeIncrease = stats.recipe === undefined ? "Loading..." : stats.recipe.increase;
  const trafficCount = stats.traffic === undefined ? "Loading..." : stats.traffic.count;
  const trafficIncrease = stats.traffic === undefined ? "Loading..." : stats.traffic.increase;

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
                    <span className="font-semibold text-xl text-gray-700">{trafficCount}</span>
                  </div>
                  <div className="relative w-auto pl-4 flex-initial">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-red-500">
                      <FontAwesomeIcon icon={faChartBar} />

                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  <span className={`text-${trafficIncrease > 0 ? 'emerald' : 'red'}-500 mr-2`}><FontAwesomeIcon icon={trafficIncrease > 0 ? faArrowUp : faArrowDown} />{Math.abs(trafficIncrease)}</span>
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
                    <span className="font-semibold text-xl text-gray-700">{userCount}</span>
                  </div>
                  <div className="relative w-auto pl-4 flex-initial">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-pink-500">
                      <FontAwesomeIcon icon={faChartPie} />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  <span className={`text-${trafficIncrease > 0 ? 'emerald' : 'red'}-500 mr-2`}><FontAwesomeIcon icon={userIncrease > 0 ? faArrowUp : faArrowDown} />{Math.abs(userIncrease)}</span>
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
                    <span className="font-semibold text-xl text-gray-700">{recipeCount}</span>
                  </div>
                  <div className="relative w-auto pl-4 flex-initial">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-blue-500">
                      <FontAwesomeIcon icon={faUtensils} />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  <span className={`text-${trafficIncrease > 0 ? 'emerald' : 'red'}-500 mr-2`}><FontAwesomeIcon icon={recipeIncrease > 0 ? faArrowUp : faArrowDown} />{Math.abs(recipeIncrease)}</span>
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
                      <FontAwesomeIcon icon={faCommentAlt} />
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
        <div className="mt-12 mx-4 flex justify-start items-center">
          <div id={'Search1'}>
            <input type='text' placeholder='Username' ref={currentSearchString} className={'p-2 mx-2 border-2 border-gray-500 focus:outline-none focus:border-indigo-500 font-bold'} />
            <button onClick={searchUsers} className={'text-white bg-gray-800 p-2 border-2 border-gray-800 hover:bg-indigo-500 hover:border-indigo-500'}><FontAwesomeIcon icon={faFilter} className={'px-2'} /></button>
          </div>
          <div id={'Search1'}>
            <input
              type="text"
              placeholder="Page"
              ref={page}
              className="p-2 m-2 border-2 border-gray-500 focus:outline-none focus:border-indigo-500 w-16 font-bold text-center"
              defaultValue={1}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                e.target.value = value;
              }}
            />
          </div>


          <button onClick={() => { changePage(page.current.value) }} className={'text-white bg-gray-800 p-2 border-2 border-gray-800 hover:bg-indigo-500 hover:border-indigo-500'}><FontAwesomeIcon icon={faSearch} className={'px-2'} /></button>
        </div>
        <div className="mt-3 mx-6">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">User List</h2>
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
          {/* <div className="mt-12 mx-2 flex justify-start items-center">
          <input
            type="text"
            placeholder="Page"
            ref={page}
            className="p-2 rounded-md mr-2 border-2 border-gray-500 focus:outline-none focus:border-indigo-500 w-16 font-bold text-center"
            defaultValue={1}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
              e.target.value = value;
            }}
          />
          <button onClick={() => { changePage(page.current.value) }} className={'text-white bg-gray-800 p-2 rounded-md border-2 border-gray-800 hover:bg-indigo-500 hover:border-indigo-500'}><FontAwesomeIcon icon={faSearch} className={'px-2'}/></button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;