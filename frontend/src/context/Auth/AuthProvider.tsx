import { useState, type FC, type PropsWithChildren } from "react";
import { AuthContext } from "./AuthContext";
import { authFetch } from "../../api/authFetch";

const USERNAME_KEY = 'username';
// const TOKEN_KEY = 'token';


const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const [username, setUsername] = useState<string | null>(localStorage.getItem(USERNAME_KEY))
    // const [token, settoken] = useState<string | null>(localStorage.getItem(TOKEN_KEY))

    const login = (username: string) => {
        setUsername(username);
        // settoken(token);
        localStorage.setItem(USERNAME_KEY, username);
        // localStorage.setItem(TOKEN_KEY, token);
    }

    const isAuthenticated = username !== null;

    const logout = async () => {
        // localStorage.removeItem(USERNAME_KEY);
        // localStorage.removeItem(TOKEN_KEY);
        await authFetch("http://localhost:3001/logout", {
            method: "POST"
        });

        localStorage.removeItem(USERNAME_KEY);

        setUsername(null);
        // settoken(null);
    }

    return (
        <AuthContext.Provider value={{ username, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>

    )
}

export default AuthProvider;