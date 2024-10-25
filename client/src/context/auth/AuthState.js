import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	CLEAR_ERRORS
} from '../types';

const AuthState = props => {
	const initialState = {
		token: localStorage.getItem('token'),
		isAuthenticated: null,
		loading: true,
		user: null,
		error: null
	};

	const [state, dispatch] = useReducer(authReducer, initialState);

	// Load User
	const loadUser = async () => {
		if (localStorage.token) {
			setAuthToken(localStorage.token);
		}

		try {
			const res = await axios.get('/api/auth');

			dispatch({
				type: USER_LOADED,
				payload: res.data
			});
		} catch (err) {
			dispatch({ type: AUTH_ERROR });
		}
	};

	// Register User
	const register = async formData => {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		try {
			const res = await axios.post('/api/users', formData, config);

			dispatch({
				type: REGISTER_SUCCESS,
				payload: res.data
			});

			loadUser();
		} catch (err) {
			dispatch({
				type: REGISTER_FAIL,
				payload: err.response.data.msg
			});
		}
	};

	// const login = async formData => {
	// 	const config = {
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		}
	// 	};

	// 	try {
	// 		console.log("config")
	// 		 const res = await axios.post('/api/auth', formData, config);
			
	// 		if (!res.ok) {
	// 			throw new Error('Network response was not ok');
	// 		}
			
			
	// 		dispatch({
	// 			type: LOGIN_SUCCESS,
	// 			payload: res.data
	// 		});

	// 		loadUser();
	// 	} catch (err) {
	// 		dispatch({
	// 			type: LOGIN_FAIL,
	// 			payload: err.response.data.msg
	// 		});
	// 	}
	// };

	const login = async (formData) => {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};
	
		try {
			console.log("Sending login request with config:", config);
			const res = await axios.post('/api/auth', formData, config);
			
			// Log the entire response to debug
			console.log("Response from server:", res);
	
			// Check if the response is okay
			if (res.status !== 200) {
				throw new Error('Network response was not ok');
			}
	
			// Dispatch the login success action
			dispatch({
				type: LOGIN_SUCCESS,
				payload: res.data // This should contain the token and/or user data
			});
	
			loadUser();
		} catch (err) {
			// Log the error for debugging
			console.error("Error during login:", err);
	
			// If the response is available, use its message; otherwise, provide a default message
			const errorMsg = err.response && err.response.data && err.response.data.msg 
				? err.response.data.msg 
				: 'Login failed';
	
			dispatch({
				type: LOGIN_FAIL,
				payload: errorMsg
			});
		}
	};
	


	// const login = async (formData) => {
	// 	const config = {
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		}
	// 	};
	
	// 	try {
	// 		console.log("config");
	// 		const res = await fetch('/api/auth', {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				...config.headers // If you have additional headers in your config
	// 			},
	// 			body: JSON.stringify(formData) // Convert formData to JSON
	// 		});
	
	// 		if (!res.ok) {
	// 			const errorData = await res.json(); // Parse the JSON error response
	// 			throw new Error(errorData.msg || 'Something went wrong');
	// 		}
	
	// 		const data = await res.json(); // Parse the JSON response
	// 		dispatch({
	// 			type: LOGIN_SUCCESS,
	// 			payload: data.user // Adjust based on the structure of the response
	// 		});
	
	// 		loadUser();
	// 	} catch (err) {
	// 		dispatch({
	// 			type: LOGIN_FAIL,
	// 			payload: err.message // Use the error message directly
	// 		});
	// 	}
	// };
	
	// Logout
	const logout = () => dispatch({ type: LOGOUT });

	// Clear Errors
	const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

	return (
		<AuthContext.Provider
			value={{
				token: state.token,
				isAuthenticated: state.isAuthenticated,
				loading: state.loading,
				user: state.user,
				error: state.error,
				register,
				loadUser,
				login,
				logout,
				clearErrors
			}}>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthState;
