import { useEffect, useState } from "react";
import { PieChart, Cell, Pie, Area, AreaChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

export default function Insights() {
  const [data, setData] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const followerResponse = await fetch(`http://localhost:5000/api/insights/followers`, { headers: { 'R-A-Token': localStorage.getItem('token') } });
        const likesResponse = await fetch(`http://localhost:5000/api/insights/likes`, { headers: { 'R-A-Token': localStorage.getItem('token') } });
        const viewsResponse = await fetch(`http://localhost:5000/api/insights/views`, { headers: { 'R-A-Token': localStorage.getItem('token') } });
        const commentsResponse = await fetch(`http://localhost:5000/api/insights/comments`, { headers: { 'R-A-Token': localStorage.getItem('token') } });
        const ratioResponse = await fetch(`http://localhost:5000/api/insights/likeUserRatio`, { headers: { 'R-A-Token': localStorage.getItem('token') } });

        const obj = {};
        if (followerResponse.status === 200) obj['followers'] = (await followerResponse.json()).response;
        if (likesResponse.status === 200) obj['likes'] = (await likesResponse.json()).response;
        if (viewsResponse.status === 200) obj['views'] = (await viewsResponse.json()).response;
        if (commentsResponse.status === 200) obj['comments'] = (await commentsResponse.json()).response;
        if (ratioResponse.status === 200) {
          const ratioJson = await ratioResponse.json();
          obj['ratio'] = [{ name: "Didn't like", value: ratioJson.response[0][0].Users - ratioJson.response[1][0].Likes }, { name: 'Liked', value: ratioJson.response[1][0].Likes }];
        }

        setData(obj);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-grow bg-indigo-400 items-center flex-col">
      <div style={{ height: "540px" }} className="bg-slate-800 rounded-2xl mt-32 flex flex-col">
        <div className="h-72 w-auto flex flex-wrap justify-around">
          <div className="w-80 h-64 p-4">
            <h2 className="text-lg font-bold mb-4 text-white">Followers</h2>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.followers}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
                <XAxis dataKey="DaysAgo" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Legend />
                <Area type="monotone" dataKey="Followers" stroke="#8884d8" fill="rgba(136,132,216, 0.3)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="w-80 h-64 p-4">
            <h2 className="text-lg font-bold mb-4 text-white">Views</h2>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.views}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
                <XAxis dataKey="DaysAgo" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Legend />
                <Area type="monotone" dataKey="Views" stroke="#82ca9d" fill="rgba(130,202,157, 0.3)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="w-80 h-64 p-4">
            <h2 className="text-lg font-bold mb-4 text-white">Likes</h2>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.likes}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
                <XAxis dataKey="DaysAgo" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Legend />
                <Area type="monotone" dataKey="Likes" stroke="#ffc658" fill="rgba(255,198,88,0.3)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="w-80 h-64 p-4">
            <h2 className="text-lg font-bold mb-4 text-white">Comments</h2>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.comments}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
                <XAxis dataKey="DaysAgo" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Legend />
                <Area type="monotone" dataKey="Comments" stroke="#ff6961" fill="rgba(255,105,97,0.3)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        {data.ratio !== undefined &&
          <div className="flex flex-grow w-full ">
            <PieChart width={300} height={280} className="ml-11">
              <Pie
                data={data.ratio}
                cx={150}
                cy={140}
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {data.ratio.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#FF7F0E', '#1F77B4'][index % 2]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
            <div className="flex items-center ml-11">
              <h3 className="text-white">Out of {data.ratio[0].value + data.ratio[1].value} users that viewed your<br />recipes, {data.ratio[1].value} decided to like, your<br />
                Likes/User ratio is {isNaN((data.ratio[1].value / (data.ratio[1].value + data.ratio[0].value))) == true ? "undefined" : (data.ratio[1].value / (data.ratio[1].value + data.ratio[0].value)).toFixed(2)}</h3>
            </div>
          </div>}
      </div>
    </div>
  );
}