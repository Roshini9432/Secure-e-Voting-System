import React from 'react';
import {Link, Redirect} from "react-router-dom";
import UserSession from './UserSession';
import './Login.css';
import validator from 'validator';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;
const startTime = 'March 28 2021 00:00:00';
const deadline = 'March 28 2021 23:59:00';
const total = Date.parse(deadline) - Date.parse(new Date());
const start = Date.parse(startTime) - Date.parse(new Date());
class Login extends React.Component {
  static pin = '';
  constructor(props) {
    super(props);
    
    this.state = {
      voter_id: '',
      mail_id: '',
      password: '',
      passwordShown: false,
      authentication: 'Few Steps to Vote...',
      voter_id_status: '',
      mail_id_status: '',
      password_status: '',
      pin: '',
      user_session_voter_id : '',
      isEnabled : ((total>0 && start<0) ? true : false)
    };
    

    this.handleChangeVoterID = this.handleChangeVoterID.bind(this);
    this.handleChangeMailID = this.handleChangeMailID.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.togglePasswordVisiblity = this.togglePasswordVisiblity.bind(this);
    this.cancelCourse = this.cancelCourse.bind(this);
    this.createUserSession = this.createUserSession.bind(this);
  }



  handleChangeVoterID = async(event) => {
    await this.setState({voter_id: event.target.value});
    if(this.state.voter_id.length!==10)
    {
      await this.setState({authentication : 'VoterID length is Invalid'});
      this.setState({voter_id_status : ''});
    }
    else
    {
      await this.setState({authentication : 'Few Steps to Vote...'});
      this.setState({voter_id_status : 'true'});
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
      await this.setState({authentication : 'Few Steps to Vote...'});
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
      await this.setState({authentication : 'Few Steps to Vote...'});
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
    if(this.state.voter_id_status && this.state.mail_id_status && this.state.password_status)
    {
    fetch('/api/userCheck',{
      method: "POST",
      body: JSON.stringify({
        voter_id: this.state.voter_id,
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
              fetch('/api/verifyPin',{
                method: "POST",
                body: JSON.stringify({
                  voter_id: this.state.voter_id,
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
              this.setState({user_session_voter_id : this.state.voter_id});
              this.setState({voter_id: ''});
              this.setState({mail_id: ''});
              this.setState({password: ''});
            }

            else {
                this.setState({authentication : 'Login Unsuccessful...'})
            }
          }
          else {
            this.setState({authentication : 'Login Unsuccessful...'})
        }

        }
      }.bind(this)
    ,
    10000
    )
  }
  else
  {
    this.setState({authentication : 'Invalid Credentials'});
  }
}

  createUserSession(){
    UserSession.setUser(this.state.user_session_voter_id);
  }
 

  render() {
    return (
      <div> {this.state.isEnabled ?
      <div className="App-header">
        <h3>{this.state.authentication ?
        this.state.authentication
        :
        <Link to='/CandidateVote' className="btn" onClick={this.createUserSession}>Go to DashBoard</Link>
           
          }</h3>
      <form id="login-form" onSubmit={this.handleSubmit}>
        <label>Voter ID</label>
          <input type="text" value={this.state.voter_id} onChange={this.handleChangeVoterID} required/>
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
        <Link to='/ForgotPassword' className='makeLink'>Forgot Password?</Link>
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
export default Login;