
export default function ChefApplication({ chef, setApplications, index }) {
    async function accept() {
        try {
            const response = await fetch(`http://localhost:5000/api/chefApplications/accept`, {
                method: "POST",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userToPromote: chef.UserId,
                    experience: chef.Experience,
                    worksAt: chef.WorksAt
                })
            });
            if (response.status !== 201) return;
            setApplications((prev) => {
                return [...prev.slice(0, index), ...prev.slice(index + 1, prev.length)];
            })
        } catch (err) {
            console.log("error: " + err);
        }
    }
    async function reject() {
        try {
            const response = await fetch(`http://localhost:5000/api/chefApplications/reject/${chef.UserId}`, {
                method: "DELETE",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                }
            });
            if (response.status !== 204) return;
            setApplications((prev) => {
                return [...prev.slice(0, index), ...prev.slice(index + 1, prev.length)];
            })
        } catch (err) {
            console.log("error: " + err);
        }
    }
    return (<div className="h-auto w-1/2 bg-indigo-600 text-white flex border border-black rounded-lg flex-col items-center mt-16 mb-16">
        <h1 className="mt-6 text-2xl">{chef.Username}</h1>
        <h4 className="mt-4">{chef.Description}</h4>
        <img className="h-96 rounded-xl mt-6" src={`${chef.ImageUrl}?token=${localStorage.getItem('token')}`} />
        <div className="flex w-1/2 h-24 flex-grow justify-evenly items-center">
            <button className="text-indigo-700 bg-violet-100 h-11 radiour rounded-lg
             hover:bg-violet-200 transition-all w-20 hover:text-indigo-900 text-sm float-left" onClick={() => { accept() }}>ACCEPT</button>
            <button className="text-indigo-700 bg-violet-100 h-11 radiour rounded-lg
             hover:bg-violet-200 transition-all w-20 hover:text-indigo-900 text-sm float-left" onClick={() => { reject() }}>REJECT</button>
        </div>
    </div>);
}