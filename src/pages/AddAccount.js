import React, { useState } from "react";
import { Grid,Paper, Avatar, TextField, Button, Typography,Link } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Api from "../api.js"
import LockIcon from '@mui/icons-material/Lock';

export default function Login(props) {
    const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}
    const [name, setName] = useState("");
    const [emailOne, setEmailOne] = useState("");
    const [emailTwo, setEmailTwo] = useState("");
    const [passwordOne, setPasswordOne] = useState("");
    const [passwordTwo, setPasswordTwo] = useState("");
    const [open, setOpen] = React.useState(false);
    var submitted = false

    function validateForm () {
        if(submitted){
        if(validateFormComplete()&&checkPasswordsMatch()&&checkEmailsMatch()){
          return false
        }
        else{
          return true
        }
      }
    }

    function validateFormComplete() {
        if(
              name.length > 0 
              && emailOne.length > 0
              && emailTwo.length > 0
              && passwordOne.length > 0
              && passwordTwo.length > 0
        ){
          //do nothing
        }
        else{
          if(name.length === 0 
            && emailOne.length === 0
            && emailTwo.length === 0
            && passwordOne.length === 0
            && passwordTwo.length === 0){
              //do nothing, they just opened the page
            }
          else{
            alert("Please enter all the fields on the sign up form")
          }
        }
        return name.length > 0 
              && emailOne.length > 0
              && emailTwo.length > 0
              && passwordOne.length > 0
              && passwordTwo.length > 0;
    }   


    function checkPasswordsMatch() {
        if(
              passwordOne === passwordTwo
        ){
          //move on to check that the password is at least 8 characters
          if(passwordOne.length<8){
          alert("sorry, the password must be at least 8 characters long");
          return false
          }
          else{
            //all good, it is 8 or more characters
          }
        }
        else{
          alert("Sorry, those passwords don't match")
        }
        return passwordOne === passwordTwo;
    }


    function checkEmailsMatch() {
        if(
              emailOne === emailTwo
        ){
          //do nothing
        }
        else{
          alert("Sorry, those emails don't match")
        }
        return emailOne === emailTwo;
    }


    const handleClose = () => {
        setOpen(false);
        window.location.assign("/Home");
      };
  
      const handleOpen = () => {
        setOpen(true);
      };
  
    function handleSubmit(event) {
        submitted = true
        if(!validateForm()){
        Api.noToken().post('/users', {
              name: name,
              email: emailOne,
              password: passwordOne
          })
          .then(function (response) {
              handleOpen();
          })
          .catch(function (error) {
              alert("Something has gone wrong, most likely that password was not accepted by the password hasher. Try something a little stronger")
          });
          event.preventDefault();
        }
        else{
          //do nothing, they will get an alert
        }
    }

    return (
            <form onSubmit={handleSubmit}>
                <Grid>
                    <Paper elevation={10} style={paperStyle}>
                        <Grid align='center'>
                            <Avatar style={avatarStyle}><LockIcon/></Avatar>
                            <h2>Sign Up</h2>
                        </Grid>
                        <TextField label='Name' placeholder='Enter name' fullWidth required onChange={e => setName(e.target.value)}/>
                        <TextField label='Email' placeholder='Enter email' fullWidth required onChange={e => setEmailOne(e.target.value)}/>
                        <TextField label='Confirm Email' placeholder='Re-enter email' fullWidth required onChange={e => setEmailTwo(e.target.value)}/>
                        <TextField label='Set Password' placeholder='Set password' type='password' fullWidth required onChange={e => setPasswordOne(e.target.value)}/>
                        <TextField label='Confirm Password' placeholder='Re-enter password' type='password' fullWidth required onChange={e => setPasswordTwo(e.target.value)}/>
                        <Button type='submit' disabled={validateForm()} color='primary' variant="contained" style={btnstyle} fullWidth>Sign Up</Button>
                        <Typography > Do you have already have an account ?
                            <Link href="/login" >
                                Sign In 
                        </Link>
                        </Typography>
                    </Paper>
                </Grid>
            </form>
        )
}