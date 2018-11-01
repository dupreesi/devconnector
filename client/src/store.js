import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

// A store holds the whole state tree of your application.
// The only way to change the state inside it is to dispatch an action on it.
// A store is not a class. It's just an object with a few methods on it.
// To create it, pass your root reducing function to createStore.


const initialState = {};
const middleware = [thunk];

//store function
// 1st element reducer
const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
