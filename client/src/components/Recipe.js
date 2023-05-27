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
            for(const prop in json.response[0])
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        setComponents();
    })
    return (
        <div className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow">
            <img src={picture} alt={title} className="w-full h-auto rounded-lg mb-4" />
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600 mb-4">{description}</p>
            <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
            <ul className="list-disc list-inside mb-4">
                {ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>
            <p className="mb-2">Number of likes: {likes}</p>
            <h3 className="text-lg font-semibold mb-2">Comments:</h3>
            <ul className="mb-4">
                {comments.map((comment, index) => (
                    <li key={index} className="mb-2">
                        {comment}
                    </li>
                ))}
            </ul>
            <p>Rating: {rating}</p>
        </div>
    );

}