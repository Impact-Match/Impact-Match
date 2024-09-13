import { createContext, useEffect, useReducer } from "react";
import axios from "axios";
// CUSTOM COMPONENT
import { MatxLoading } from "app/components";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const initialState = {
    user: null,
    role: "CUSTOMER",
    isInitialized: false,
    isAuthenticated: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            // Always set isInitialized to true when the INIT action is dispatched
            return { ...state, isAuthenticated: action.payload.isAuthenticated, user: action.payload.user, role: action.payload.role, isInitialized: true };
        case "LOGIN":
            return { ...state, isAuthenticated: true, user: action.payload.user, role: action.payload.role };
        case "LOGOUT":
            return { ...state, isAuthenticated: false, user: null, role: "CUSTOMER", isInitialized: true }; // Ensure isInitialized remains true after logout
        case "REGISTER":
            //log in = register?
            return { ...state, isAuthenticated: true, user: action.payload.user, role: action.payload.role };
        default:
            return state;
    }
};


const AuthContext = createContext({
    ...initialState,
    method: "JWT",
    login: () => {
    },
    logout: () => {
    },
    register: () => {
    }
});

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${BASE_URL}/login`, { email, password });
            if (response.status === 200 && response.data.user && response.data.token) {
                localStorage.setItem('jwtToken', response.data.token);
                localStorage.setItem('userData', JSON.stringify(response.data.user));  // Store user data
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                dispatch({
                    type: "LOGIN",
                    payload: { user: { ...response.data.user, role: response.data.user.role.toUpperCase() } }
                });
            } else {
                throw new Error('Login failed! Please check your credentials.');
            }
        } catch (error) {
            console.error('Login Failed:', error);
            throw error;
        }
    };

    const register = async (email, username, password) => {
        const response = await axios.post(`${BASE_URL}/register`, { email, username, password });

        dispatch({ type: "REGISTER", payload: { user: response.data.user, role: response.data.role } });
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userData');
        delete axios.defaults.headers.common['Authorization'];
        dispatch({ type: "LOGOUT" });
    };

    const checkSession = async () => {
        const jwtToken = localStorage.getItem('jwtToken');
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (jwtToken && userData) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
            dispatch({ type: "INIT", payload: { isAuthenticated: true, user: userData } });
        } else {
            console.log("Session check failed or no token/userData found.");
            dispatch({ type: "INIT", payload: { isAuthenticated: false, user: null } });
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    // SHOW LOADER
    if (!state.isInitialized) return <MatxLoading />;

    return (
        <AuthContext.Provider value={{ ...state, method: "JWT", login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
