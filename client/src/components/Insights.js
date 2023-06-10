import { useEffect, useState } from "react";
import { PieChart, Cell, Pie, Area, AreaChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
export default function Insights() {
    const [data, setData] = useState({});
    async function setComponents() {
        try {
            const r1 = fetch(`http://localhost:5000/api/insights/followers`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token')
                }
            });
            const r2 = fetch(`http://localhost:5000/api/insights/likes`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token')
                }
            });
            const r3 = fetch(`http://localhost:5000/api/insights/views`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token')
                }
            });
            const r4 = fetch(`http://localhost:5000/api/insights/comments`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token')
                }
            });
            const r5 = fetch(`http://localhost:5000/api/insights/likeUserRatio`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token')
                }
            });
            const followerResponse = await r1;
            const likesResponse = await r2;
            const viewsResponse = await r3;
            const commentsResponse = await r4;
            const ratioResponse = await r5;
            console.log(followerResponse.status);
            const obj = {};
            if (followerResponse.status === 200) {
                const followerJson = await followerResponse.json();
                obj['followers'] = followerJson.response;
            }
            if (likesResponse.status === 200) {
                const likesJson = await likesResponse.json();
                obj['likes'] = likesJson.response;
            }
            if (commentsResponse.status === 200) {
                const commentsJson = await commentsResponse.json();
                obj['comments'] = commentsJson.response;
            }

            if (viewsResponse.status === 200) {
                const viewsJson = await viewsResponse.json();
                obj['views'] = viewsJson.response;
            }

            if (ratioResponse.status === 200) {
                const ratioJson = await ratioResponse.json();
                obj['ratio'] = [{ name: "Didn't like", value: ratioJson.response[0][0].Users - ratioJson.response[1][0].Likes }, { name: 'Liked', value: ratioJson.response[1][0].Likes }];
            }
            console.log(obj);
            setData(obj);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        setComponents();
    }, []);
    console.log("data");
    console.log(data);
    const colorRange = ['#FF7F0E', '#1F77B4', '#93C572']
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
                        < PieChart width={300} height={280} className="ml-11">
                            <Pie
                                data={data.ratio}
                                cx={150}
                                cy={140}
                                outerRadius={80}
                                fill="#8884d8"
                                label
                            >
                                {data.ratio.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colorRange[index % colorRange.length]} />
                                ))}
                            </Pie>
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                        <div className="flex items-center ml-11">
                            <h3 className="text-white">Out of {data.ratio[0].value + data.ratio[1].value} users that viewed your<br />recipes, {data.ratio[1].value} decided to like, your<br /> Likes/User ratio is {(data.ratio[1].value / (data.ratio[1].value + data.ratio[0].value)).toFixed(2)}</h3>
                        </div>
                    </div>}
            </div>
        </div >
    );
}