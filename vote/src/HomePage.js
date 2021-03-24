import React from 'react';
import {Link } from "react-router-dom";
import logo from './logo.png';
import vote from './vote.png';
import './HomePage.css';

function HomePage() {
  const deadline = 'March 25 2021 20:42:00';
  const total = Date.parse(deadline) - Date.parse(new Date());

  return (
    <div className="App-header">
     <h1>Welcome!<br/>Your Voice <img src={vote} className="Voting-icon" alt="vote" /> Your Vote</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <br/>
        
        <Link to='/PublishResults' className="btn">
          Election Commission
        </Link>
        <br/>
        <Link to='/Login' className={(total>0) ? "btn" : "btn-disabled"}>
          Voting Canditate
        </Link>
        <br/>
        <Link to='/ViewResults' className="btn">
          View Results
        </Link>
        <br/><br/>
    </div>
  );
}

export default HomePage;