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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    var now = new Date();
    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    function goHome () {
        window.location.assign("/Home");
    }

    function goReset () {
        window.location.assign("/updatePassword");
    }

    function handleSubmit(event) {
        Api.noToken().post('/users/login', {
            email: email,
            password: password,
            resetDate: Math.floor(((now / 8.64e7) - 150.604166666))
        })
        .then(function (response) {
            if(response.status === 204){
            goReset()
            }
            else{
            window.sessionStorage.setItem("token", response.data.token)
            goHome()
            }
        })
        .catch(function (error) {
            alert("Invalid username or password")
        });
        event.preventDefault();
    }

    return (
            <form onSubmit={handleSubmit}>
                <Grid>
                    <Paper elevation={10} style={paperStyle}>
                        <Grid align='center'>
                            <Avatar style={avatarStyle}><LockIcon/></Avatar>
                            <h2>Sign In</h2>
                        </Grid>
                        <TextField label='Username' placeholder='Enter username' fullWidth required onChange={e => setEmail(e.target.value)}/>
                        <TextField label='Password' placeholder='Enter password' type='password' fullWidth required onChange={e => setPassword(e.target.value)}/>
                        <FormControlLabel
                            control={
                            <Checkbox
                                name="checkedB"
                                color="primary"
                            />
                            }
                            label="Remember me"
                        />
                        <Button type='submit' disabled={!validateForm()} color='primary' variant="contained" style={btnstyle} fullWidth>Sign in</Button>
                        <Typography >
                            <Link href="#" >
                                Forgot password ?
                        </Link>
                        </Typography>
                        <Typography > Do you have an account ?
                            <Link href="#" >
                                Sign Up 
                        </Link>
                        </Typography>
                    </Paper>
                </Grid>
            </form>
        )
}