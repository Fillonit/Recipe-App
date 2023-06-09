import { useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
export default function Step({ setSteps, description, stepNumber }) {
    const [editingMode, setEditingMode] = useState(false);
    const editedDescription = useRef();
    function deleteStep() {
        setSteps(prev => {
            return [...prev.slice(0, stepNumber - 1), ...prev.slice(stepNumber, prev.length)];
        })
    }
    function editStep() {
        setEditingMode(prev => !prev)
    }
    function confirmEdit() {
        setSteps(prev => {
            const aux = prev.slice();
            aux[stepNumber - 1] = editedDescription.current.value;
            return aux;
        });
        setEditingMode(false);
    }
    return (
        <div className="mt-2 w-full h-auto bg-violet-400 rounded-md p-1 relative">
            <div className="flex justify-between items-center">
                <h2>{`Step number ${stepNumber}`}</h2>
                <div className="flex items-center">
                    <FontAwesomeIcon
                        icon={faEdit}
                        onClick={editStep}
                        className="mr-2 cursor-pointer"
                    />
                    <FontAwesomeIcon
                        icon={faTimes}
                        onClick={deleteStep}
                        className="cursor-pointer"
                    />
                </div>
            </div>
            {editingMode ? (
                <div className="relative">
                    <textarea
                        ref={editedDescription}
                        className="w-full mt-2 bg-white rounded-md p-1"
                        defaultValue={description}
                    ></textarea>
                    <div onClick={confirmEdit} style={{ transform: "translate(1100%, -120%)" }} className="bg-indigo-600 w-6 h-6 rounded-xl cursor-pointer absolute flex justify-center items-center">  <FontAwesomeIcon icon={faCheck} /></div>
                </div>
            ) : (
                <h4>{description}</h4>
            )}
        </div>
    );
}