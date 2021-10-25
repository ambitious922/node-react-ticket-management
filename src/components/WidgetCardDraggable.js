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

export default function WidgetCardDraggable (props) {
    const { id, text, icon } = props;
    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: ItemTypes.FRESHWIDGET,
        item: {
            "id":props.id, 
            "text":props.text,
            "icon":props.icon},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [id, text, icon]);
    return (
            <Item
                id={props.id}
                ref={drag}
                className={props.className}
                icon={props.icon}
                text={props.text}
            >{props.icon} {props.text}
            </Item>
    )
}
