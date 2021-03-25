import React from 'react';
import {Link} from "react-router-dom";
import ResultDetails from './ResultDetails'
import './ViewResults.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
     isResultPublished: false
    };    
  }
  componentDidMount(){
    fetch('/api/checkStatus',{
      method: "POST",
      body: JSON.stringify({
       election_id : 'election_1'
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    })
    .then(response => response.json())
    .then(json => {
      const status = json.status;
      this.setState({isResultPublished : Boolean(status)});
    })
     .catch(err => {
        console.log(err);
      })
}


  render() {
    return (
      <div className="App-header">
          <h1>{this.state.isResultPublished ? 'Results Published' : 'Results Yet to Publish'}</h1>
        <br/>
        <ResultDetails status={this.state.isResultPublished ? 'true' : ''} />
        <Link to='/HomePage' className="btn-back">
        Back
        </Link>
        <br/>
      </div>
    );
  }
}
export default Login;