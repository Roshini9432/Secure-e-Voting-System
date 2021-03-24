import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './HomePage';
import Login from './Login';
import PublishResults from './PublishResults';
import ViewResults from './ViewResults';
import ForgotPassword from './ForgotPassword';
import CandidateVote from './CandidateVote';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path='/'>
         <HomePage />
        </Route>
        <Route exact path='/Login'>
         <Login />
        </Route>
        <Route exact path='/HomePage'>
         <HomePage />
        </Route>
        <Route exact path='/ForgotPassword'>
         <ForgotPassword />
        </Route>
        <Route exact path='/CandidateVote'>
         <CandidateVote />
        </Route>
        <Route exact path='/PublishResults'>
         <PublishResults />
        </Route>
        <Route exact path='/ViewResults'>
         <ViewResults />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
