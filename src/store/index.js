import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import createUser from "../reduces/createUser";
import currentUser from "../reduces/currentUser";
import otherUser from "../reduces/otherUser";

const stringMiddleware = () => (next) => (action) => {
  if (typeof action === "string") {
    return next({
      type: action,
    });
  }
  return next(action);
};

const store = createStore(
  combineReducers({ createUser, currentUser,otherUser }),
  compose(
    applyMiddleware(ReduxThunk, stringMiddleware),
    (window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()) ||
      compose
  )
);

export default store;
