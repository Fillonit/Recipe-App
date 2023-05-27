import React from "react";
export default function RecipeTag({ name }) {
    return (
        <div className="flex justify-center items-center rounded-lg w-20 h-10 bg-slate-400">
            <h4>{name}</h4>
        </div>
    );
}