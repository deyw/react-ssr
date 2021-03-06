
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import reducers from '../reducers';
import sagas from '../sagas';

export default function configureStore(history, initialState) {
  const sagaMiddleware = createSagaMiddleware(sagas);
  const reduxRouterMiddleware = routerMiddleware(history);
  const middlewares = [sagaMiddleware, reduxRouterMiddleware];

  const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
      : compose;

  const enhancer = composeEnhancers(
    applyMiddleware(...middlewares),
      // other store enhancers if any
  );

  const store = createStore(reducers, initialState, enhancer);

  // Hot reload
  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers').default));
    }
  }

  return store;
}
