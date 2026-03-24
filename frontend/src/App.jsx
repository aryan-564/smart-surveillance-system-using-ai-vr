import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VRView from './pages/VRView';
import Analytics from './pages/Analytics';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

function App() {
    const { user } = useAuth();

    return (
        <Router>
            <div className="flex bg-black min-h-screen text-white">
                {user && <Sidebar />}
                <div className="flex-1 flex flex-col">
                    {user && <TopBar />}
                    <main className="p-6 overflow-auto">
                        <Routes>
                            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                            <Route path="/vr" element={user ? <VRView /> : <Navigate to="/login" />} />
                            <Route path="/analytics" element={user && user.role === 'Admin' ? <Analytics /> : <Navigate to="/" />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

export default App;
