import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import { connect } from 'react-redux';
// import { increment,reset ,predict ,decibel,position,login_init} from './reducers/actions';

//redux
import logger from 'redux-logger'
import { createStore ,applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers'

const store = createStore(rootReducer,applyMiddleware(logger))
// const store = createStore(rootReducer)

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

const Costutility = () => (
  <Provider store={store} >
    <App />
  </Provider>
)

ReactDOM.render(<Costutility />, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
