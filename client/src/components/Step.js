
export default function Step({ description, stepNumber }) {
    return (
        <div className="mt-2 w-full h-auto bg-violet-400 rounded-md pt-1 pb-1 pl-1 pr-1">
            <h2>{`Step number ${stepNumber}`}</h2>
            <h4>{description}</h4>
        </div>
    );
}