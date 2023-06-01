import { faHome, faUsers, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default function DashboardSidebar() {
    return (
        <div className="w-1/6 bg-gray-900 text-white pt-3">
            <div className="p-6 pl-6">
                <h2 className="text-3xl font-bold mb-12 px-3">Magnolia</h2>
                <ul className="space-y-4">
                    <li className="py-4 rounded-lg bg-gray-800">
                        <a
                            href="/dashboard"
                            className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg py-2 px-4"
                        >
                            <FontAwesomeIcon icon={faHome} className="mr-4" />
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a
                            href="/dashboard/users"
                            className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg py-2 px-4"
                        >
                            <FontAwesomeIcon icon={faUsers} className="mr-4" />
                            Users
                        </a>
                    </li>
                    <li>
                        <a
                            href="/dashboard/recipes"
                            className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg py-2 px-4"
                        >
                            <FontAwesomeIcon icon={faUtensils} className="mr-4" />
                            Recipes
                        </a>
                    </li>
                    <li>
                        <a
                            href="/dashboard/chefApplications"
                            className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg py-2 px-4"
                        >
                            <FontAwesomeIcon icon={faUtensils} className="mr-4" />
                            Chef Applications
                        </a>
                    </li>
                </ul>
                <div className="absolute bottom-0 py-4 px-8">
                    <p className="text-xs text-gray-400">© 2023 Magnolia. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}