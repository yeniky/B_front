import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from 'redux/rootReducer';

const logger = createLogger();
const middlewares = [thunk];

const composeEnhancers =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true,
      traceLimit: 25,
    })) ||
  compose;

if (process.env.NODE_ENV === 'development') {
  // middlewares.push(logger);
}

export const Store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares))
);
