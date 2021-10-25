import React from "react";
import { makeStyles } from '@mui/styles';
import PageTree from "../components/PageTree";
import CustomDragLayer from "../components/CustomDragLayer";


const useStyles = makeStyles((theme) => {
    return{
        board: {
            display: "flex",
            width: '100%',
            height: 5000,
            background: '#ffd9b3'
        },
      }
  });

function Board(props) {
    const classes = useStyles();
    return(
        <div 
            className={classes.board}
        >
            <PageTree/>
			<CustomDragLayer/>
            {/* { props.children } */}
        </div>
    )
}

export default Board