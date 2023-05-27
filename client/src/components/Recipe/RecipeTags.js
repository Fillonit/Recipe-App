import "../styles/recipeTags.css";
import RecipeTag from "./RecipeTag";
import { useRef } from 'react';
export default function RecipeTags({ tags, recipeTags, setRecipeTags }) {
    const currentTag = useRef();

    return (
        <div className="tagContainer">
            {Object.keys(recipeTags).map((item) => {
                return <RecipeTag name={recipeTags[item]} />
            })}
            <div className="w-20 h-10 shadow-md">
                <select onChange={() => {
                    console.log(currentTag.current.value);
                }} ref={currentTag}>
                    {tags.map((item) => {
                        return <option value={`${item.TagId},${item.Name}`}>{item.Name}</option>
                    })}
                </select>
                <button onClick={(e) => {
                    e.preventDefault();
                    setRecipeTags((prev) => {
                        const values = currentTag.current.value.split(',');
                        return { ...prev, [values[0]]: values[1] };
                    })
                }}>ADD TAG</button>
            </div>
        </div>
    );
}