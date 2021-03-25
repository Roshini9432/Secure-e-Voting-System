import React,{useState,useEffect} from 'react';
import UserSession from './UserSession';
import { Redirect } from 'react-router-dom';
import {Link} from "react-router-dom";
import './CandidateVote.css';

function CandidateVote()
{
const [initialData,setInitialData]=useState([{}])
const [isDisabled,setisDisabled]=useState(false)
const [isSessionEnabled]=useState(Boolean(UserSession.getUser()))

useEffect(()=> {
    fetch('/api/fetchParties').then (
    response=>response.json()
).then(data => setInitialData(data))
}, []);

useEffect(() => {
    fetch('/api/voteStatus',{
        method: "POST",
        body: JSON.stringify({
          voter_id: UserSession.getUser(),
        }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        }
      })
      .then ( response=>response.json())
      .then(json => {
          setisDisabled(Boolean(json.status));
      })
  });

function handleVoteClick(value)
{
    const confirm = prompt('Type "Yes" to Vote');
    if(confirm==='Yes')
    {
        setisDisabled(true);
        fetch('/api/userVote',{
            method: "POST",
            body: JSON.stringify({
              party_id: value,
              voter_id: UserSession.getUser()
            }),
            headers: {
              "Content-Type": "application/json; charset=UTF-8"
            }
          })
           .catch(err => {
              console.log(err);
            })
        alert("Voted Successfully!");
        
    }
    else{
        alert("Voting Unsuccessful!");
    }
}
function destroyUserSession()
{
    UserSession.setUser("");
}
return(

<div className="App-header">
<h3>Parties List
<p>{isDisabled ? 'Successfully Voted' : 'Yet to Vote...'}</p>
<p>{isSessionEnabled ? '' :  <Redirect to='/Login'/>}</p>
</h3>
<section>
                        {initialData.map((party) => {
                            const partyId = party['party_id'];
                            const partyName = party['party_name'];
                            const candidateName = party['candidate_name'];
                            


                            return (
                                <div className="party-container" key={String(partyId)}>
                                    <p>
                                        <strong>Party ID:</strong> {partyId}
                                    </p>
                                    <p>
                                        <strong>Party Name:</strong> {partyName}
                                    </p>
                                   

                                    <p>
                                        <strong>Candidate Name:</strong>{candidateName}
                                    </p>
                                    <button className='btn' onClick={() => {handleVoteClick(partyId)}} disabled={isDisabled}>Vote</button>
                                    <hr/>
                                </div>
                                
                            );
                        })}
                    </section>
                    <br/>
                    <Link to='/Login' className="btn-logout" onClick={() => {destroyUserSession()}}>
                    Logout
                    </Link>
                    <br/><br/>
</div>

);

}
export default CandidateVote;