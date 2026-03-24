import { useAuth } from '../context/AuthContext';
import { UserCircle } from 'lucide-react';

const TopBar = () => {
    const { user } = useAuth();
    return (
        <div className="h-20 w-full flex items-center justify-between px-8 bg-transparent">
            <h2 className="text-2xl font-bold">Surveillance Center</h2>
            <div className="flex items-center space-x-3 glass px-4 py-2 rounded-full cursor-pointer hover:bg-opacity-10 transition">
                <div className="text-right">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-neonBlue">{user?.role}</p>
                </div>
                <UserCircle className="w-8 h-8 text-neonBlue" />
            </div>
        </div>
    );
};
export default TopBar;
