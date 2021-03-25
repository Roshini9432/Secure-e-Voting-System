import React, {useState } from 'react';
import {Link, Redirect} from "react-router-dom";
import ElectionCommissionSession from './ElectionCommissionSession';
import './PublishResults.css';

function PublishResults() {
  const [isResultPublished,setisResultPublished]=useState(false);
  const [isSessionEnabled]=useState(Boolean(ElectionCommissionSession.getOfficer()));
  const deadline = 'March 27 2021 09:00:00';
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
      .then (
        response=>response.json()
    )
      .then(json => {
        const status = json.status;
        if(status === 'YES')
        {
        setisResultPublished(true);
        alert("Results Already  Published!");
        }
        else
        {
          alert("Results Published!");
        }
      })
       .catch(err => {
          console.log(err);
        })
    }
    else{
        alert("Unsucessful!");
    }
  }

  function destroyElectionCommissionSession()
  {
    ElectionCommissionSession.setOfficer("");
  }

  return (
    <div>
    {isSessionEnabled ? '' :  <Redirect to='/LoginElectionCommission'/>}
    {isResultPublished ?
    <Redirect to='/HomePage' />
    :
    <div className="App-header">
     <button disabled={(total<0) ? false : true} className="btn" onClick={() => {handlePublishResults()}}>Publish Results</button>
     <br/><br/>
     <Link to='/LoginElectionCommission' className="btn-back" onClick={() => {destroyElectionCommissionSession()}}>
         Logout
     </Link>
    </div>
    }
    </div>
  );
}

export default PublishResults;