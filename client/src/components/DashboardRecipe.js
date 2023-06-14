import { useState, useEffect } from "react";
import DashboardSidebar from "./DashboardSidebar";
import Recipes from "../pages/Recipes";
export default function DashboardContacts() {
    const [recipes, setRecipes] = useState([]);
    const [nextPage, setNextPage] = useState(2);
    async function setComponents() {
        try {
            const response = await fetch(`http://localhost:5000/api/recipe/get?page=1&pageSize=5&sortOrder=ASC&sortBy=Title`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                    'page': 1,
                    'rows': 5
                }
            })
            if (response.status !== 200) return;
            const json = await response.json();
            setRecipes(json.response);
        } catch (error) {
            console.log(error);
        }
    }
    async function seeMore() {
        try {
            const response = await fetch(`http://localhost:5000/api/recipe/get?page=${nextPage}&pageSize=5&sortOrder=ASC`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                    'page': nextPage,
                    'rows': 5
                }
            })
            if (response.status !== 200) return;
            const json = await response.json();
            setRecipes(prev => [...prev, ...json.response]);
            setNextPage(prev => prev + 1);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        setComponents();
    }, []);
    return (
        <div className="flex h-screen">
            <DashboardSidebar />
            <div className="w-5/6 bg-indigo-200 h-full overflow-y-auto pl-10 pr-10 flex flex-col items-center">
            <Recipes/>
            </div>
        </div>
    );
}