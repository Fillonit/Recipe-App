import "../../styles/recipeTags.css";
import RecipeTag from "./RecipeTag";
import { useRef } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus } from '@fortawesome/free-solid-svg-icons';
export default function RecipeTags({ tags, recipeTags, setRecipeTags }) {
    const currentTag = useRef();
    function addTag(e) {
        e.preventDefault();
        setRecipeTags((prev) => {
            const values = currentTag.current.value.split(',');
            return { ...prev, [values[0]]: values[1] };
        })
    }
    return (
        <div>
            <div className="w-36 shadow-lg p-2">
                <div className="relative">
                    <select
                        ref={currentTag}
                        className="w-full bg-white border border-gray-300 rounded-md py-1 px-2"
                    >
                        {tags.map((item) => (
                            <option key={item.TagId} value={`${item.TagId},${item.Name}`}>
                                {item.Name}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={addTag}
                    className="w-32 text-sm mt-2 py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                >
                    Add Tag
                </button>
            </div>
            <div style={{ gridTemplateColumns: Object.keys(recipeTags).length <= 2 ? "repeat(auto-fit, 100px)" : "repeat(auto-fit, minmax(100px, 1fr))", gridTemplateRows: "auto", gap: "3px" }}
                className="grid mt-3 w-full h-auto">
                {Object.keys(recipeTags).map((item, index) => {
                    return <RecipeTag setRecipeTags={setRecipeTags} index={index} name={recipeTags[item]} />
                })}
            </div>
        </div>
    );
}
