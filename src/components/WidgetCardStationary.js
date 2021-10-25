import { React } from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../Utils/items';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export default function WidgetCardStationary (props) {
    const { id, text, icon } = props;
    return (
            <Item
                id={props.id}
                className={props.className}
                icon={props.icon}
                text={props.text}
                onClick={props.onClick}
            >{props.icon} {props.text}
            </Item>
    )
}
