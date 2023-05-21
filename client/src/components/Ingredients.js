import Ingredient from "./Ingredient";
import Steps from "./Steps";
import "../styles/recipeTags.css";
export default function Ingredients({ steps, ingredients, recipeIngredients, units }) {
    const ingredientCount = Object.keys(recipeIngredients).length;
    if (ingredientCount != 0 || steps.length != 0)
        return (
            <div className="bg-violet-200 self-start shadow-md rounded px-8 pt-6 pb-8 ml-20 mb-4 w-1/4 h-auto">
                {ingredientCount != 0 && <h3> Ingredients</h3>}
                <div className="ingredientContainer">
                    {Object.keys(recipeIngredients).map((key) => {
                        return <Ingredient ingredient={{ ...ingredients[key], unit: units[recipeIngredients[key].unit].UnitName, amount: recipeIngredients[key].amount }} />
                    })}
                </div>
                <Steps steps={steps} />
            </div >
        );
}