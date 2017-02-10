import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import reducer from '../reducers';
import sagas from '../sagas';

const sagaMiddleware = createSagaMiddleware(sagas);
const middlewares = [thunk, sagaMiddleware];

const enhancer = applyMiddleware(...middlewares);

const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__(),
    enhancer
  );

export default store;
