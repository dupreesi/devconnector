import { combineReducers } from 'redux';
import authReducer from './authReducer';

// call reducers by using this.props.auth
export default combineReducers({
  auth: authReducer
});
