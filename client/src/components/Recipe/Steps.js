import Step from "./Step";
export default function Steps({ steps, setSteps }) {
    if (steps.length !== 0)
        return (
            <div className="bg-violet-200 rounded px-2 pt-2 pb-2 mt-2 mb-2 w-full h-auto">
                {steps.map((item, index) => {
                    return <Step setSteps={setSteps} stepNumber={index + 1} description={item} />
                })}
            </div>
        );
}