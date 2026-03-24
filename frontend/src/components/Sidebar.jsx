import { NavLink } from 'react-router-dom';
import { Camera, BarChart2, Video, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout, user } = useAuth();
    return (
        <div className="w-64 glass h-screen m-4 hidden md:flex flex-col">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-bold text-neonBlue">AI Surveillance</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <NavLink to="/" className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-neonBlue bg-opacity-20 text-neonBlue' : 'hover:bg-gray-800'}`}>
                    <Camera className="w-5 h-5" />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/vr" className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-neonBlue bg-opacity-20 text-neonBlue' : 'hover:bg-gray-800'}`}>
                    <Video className="w-5 h-5" />
                    <span>VR Mode</span>
                </NavLink>
                {user?.role === 'Admin' && (
                    <NavLink to="/analytics" className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-neonBlue bg-opacity-20 text-neonBlue' : 'hover:bg-gray-800'}`}>
                        <BarChart2 className="w-5 h-5" />
                        <span>Analytics</span>
                    </NavLink>
                )}
            </nav>
            <div className="p-4 border-t border-gray-800">
                <button onClick={logout} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500 hover:bg-opacity-20 hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};
export default Sidebar;
