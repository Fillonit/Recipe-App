import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
export default function Ingredient({ ingredient, setIngredients, index }) {
    function deleteIngredient() {
        setIngredients(prev => {
            const obj = Object.assign({}, prev);
            const keyToDelete = Object.keys(obj)[index];
            console.log(obj);
            console.log(keyToDelete);
            delete obj[keyToDelete];
            return obj;
        });
    }
    return (
        <div className="mt-2 w-full h-full bg-violet-400 rounded-md pt-1 pb-1 pl-1 pr-1 relative">
            <div className="flex justify-between items-center">
                <h4>{ingredient.Name}</h4>
                <div className="flex items-center">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-gray-800 hover:text-black cursor-pointer"
                        onClick={deleteIngredient}
                    />
                </div>
            </div>
            <h4>{ingredient.amount} {ingredient.unit}s</h4>
        </div>
    );
}