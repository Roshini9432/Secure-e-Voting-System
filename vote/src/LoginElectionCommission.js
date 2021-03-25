import React from 'react';
import {Link, Redirect} from "react-router-dom";
import ElectionCommissionSession from './ElectionCommissionSession';
import './LoginElectionCommission.css';
import validator from 'validator';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;
const deadline = 'March 27 2021 11:05:00';
const total = Date.parse(deadline) - Date.parse(new Date());
class LoginElectionCommission extends React.Component {
  static pin = '';
  constructor(props) {
    super(props);
    
    this.state = {
      election_commission_id: '',
      mail_id: '',
      password: '',
      passwordShown: false,
      authentication: 'Few Steps to Login...',
      election_commission_id_status: '',
      mail_id_status: '',
      password_status: '',
      pin: '',
      electionCommission_session_election_commission_id : '',
      isEnabled : (total>0 ? true : false)
    };
    

    this.handleChangeElectionCommissionID = this.handleChangeElectionCommissionID.bind(this);
    this.handleChangeMailID = this.handleChangeMailID.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.togglePasswordVisiblity = this.togglePasswordVisiblity.bind(this);
    this.cancelCourse = this.cancelCourse.bind(this);
    this.createElectionCommissionSession = this.createElectionCommissionSession.bind(this);
  }



  handleChangeElectionCommissionID = async(event) => {
    await this.setState({election_commission_id: event.target.value});
    if(this.state.election_commission_id.length!==10)
    {
      await this.setState({authentication : 'Officer ID length is Invalid'});
      this.setState({electionCommision_id_status : ''});
    }
    else
    {
      await this.setState({authentication : 'Few Steps to Login...'});
      this.setState({electionCommission_id_status : 'true'});
    }
  }
  handleChangeMailID = async(event) => {
    await this.setState({mail_id: event.target.value});
    if(!validator.isEmail(this.state.mail_id))
    {
      await this.setState({authentication : 'Invalid Mail Format'});
      this.setState({mail_id_status : ''});
    }
    else
    {
      await this.setState({authentication : 'Few Steps to Login...'});
      this.setState({mail_id_status : 'true'});
    }
  }
  handleChangePassword = async(event) => {
    await this.setState({password: event.target.value});
    if(this.state.password.length<10)
    {
      await this.setState({authentication : 'Password length is Invalid'});
      this.setState({password_status : ''});
    }
    else if(this.state.password.length>15)
    {
      await this.setState({authentication : 'Password length exceeds'});
      this.setState({password_status : ''});
    }
    else
    {
      await this.setState({authentication : 'Few Steps to Login...'});
      this.setState({password_status : 'true'});
    }
  }

  togglePasswordVisiblity(){
    this.setState({passwordShown: this.state.passwordShown ? false : true});
  }
  cancelCourse(){ 
    this.setState({voter_id: ''});
    this.setState({mail_id: ''});
    this.setState({password: ''});
  }
  handleSubmit = async(event) => {
    event.preventDefault();
    if(this.state.electionCommission_id_status && this.state.mail_id_status && this.state.password_status)
    {
    fetch('/api/electionCommissionCheck',{
      method: "POST",
      body: JSON.stringify({
        election_commission_id: this.state.election_commission_id,
        mail_id: this.state.mail_id,
        password: this.state.password
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    })
    .then(response => response.json())
    .then(json => {
      const status = json.status;
      this.setState({authentication : status});
    })
     .catch(err => {
        console.log(err);
      })
    setTimeout ( function() {
        if(this.state.authentication === 'Super Pin Sent...' || !Boolean(this.state.authentication))
        {
          this.setState({pin : prompt("Enter the Super-Pin\n(Valid only for 3 minutes)")});
          if(this.state.pin !== null)
          {
            if(this.state.pin.length===6 )
            {
              fetch('/api/verifyPinElectionCommission',{
                method: "POST",
                body: JSON.stringify({
                  election_commission_id: this.state.election_commission_id,
                  pin: this.state.pin
                }),
                headers: {
                  "Content-Type": "application/json; charset=UTF-8"
                }
              })
              .then(response => response.json())
              .then(json => {
                const status = json.status;
                this.setState({authentication : status});
              })
              .catch(err => {
                  console.log(err);
                })
              this.setState({electionCommission_session_election_commission_id : this.state.election_commission_id});
              this.setState({election_commission_id: ''});
              this.setState({mail_id: ''});
              this.setState({password: ''});
            }

            else {
                this.setState({authentication : 'Login Unsuccessful...'})
            }
          }

        }
        else
        {
          this.setState({authentication : 'Invalid Credentials'});
        }
      }.bind(this)
    ,
    10000
    )
  }
}

  createElectionCommissionSession(){
    ElectionCommissionSession.setOfficer(this.state.electionCommission_session_election_commission_id);
  }
 

  render() {
    return (
      <div> {this.state.isEnabled ?
      <div className="App-header">
        <h3>{this.state.authentication ?
        this.state.authentication
        :
        <Link to='/PublishResults' className="btn" onClick={this.createElectionCommissionSession}>Go to DashBoard</Link>
           
          }</h3>
      <form id="login-electionCommission-form" onSubmit={this.handleSubmit}>
        <label>Officer ID</label>
          <input type="text" value={this.state.election_commission_id} onChange={this.handleChangeElectionCommissionID} required/>
        <br/><br/>
        <label>Mail ID</label>
          <input type="mail" value={this.state.mail_id} onChange={this.handleChangeMailID} required/>
        <br/><br/>
        <div className="pass-wrapper">
        <label>Password</label>
          <input type={this.state.passwordShown ? "text" : "password"} value={this.state.password} onChange={this.handleChangePassword} title='Password should be minimum of 10 characters' required/><i onClick={this.togglePasswordVisiblity} >{eye}</i>
        </div>
        <br/>
        <center>
        <Link to='/ForgotPasswordelectionCommission' className='makeLink'>Forgot Password?</Link>
        <br/><br/>
        <input type="submit" value="Login" />
        <br/><br/>
        <input type="reset" value="Reset" onClick={this.cancelCourse} />
        <br/><br/>
        <Link to='/HomePage' className="btn">
        Back
        </Link>
        </center>
      </form>
      </div>
      :
      <Redirect to='/HomePage' />
      }
      </div>
    );
  }
}
export default LoginElectionCommission;