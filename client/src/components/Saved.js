import RecipeCard from "./RecipeCard";
import HeroSection from "./Hero2";
import { useState, useEffect } from "react";
export default function Saved() {
    const [data, setData] = useState([]);
    const [nextPage, setNextPage] = useState(2);
    async function setComponents() {
        try {
            const response = await fetch(`http://localhost:5000/api/recipe/saved`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                    page: 1,
                    rows: 8
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
            const response = await fetch(`http://localhost:5000/api/recipe/saved`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                    'rows': 8,
                    'page': nextPage
                }
            });
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
        <div className="-mt-2">
            <HeroSection />
            <div className="relative">
                <div className="container mx-auto my-8">
                    <h1 className="text-7xl pb-4 border-b-4 font-bold mb-6 flex justify-center border-indigo-300 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Saved recipes</h1>
                    <div className="flex w-full flex-wrap justify-center">
                        {data.map((recipe) => {
                            return <RecipeCard recipe={recipe} />
                        })}
                        <div className='w-full h-24 flex justify-center items-center'>
                            <h2 onClick={seeMore} className={'hover:cursor-pointer text-xl border-indigo-300 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 uppercase'}>See more?</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}