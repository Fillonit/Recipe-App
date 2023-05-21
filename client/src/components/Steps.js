import Step from "./Step";
export default function Steps({ steps }) {
    if (steps.length != 0)
        return (
            <div className="bg-violet-200 shadow-md rounded px-8 pt-6 pb-8 mt-6 mb-4 w-full h-auto">
                {steps.map((item, index) => {
                    return <Step stepNumber={index + 1} description={item} />
                })}
            </div>
        );
}