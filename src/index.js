import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from 'firebase';
import * as serviceWorker from './serviceWorker';
// import { connect } from 'react-redux';
// import { increment,reset ,predict ,decibel,position,login_init} from './reducers/actions';

//redux
import logger from 'redux-logger'
import { createStore ,applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers'



firebase.initializeApp({
  apiKey: "AIzaSyArjWo5Zn0rn15T9fC4k6lClqItrtMete0",
  authDomain: "did-care.firebaseapp.com",
  projectId: "did-care",
  storageBucket: "did-care.appspot.com",
  messagingSenderId: "5630868304",
  appId: "1:5630868304:web:334382c4dc74a94c7aca55",
  measurementId: "G-LXWZFTG96L"
});

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
