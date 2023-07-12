import { useRef } from 'react';
export default function ContactCard({ contact, setContacts, index }) {
    const adminResponse = useRef();
    async function accept() {
        try {
            const response = await fetch(`http://localhost:5000/api/contacts/acknowledge`, {
                method: "POST",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    response: adminResponse.current.value,
                    contactId: contact.ContactId,
                    contacter: contact.UserId
                })
            })
            if (response.status !== 201) return;
            setContacts((prev) => {
                return [...prev.slice(0, index), ...prev.slice(index + 1, prev.length)];
            });
        } catch (e) {
            console.log(e);
        }
    }
    async function reject() {
        try {
            const response = await fetch(`http://localhost:5000/api/contacts/acknowledge`, {
                method: "DELETE",
                headers: {
                    'R-A-Token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contactId: contact.ContactId,
                })
            })
            if (response.status !== 204) return;
            setContacts((prev) => {
                return [...prev.slice(0, index), ...prev.slice(index + 1, prev.length)];
            });
        } catch (e) {
            console.log(e);
        }
    }
    function convertDateFormat(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    return (
        <div className="h-auto w-4/6 bg-indigo-600 rounded-lg mt-16 mb-12 text-white">
            <div className="h-auto p-3 border-b flex">
                <div className="h-full w-1/2">
                    <h2><a href={`/users/${contact.UserId}`}>@{contact.Username}</a></h2>
                </div>
                <div className="h-full w-1/2">
                    <h2>{convertDateFormat(contact.CreatedAt)}</h2>
                </div>
            </div>
            <div className="h-auto w-full p-3 border-b">
                <p>{contact.Description}</p>
            </div>
            <div className="h-auto w-full p-3">
                <div className="w-full h-auto p-2 rounded-lg">
                    <textarea ref={adminResponse} className="max-h-36 text-black min-h-10 w-full p-3" placeholder='Your response goes here'></textarea>
                </div>
                <div className="h-20 w-full flex justify-evenly items-center">
                    <button className="text-indigo-700 pl-2 pr-2 bg-violet-100 h-11 radiour rounded-lg
             hover:bg-violet-200 transition-all w-auto hover:text-indigo-900 text-sm float-left" onClick={() => { accept() }}>ACKNOWLEDGE</button>
                    <button className="text-indigo-700 bg-violet-100 h-11 radiour rounded-lg
             hover:bg-violet-200 transition-all w-auto pl-2 pr-2 hover:text-indigo-900 text-sm float-left" onClick={() => { reject() }}>IGNORE</button>
                </div>
            </div>
        </div>
    );
}