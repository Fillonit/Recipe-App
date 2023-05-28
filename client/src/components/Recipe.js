import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
export default function Recipe() {
    const { id } = useParams();
    const [data, setData] = useState({});
    async function setComponents() {
        try {
            const response = await fetch(`http://localhost:5000/api/recipe/get/${id}`, {
                method: "GET"
            });
            if (response.status !== 200) return;
            const json = await response.json();
            const obj = {};
            for (const prop in json.response[0][0])
                obj[prop] = json.response[0][0][prop];
            obj["comments"] = json.response[1].slice();
            obj["ingredients"] = json.response[2].slice();
            setData(obj);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        setComponents();
    });
    const ingredients = [];
    const comments = [];
    let rating;
    if (Object.keys(data) !== 0)
        return (
            <div className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow">
                <img src="" alt="" className="w-full h-auto rounded-lg mb-4" />
                <h2 className="text-2xl font-bold mb-2">""</h2>
                <p className="text-gray-600 mb-4">description</p>
                <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
                <ul className="list-disc list-inside mb-4">
                    {ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
                <p className="mb-2">Number of likes: 0</p>
                <h3 className="text-lg font-semibold mb-2">Comments:</h3>
                <ul className="mb-4">
                    {comments.map((comment, index) => (
                        <li key={index} className="mb-2">
                            {comment}
                        </li>
                    ))}
                </ul>
                <p>Rating: {rating ?? 0}</p>
            </div>
        );
    else return (<></>);
}