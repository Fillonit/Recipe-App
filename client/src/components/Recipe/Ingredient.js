
export default function Ingredient({ ingredient }) {
    return (
        <div className="mt-2 w-full h-full bg-violet-400 rounded-md pt-1 pb-1 pl-1 pr-1">
            <h4>{ingredient.Name}</h4>
            <h4>{ingredient.amount} {ingredient.unit}s</h4>
        </div>
    );
}