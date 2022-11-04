import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import spotReducer from "./spot"
import reviewReducer from "./review"
const rootReducer = combineReducers({
	session: sessionReducer,
	spots: spotReducer,
	reviews: reviewReducer
});

let enhancer;
// move logger back down to else statement
if (process.env.NODE_ENV === "production") {
	const logger = require("redux-logger").default;
	enhancer = applyMiddleware(thunk, logger);
} else {
	const logger = require("redux-logger").default;
	const composeEnhancers =
	window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	enhancer = composeEnhancers(applyMiddleware(thunk, logger));

}

const configureStore = (preloadedState) => {
	return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
