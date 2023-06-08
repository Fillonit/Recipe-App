import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import RecipeCard from '../components/RecipeCard';
// import RecipeList from './components/RecipeList';
// import Navbar from '../components/Navbar';
// import Hero from './components/Hero';
// import ProfilePage from '../components/ProfilePage';

// get data from local storage


const Profile = () => {
  const { id } = useParams();
  const [data, setData] = useState(undefined);
  const [nextSavedPage, setNextSavedPage] = useState(2);
  const [nextPostedRecipesPage, setNextPostedRecipesPage] = useState(2);
  async function seeMoreSaved() {
    try {
      const favoritesResponse = await fetch(`http://localhost:5000/api/recipe/saved/${id}`, {
        method: "GET",
        headers: {
          'R-A-Token': localStorage.getItem('token'),
          'page': nextSavedPage,
          'rows': 5
        }
      });
      if (favoritesResponse.status !== 200) return;
      const json = await favoritesResponse.json();
      setData(prev => {
        return { ...prev, saved: [...prev.saved, ...json.response] };
      })
      setNextSavedPage(prev => prev + 1);
    } catch (error) {
      console.log(error)
    }
  }
  async function seeMorePosted() {
    try {
      const response = await fetch(`http://localhost:5000/api/recipe/chef/${id}`, {
        method: "GET",
        headers: {
          'R-A-Token': localStorage.getItem('token'),
          'page': nextPostedRecipesPage,
          'rows': 8
        }
      });
      if (response.status !== 200) return;
      const json = await response.json();
      setData(prev => {
        return { ...prev, posted: [...prev.posted, ...json.response] };
      })
      setNextPostedRecipesPage(prev => prev + 1);
    } catch (error) {
      console.log(error)
    }
  }
  async function setComponents() {
    try {
      const profileResponse = await fetch(`http://localhost:5000/api/user${id === undefined ? "" : `/${id}`}`, {
        method: 'GET',
        headers: {
          'r-a-token': localStorage.getItem('token')
        }
      });
      let favorites = [], postedRecipes = [];
      if (localStorage.getItem('userId') != id) {
        const favoritesResponse = await fetch(`http://localhost:5000/api/recipe/saved/${id}`, {
          method: "GET",
          headers: {
            'R-A-Token': localStorage.getItem('token'),
            'page': 1,
            'rows': 5
          }
        });
        console.log("STATUS" + favoritesResponse.status)
        const favoriteJson = await favoritesResponse.json();
        favorites = favoriteJson.response;
      }
      const profileJsonData = await profileResponse.json();
      console.log(profileJsonData)
      console.log(favorites);
      if (profileJsonData.response.Role == 'chef') {
        const postedResponse = await fetch(`http://localhost:5000/api/recipe/chef/${id}`, {
          method: "GET",
          headers: {
            'R-A-Token': localStorage.getItem('token'),
            'page': 1,
            'rows': 8
          }
        });
        const postedJson = await postedResponse.json();
        postedRecipes = postedJson.response;
        console.log(postedRecipes);
      }
      const data = { ...profileJsonData.response, saved: [], posted: [] };
      for (const favorite of favorites)
        data.saved.unshift(favorite);
      for (const recipe of postedRecipes)
        data.posted.unshift(recipe);
      setData(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }
  async function markChefAsFavorite() {
    try {
      const response = await fetch(`http://localhost:5000/api/user/favoriteChef/${id}`, {
        method: "POST",
        headers: {
          'R-A-Token': localStorage.getItem('token')
        }
      });
      if (response.status !== 201) return;
      setData(prev => {
        return { ...prev, IsFavorite: true }
      })
    } catch (error) {
      console.log(error);
    }
  }
  async function unmarkChefAsFavorite() {
    try {
      const response = await fetch(`http://localhost:5000/api/user/favoriteChef/${id}`, {
        method: "DELETE",
        headers: {
          'R-A-Token': localStorage.getItem('token')
        }
      });
      if (response.status !== 204) return;
      setData(prev => {
        return { ...prev, IsFavorite: false }
      })
    } catch (error) {
      console.log(error);
    }
  }
  async function follow() {
    try {
      if (id === undefined) return;
      const response = await fetch(`http://localhost:5000/api/follow/${id}`, {
        method: "POST",
        headers: {
          'R-A-Token': localStorage.getItem('token')
        },
      });
      if (response.status !== 201) return;
      setData((prev) => {
        return { ...prev, FollowersCount: prev.FollowersCount + 1, CanFollow: false };
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function unfollow() {
    try {
      if (id === undefined) return;
      const response = await fetch(`http://localhost:5000/api/follow/${id}`, {
        method: "DELETE",
        headers: {
          'R-A-Token': localStorage.getItem('token')
        },
      });
      if (response.status !== 204) return;
      setData((prev) => {
        return { ...prev, FollowersCount: prev.FollowersCount - 1, CanFollow: true, IsFavorite: false };
      });
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    setComponents();
  }, [])
  if (data !== undefined)
    return (
      <div className="mt-60 h-auto">
        <div className="relative max-w-md mx-auto md:max-w-2xl min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl mt-16 border-indigo-500 border-2">
          {id == localStorage.getItem('userId') && <div className='absolute flex justify-between pl-6 pr-6 pt-6  align-center h-auto w-full'>
            <div className='cursor-pointer rounded-2xl hover:bg-indigo-500 hover:text-white h-auto p-3 w-auto bg-indigo-200'>
              <h3><a href={`/saved/${localStorage.getItem('userId')}`}>My saved recipes</a></h3>
            </div>
            {localStorage.getItem('role') == 'admin' && <div className='cursor-pointer rounded-2xl hover:bg-indigo-500 hover:text-white h-auto p-3 w-auto bg-indigo-200'>
              <h3><a href='/dashboard'>Dashboard</a></h3>
            </div>}
          </div>}
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
              <div className="w-full h-30 flex items-center justify-center mt-32">
                <div className="p-3 text-center ml-6">
                  <span className="text-xl font-bold block uppercase tracking-wide text-slate-700">0</span>
                  <span className="text-sm text-slate-400">Favorites</span>
                </div>
                {
                  data.FollowersCount !== null &&
                  <div className="p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-slate-700">{data.FollowersCount}</span>
                    <span className="text-sm text-slate-400">Followers</span>
                  </div>
                }

                {data.FollowingCount !== null && <div className="p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-slate-700">{data.FollowingCount !== undefined ? data.FollowingCount : '?'}</span>
                  <span className="text-sm text-slate-400">Following</span>
                </div>}
                {data.Role == 'chef' && localStorage.getItem('userId') != id && <div className="h-full w-16 flex justify-center items-center">
                  <FontAwesomeIcon className={`cursor-pointer`} onClick={() => { if (data.IsFavorite == true) unmarkChefAsFavorite(); else markChefAsFavorite(); }} style={{ color: data.IsFavorite == true ? 'green' : 'black' }} icon={faBell} size="lg" />
                </div>}
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
                  {localStorage.getItem('role') != 'admin' && localStorage.getItem('userId') != id && <button onClick={() => {
                    if (data.CanFollow === true) follow();
                    else unfollow();
                  }}>{data.CanFollow === true ? `FOLLOW` : `UNFOLLOW`}</button>}
                </div>
              </div>
            </div>
          </div>
        </div>
        {data.saved != undefined && data.saved.length != 0 &&
          <div className='mt-4 ml-16 overflow-x-auto flex w-full p-2'>
            {data.saved.map(item => <div className='ml-11'><RecipeCard recipe={item} /></div>)};
            <button onClick={seeMoreSaved}>see more</button>
          </div>}
        {data.Role == 'chef' && data.posted.length != 0 &&
          <div className="flex mb-8 flex-wrap justify-evenly">
            {data.posted.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))}
            <div className='w-full h-24 flex justify-center items-center'>
              <h2 onClick={seeMorePosted} className={'hover:cursor-pointer text-xl border-indigo-300 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 uppercase'}>See more?</h2>
            </div>
          </div>}
      </div>
    )
}

export default Profile