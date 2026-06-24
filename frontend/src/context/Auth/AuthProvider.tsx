import { useState, type FC,  type PropsWithChildren } from "react";
import { AuthContext } from "./AuthContext";


const AuthProvider: FC<PropsWithChildren> = ({children}) => {
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'))
    const [token, settoken] = useState<string | null>(localStorage.getItem('token'))

    const login = (username: string, token: string) => {
        setUsername(username);
        settoken(token);
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);
    }

    const isAuthenticated = !!token;

    return(
        <AuthContext.Provider value={{username, token, login, isAuthenticated}}>
            {children}
        </AuthContext.Provider>

    )
}

export default AuthProvider;