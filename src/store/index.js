/* @flow */
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import reducers from '../reducers';
import sagas from '../sagas';

export default function configureStore(history: any, initialSTate: Object) {
  const sagaMiddleware = createSagaMiddleware(sagas);
  const reduxRouterMiddleware = routerMiddleware(history);
  const middlewares: Array<void> = [sagaMiddleware, reduxRouterMiddleware];
  // const enhancer = window.__REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__();

  const store = createStore(reducers, initialSTate, compose(
    applyMiddleware(...middlewares)
    // enhancer
  ));

  declare var module: {
    hot: {
      accept(path: string, callback: () => void): void;
    };
  };

  // Hot reload
  if (process.env.NODE_ENV === 'development') { 
    if (module.hot) {
      module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers').default));
    }
  }

  return store;
}