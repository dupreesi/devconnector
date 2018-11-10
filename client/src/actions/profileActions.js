import axios from 'axios';
// load types
import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER
} from './types';

// Get current profile
// hit endpoint, call reducer type

export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get('/api/profile')
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    // if no profile, send {} with call to action 'create profile'
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};
// Create Profile
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post('/api/profile', profileData)
    .then(res => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Account and Profile
export const deleteAccount = () => dispatch => {
  if (window.confirm('Are you sure? This can not be undone!')) {
    axios
      .delete('/api/profile')
      .then(res =>
        dispatch({
          // send empty {} so auth is false
          type: SET_CURRENT_USER,
          payload: {}
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};

// Profile Loading (lets reducer know its loading)
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Clear Profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
