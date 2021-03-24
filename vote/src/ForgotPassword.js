import React from 'react';
import {Link } from "react-router-dom";
import './ForgotPassword.css';
import validator from 'validator';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      voter_id: '',
      mail_id: '',
      password: '',
      confirm_password: '',
      passwordShown: false,
      confirm_passwordShown: 'false',
      authentication: 'Provide the Details...',
      voter_id_status: '',
      mail_id_status: '',
      password_status: '',
      confirm_password_status: ''
      
    };

    this.handleChangeVoterID = this.handleChangeVoterID.bind(this);
    this.handleChangeMailID = this.handleChangeMailID.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeConfirmPassword = this.handleChangeConfirmPassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.togglePasswordVisiblity = this.togglePasswordVisiblity.bind(this);
    this.toggleConfirmPasswordVisiblity = this.toggleConfirmPasswordVisiblity.bind(this);
    this.cancelCourse = this.cancelCourse.bind(this);
  }

  handleChangeVoterID = async(event) => {
    await this.setState({voter_id: event.target.value});
    if(this.state.voter_id.length!==10)
    {
      this.setState({authentication : 'VoterID length is Invalid'});
      this.setState({voter_id_status : ''});
    }
    else
    {
      this.setState({authentication : 'Provide the Details...'});
      this.setState({voter_id_status: 'true'});
    }
  }
  handleChangeMailID = async(event) => {
    await this.setState({mail_id: event.target.value});
    if(!validator.isEmail(this.state.mail_id))
    {
      this.setState({authentication : 'Invalid Mail Format'});
      this.setState({mail_id_status : ''});
    }
    else
    {
      this.setState({authentication : 'Provide the Details...'});
      this.setState({mail_id_status : 'true'});
    }
  }
  handleChangePassword = async(event) => {
    await this.setState({password: event.target.value});
    if(this.state.password.length<10)
    {
      this.setState({authentication : 'Password length is Invalid'});
      this.setState({password_status : ''});
    }
    else if(this.state.password.length>15)
    {
      this.setState({authentication : 'Password length exceeds'});
      this.setState({password_status : ''});
    }
    else
    {
      this.setState({authentication : 'Provide the Details...'});
      this.setState({password_status : 'true'});
    }
  }
  handleChangeConfirmPassword = async(event) => {
    await this.setState({confirm_password: event.target.value});
    if(this.state.password !== this.state.confirm_password)
    {
      this.setState({authentication : 'Confirm Password Mismatched'});
      this.setState({confirm_password_status : ''});
    }
    else
    {
      this.setState({authentication : 'Provide the Details...'});
      this.setState({confirm_password_status : 'true'});
    }
  }

  togglePasswordVisiblity(){
    this.setState({passwordShown: this.state.passwordShown ? false : true});
  }
  toggleConfirmPasswordVisiblity(){
    this.setState({confirm_passwordShown: this.state.confirm_passwordShown ? false : true});
  }
  cancelCourse(){ 
    this.setState({mail_id: ''});
    this.setState({password: ''});
    this.setState({confirm_password: ''});
  }
  handleSubmit(event) {
    event.preventDefault();
    if(this.state.voter_id_status && this.state.mail_id_status && this.state.password_status && this.state.confirm_password_status )
    {
      fetch('/api/forgotPassword',{
        method: "POST",
        body: JSON.stringify({
          voter_id: this.state.voter_id,
          mail_id: this.state.mail_id,
          password: this.state.password,
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
        this.setState({voter_id: ''});
        this.setState({mail_id: ''});
        this.setState({password: ''});
        this.setState({confirm_password: ''});
    }
    else
    {
      this.setState({authentication : 'Invalid Credentials'});
    }
  }
 

  render() {
    return (
      <div className="App-header">
        <h3>{this.state.authentication ?
        this.state.authentication
        :
        'Password Changed Successfully'
           
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
          <input type={this.state.passwordShown ? "text" : "password"} value={this.state.password} onChange={this.handleChangePassword} required/><i onClick={this.togglePasswordVisiblity} >{eye}</i>
        </div>
        <br/>
        <div className="pass-wrapper">
        <label>Confirm Password</label>
          <input type={this.state.confirm_passwordShown ? "text" : "password"} value={this.state.confirm_password} onChange={this.handleChangeConfirmPassword} required/><i onClick={this.toggleConfirmPasswordVisiblity} >{eye}</i>
        </div>
        <br/>
        <center>
        <input type="submit" value="Change Password" />
        <br/><br/>
        <input type="reset" value="Reset" onClick={this.cancelCourse} />
        <br/><br/>
        <Link to='/Login' className="btn">
        Back
        </Link>
        </center>
      </form>
      </div>
    );
  }
}
export default Login;