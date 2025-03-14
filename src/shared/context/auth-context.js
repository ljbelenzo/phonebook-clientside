import { createContext } from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    userId: null,
    role:undefined,
    token:undefined,
    login: () => {},
    logout: () => {},
});