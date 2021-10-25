import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {React, useState} from 'react';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import { makeStyles } from '@mui/styles';
import { FormControlLabel, TextField } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { createStyles, ThemeProvider } from '@mui/material';
import { useHistory } from 'react-router';

const useStyles = makeStyles({
  field: {
    marginTop: 20,
    marginBottom: 20,
    display: 'block'
  }
})

export default function Create() {
  // const classes = useStyles();
  // const history = useHistory();
  // const [title, setTitle] = useState('');
  // const [details, setDetails] = useState('');
  // const [titleError, setTitleError] = useState(false);
  // const [detailsError, setDetailsError] = useState(false);
  // const [category, setCategory] = useState('todo')

  // const handleSubmit = (e) => {
  //   //preventing default because it is a form, and will refresh page on submit
  //   e.preventDefault()
  //   setTitleError(false);
  //   setDetailsError(false);
  //   if (title == ''){
  //     setTitleError(true);
  //   }
  //   if (details == ''){
  //     setDetailsError(true);
  //   }
  //   if (title && details) {
  //     fetch("http://localhost:8000/notes", {
  //       method: 'POST',
  //       headers: {"Content-type": "application/json"},
  //       body: JSON.stringify({title, details, category})
  //     }).then(() => history.push('/'))
  //   }
  // }

  // return (
  //     <Container size="sm">
  //       <Typography
  //         className={classes.field}
  //         variant="h6"
  //         color="textSecondary"
  //         component="h2"
  //         gutterBottom
  //       >
  //         Create a New Note
  //       </Typography>

  //       <form noValidate autoComplete="off" onSubmit={handleSubmit}>
  //         <TextField 
  //           onChange={(e) => setTitle(e.target.value)}
  //           className={classes.field}
  //           label="Note Title"
  //           variant="outlined"
  //           color="secondary"
  //           fullWidth
  //           required
  //           error={titleError}
  //         />
  //         <TextField 
  //           onChange={(e) => setDetails(e.target.value)}
  //           className={classes.field}
  //           label="details"
  //           variant="outlined"
  //           color="secondary"
  //           multiline
  //           rows={4}
  //           fullWidth
  //           required
  //           error={detailsError}
  //         />
  //         <FormControl className={classes.field}>
  //           <FormLabel>Category</FormLabel>
  //             <RadioGroup value={category} onChange={(e) => setCategory(e.target.value)}>
  //               <FormControlLabel value="money" control={<Radio />} label="Money" />
  //               <FormControlLabel value="todo" control={<Radio />} label="To Do" />
  //               <FormControlLabel value="reminders" control={<Radio />} label="Reminder" />
  //               <FormControlLabel value="work" control={<Radio />} label="Work" />
  //             </RadioGroup>
  //         </FormControl>
  //         <br />
  //         <Button
  //         type="submit"
  //         color="secondary"
  //         variant="contained"
  //         endIcon={<SendIcon />}
  //         >
  //           Submit
  //         </Button>
  //       </form>
  //     </Container>
  // )
}
