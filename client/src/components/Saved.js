import RecipeCard from "./RecipeCard";
import { useState, useEffect } from "react";
export default function Saved() {
    const [data, setData] = useState([]);
    const [nextPage, setNextPage] = useState(2);
    async function setComponents() {
        try {
            const response = await fetch(`http://localhost:5000/api/recipe`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                    page: 1,
                    rows: 12
                }
            })
            if (response.status !== 200) return;
            const json = await response.json();
            setData(json.response);
        } catch (error) {
            console.log(error);
        }
    }
    async function seeMore() {
        try {
            const response = await fetch(`http://localhost:5000/api/recipe`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                    page: nextPage,
                    rows: 12
                }
            })
            if (response.status !== 200) return;
            const json = await response.json();
            setData(prev => [...prev, ...json.response]);
            setNextPage(prev => prev + 1);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        setComponents();
    }, []);
    return (
        <div className="flex flex-wrap justify-center">
            {data.map((recipe) => {
                return <RecipeCard recipe={recipe} />
            })}
            <div className='w-full h-24 flex justify-center items-center'>
                <h2 onClick={seeMore}>See more</h2>
            </div>
        </div>
    );
}