import React, { useState, useEffect } from 'react';

// import RecipeList from './components/RecipeList';
// import Navbar from '../components/Navbar';
// import Hero from './components/Hero';
// import ProfilePage from '../components/ProfilePage';

// get data from local storage


const Profile = () => {
  const [data, setData] = useState(undefined);

  async function setComponents() {
    try {
      const response = await fetch(`http://localhost:5000/api/user/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'r-a-token': localStorage.getItem('token')
        }
      });
      const jsonData = await response.json();
      setData(jsonData.response);
      console.log(jsonData);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    console.log("herre");
    setComponents();
  }, [])
  if (data !== undefined)
    return (
      <div className="mt-60 h-screen">
        <div className="relative max-w-md mx-auto md:max-w-2xl min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl mt-16 border-indigo-500 border-2">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full flex justify-center">
                <div className="relative">
                  {
                    data.ProfilePicture === null ?
                      <img src="https://img.freepik.com/free-icon/user_318-563642.jpg" className="shadow-xl rounded-full align-middle absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px] border-indigo-500 border-2" alt="profile pic" />
                      :
                      <img src={data.ProfilePicture} className="shadow-xl rounded-full align-middle absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px] border-indigo-500 border-2" alt="profile pic" />
                  }
                </div>
              </div>
              <div className="w-full text-center mt-20">
                <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                  <div className="p-3 text-center ml-6">
                    <span className="text-xl font-bold block uppercase tracking-wide text-slate-700">0</span>
                    <span className="text-sm text-slate-400">Favorites</span>
                  </div>
                  {
                    localStorage.getItem('role') === 'chef' &&
                    <div className="p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-slate-700">{data.Followers}</span>
                      <span className="text-sm text-slate-400">Followers</span>
                    </div>
                  }

                  <div className="p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-slate-700">{data.FollowingCount !== undefined ? data.FollowingCount : '?'}</span>
                    <span className="text-sm text-slate-400">Following</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-2 ml-6">
              <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1">{(data.Username.toUpperCase())}</h3>
              <div className="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
                <i className="fas fa-map-marker-alt mr-2 opacity-75"></i><p classNameName='overline text-indigo-500 -mt-4'>{data.Role}</p>
              </div>
            </div>
            <div className="mt-6 py-6 border-t border-slate-200 text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4">
                  <p className="font-light leading-relaxed text-slate-600 mb-4">{data.Description}</p>
                  {
                    localStorage.getItem('role') === 'chef' &&
                    <a href="/profile" className="font-normal text-slate-700 hover:text-slate-400">Follow Account</a>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Profile