import { GET_ERRORS } from './types';
import axios from 'axios';
// register user -> call request and re-direct app to login page on success
// if error then dispatch getErrors action to errorsReducer

// use axio to send data to backend using
// no localhost as proxy value input in package.json
// as asynchron. data transfer we need to use dispatch (from redux thunk) instead of directly returning payload

// Register User dispatch
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
