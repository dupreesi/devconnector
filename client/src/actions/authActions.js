import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from './types';
//  sudo for register user -> call request and re-direct app to login page on success
// if error then dispatch getErrors action to errorsReducer
// use axio to send data to backend
// no localhost as proxy value input in package.json
// as asynchron. data transfer we need to use dispatch (from redux thunk) instead of directly returning payload

// Register User dispatch
// redux step 3 and 4) subscribe, get current state and dispatch
export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login')) //redirect after reguster success
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token (token includes userId, name, avatar...)
export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      // save to local storage
      const { token } = res.data;
      // set token to ls (only stores strings)
      localStorage.setItem('jwtToken', token);
      // set token to auth header
      setAuthToken(token);
      // Decode Token to get user data
      const decoded = jwt_decode(token);
      // set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // remove token from ls
  localStorage.removeItem('jwtToken');
  // remove auth header for future reqs
  setAuthToken(false);
  // set current user to empty {} which will set is Authenticated to false
  dispatch(setCurrentUser({})); // sets isAuthenticated to false as payload is {} and !isEmpty{} = false
};
