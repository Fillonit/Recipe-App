import "../index.css";
import { useState } from "react";
/*cuisines prop is expected in the following format:
{
    (int)cuisineId: (string)cuisine name
}
*/
export default function FilterGrid({ cuisines }) {
    const [selected, setSelected] = useState({});
    const data = [];
    for (const key in cuisines)
        data.push(<div onClick={() => {
            setSelected((prev) => {
                if (key in prev) return { ...prev, [key]: !prev[key] };
                return { ...prev, [key]: true };
            })
        }} style={styler(key)} className="w-full h-full flex justify-center items-center rounded-5 bg-cae962 transition-all "><p>{cuisines[key]}</p></div>)
    function styler(id) {
        if (id in selected) return { transform: "translateY(-10%)", boxShadow: "0px 5px 7px rgba(0, 0, 0, 0,6)" };
        return {};
    }
    return (<div className="w-40 h-full grid grid-cols-auto-fit grid-flow-row grid-rows-auto gap-5 bg">{data}</div>);
}