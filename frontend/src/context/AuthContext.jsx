import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check local storage for mocked session
        const storedUser = localStorage.getItem('surveillanceUser');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('surveillanceUser', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('surveillanceUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
