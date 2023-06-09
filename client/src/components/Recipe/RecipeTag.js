import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
export default function RecipeTag({ name, setRecipeTags, index }) {
    function deleteTag() {
        setRecipeTags(prev => {
            const obj = Object.assign({}, prev);
            const keyToDelete = Object.keys(obj)[index];
            delete obj[keyToDelete];
            return obj;
        })
    }
    return (
        <div className="flex justify-evenly items-center rounded-lg w-full h-11 bg-slate-100 shadow-2xl">
            <p>{name}</p>
            <FontAwesomeIcon
                icon={faTrash}
                className="ml-2 cursor-pointer"
                onClick={deleteTag}
            />
        </div>
    );
}