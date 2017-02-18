import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import reducers from '../reducers';
import sagas from '../sagas';

// const sagaMiddleware = createSagaMiddleware(sagas);
// const middlewares = [thunk, sagaMiddleware];

// const enhancer = applyMiddleware(...middlewares);

// const store = createStore(
//     reducer,
//     window.__REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__(),
//     enhancer
//   );


export default function configureStore(history, initialSTate) {
  const sagaMiddleware = createSagaMiddleware(sagas);
  const reduxRouterMiddleware = routerMiddleware(history);
  const middlewares = [sagaMiddleware, reduxRouterMiddleware];
  // const enhancer = window.__REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__();

  const store = createStore(reducers, initialSTate, compose(
    applyMiddleware(...middlewares)
    // enhancer
  ));

    // Hot reload
  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers').default));
    }
  }

  return store;
}
