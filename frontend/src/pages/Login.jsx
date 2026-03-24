import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const [role, setRole] = useState('Admin');

    const handleLogin = (e) => {
        e.preventDefault();
        login({ name: 'Test User', email: 'test@admin.com', role });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
            <div className="absolute top-0 right-0 w-96 h-96 bg-neonBlue rounded-full blur-[150px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>

            <div className="glass p-8 w-full max-w-md z-10 transition-all transform hover:scale-105 duration-300">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400">Sign in to your dashboard</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                        <input type="email" required className="w-full bg-black bg-opacity-50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-colors" placeholder="admin@surveillance.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                        <input type="password" required className="w-full bg-black bg-opacity-50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-colors" placeholder="••••••••" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Role (Mock)</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-black bg-opacity-50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-colors">
                            <option value="Admin">Admin</option>
                            <option value="Viewer">Viewer</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-neonBlue text-black font-bold rounded-lg px-4 py-3 hover:bg-opacity-90 transition-all transform active:scale-95">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};
export default Login;
