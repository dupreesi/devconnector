import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';

// call reducers by using this.props.auth
export default combineReducers({
  auth: authReducer,
  errors: errorReducer
});
