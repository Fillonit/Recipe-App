import { useState, useEffect } from "react";
import DashboardSidebar from "./DashboardSidebar";
import ContactCard from "./ContactCard";
export default function DashboardContacts() {
    const [contacts, setContacts] = useState([]);
    const [nextPage, setNextPage] = useState(2);
    async function setComponents() {
        try {
            const response = await fetch(`http://localhost:5000/api/contacts`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                    'page': 1,
                    'rows': 5
                }
            })
            if (response.status !== 200) return;
            const json = await response.json();
            setContacts(json.response);
        } catch (error) {
            console.log(error);
        }
    }
    async function seeMore() {
        try {
            const response = await fetch(`http://localhost:5000/api/contacts`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                    'page': nextPage,
                    'rows': 5
                }
            })
            if (response.status !== 200) return;
            const json = await response.json();
            setContacts(prev => [...prev, ...json.response]);
            setNextPage(prev => prev + 1);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        setComponents();
    }, []);
    return (
        <div className="flex h-screen">
            <DashboardSidebar />
            <div className="w-5/6 bg-indigo-200 h-full overflow-y-auto pl-10 pr-10 flex flex-col items-center">
                {contacts.map((item, index) => {
                    return <ContactCard contact={item} setContacts={setContacts} index={index} />
                })}
                <div className='w-full h-24 flex justify-center items-center mb-10'>
                    <h2 onClick={seeMore} className={'hover:cursor-pointer text-xl border-indigo-300 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 uppercase'}>See more?</h2>
                </div>
            </div>
        </div>
    );
}