import { GET_ERRORS } from '../actions/types';
const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload; //includes err.response.data from authAction
    default:
      return state;
  }
}
