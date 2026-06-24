import { useState, type FC, type PropsWithChildren } from "react";
import { AuthContext } from "./AuthContext";

const USERNAME_KEY = 'username';
const TOKEN_KEY = 'token';


const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const [username, setUsername] = useState<string | null>(localStorage.getItem(USERNAME_KEY))
    const [token, settoken] = useState<string | null>(localStorage.getItem(TOKEN_KEY))

    const login = (username: string, token: string) => {
        setUsername(username);
        settoken(token);
        localStorage.setItem(USERNAME_KEY, username);
        localStorage.setItem(TOKEN_KEY, token);
    }

    const isAuthenticated = !!token;

    const logout = () => {
        localStorage.removeItem(USERNAME_KEY);
        localStorage.removeItem(TOKEN_KEY);
        setUsername(null);
        settoken(null);
    }

    return (
        <AuthContext.Provider value={{ username, token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>

    )
}

export default AuthProvider;