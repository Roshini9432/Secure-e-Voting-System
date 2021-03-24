import React,{useState,useEffect} from 'react';
import {Link } from "react-router-dom";
import './PublishResults.css';

function ResultDetails(props) {

    const [initialData,setInitialData]=useState([{}])

    useEffect(()=> {
        fetch('/api/fetchResults').then (
        response=>response.json()
    ).then(data => setInitialData(data))
    }, []);
 
  

  return (
    <div>
     {props.status ? 
    <section>
            {initialData.map((result) => {
                const partyId = result['party_id'];
                const count = result['count'];

                return (
                    <div className="party-container" key={String(partyId)}>
                        <p>
                            <strong>Party ID:</strong> {partyId}
                        </p>
                        <p>
                            <strong>Count:</strong> {count}
                        </p>
                        <hr/>
                    </div>
                    
                );
            })}
    </section>
     :
     ''
        }
    </div>
  );
}

export default ResultDetails;