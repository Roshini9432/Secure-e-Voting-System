import React from 'react';
import {Link } from "react-router-dom";
import './PublishResults.css';

function PublishResults() {
  const deadline = 'March 23 2021 20:42:00';
  const total = Date.parse(deadline) - Date.parse(new Date());
  function handlePublishResults()
  {
    const confirm = prompt('Type "Yes" to Publish Results');
    if(confirm==='Yes')
    {
    fetch('/api/publishResults',{
        method: "POST",
        body: JSON.stringify({
          election_id: 'election_1'
        }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        }
      })
       .catch(err => {
          console.log(err);
        })
    alert("Results Published!");
    }
    else{
        alert("Unsucessful!");
    }
  }

  return (
    <div className="App-header">
     <button className={(total<0) ? "btn" : "btn-disabled"} onClick={() => {handlePublishResults()}}>Publish Results</button>
     <br/><br/>
     <Link to='/HomePage' className="btn-back">
         Back
     </Link>
    </div>
  );
}

export default PublishResults;