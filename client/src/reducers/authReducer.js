import isEmpty from '../validation/is-empty';
import { SET_CURRENT_USER } from '../actions/types';
const initialState = {
  isAuthenticated: false,
  user: {}
};
// create reducer(state, action) returning new state
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER: // either authentification or return to initial state
      return {
        ...state, //current state
        isAuthenticated: !isEmpty(action.payload), //payload is object of decoded user, if object is empty no authentification
        user: action.payload
      };
    default:
      return state;
  }
}
