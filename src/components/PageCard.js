import React, { useCallback, useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { fabClasses, IconButton, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { blue, green, pink, red } from '@mui/material/colors';
import { ItemTypes } from '../Utils/items';
import { useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { DeleteOutlined, SdCardAlert, AccountTreeOutlined, WebOutlined, PlaylistPlay, CreditCard, TableRows, NewReleases, HelpOutline, Medication, FormatListBulleted, MenuBookOutlined, AddTask, AssignmentLate, BackupTable, TableView, AddLink, Elderly, CleanHands, SettingsOverscan } from '@mui/icons-material';
import GetWidget from '../Utils/widgetManipulator';
import Api from "../api.js"


const useStyles = makeStyles({
    avatar: {
        backgroundColor: (page) => {
            if(page.category == 'work'){
                return red[700]
            }
            if(page.category == "money"){
                return green[500]
            }
            if(page.category == "todo"){
                return pink[500]
            }
            return blue[500]
        }
    },
    withCoords: {
        position: "absolute",
        top: (page) => {return page.y},
        left: (page) => {return page.x},
        border: (page) => {
            if (page.category == 'work') {
              return '1px solid red'
            }
        },
        width: 250,
        height: 400,
    },
    cardBoard: {
        display: "flex",
        flexDirection: 'column',
        margin: 'auto'
    },
    cardBacking: {
        position: 'absolute',
        backgroundColor: "rgb(150, 195, 205)",
        width: '100%',
        top: 40,
        bottom: 20,
    },
    widget: {
        display: 'flex',
        paddingTop: 5,
        marginTop: 5,
        transition: '0.2s',
        '&:hover': {
            boxShadow: '0 0 5',
        },
    },
    deleteButton: {
        padding: 0
    },
    expandButton: {
        padding: 0
    },
    topHeader: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        padding: 0
    }
  })

export default function PageCard({ page, onDrop, index, deleteCallback, widgetCallback }) {
    const classes = useStyles(page);
    const [_id, setID] = useState(page._id);
    const [x, setX] = useState(page.x);
    const [y, setY] = useState(page.y);
    const [title, setTitle] = useState(page.title);
    const [details, setDetails] = useState(page.details);
    const [category, setCategory] = useState(page.category);
    const [pageTag, setPageTag] = useState(page.pageTag);
    const [widgets, setWidgets] = useState(page.widgets);
    const [owner] = useState(page.owner);
    const [createdAt] = useState(page.createdAt);
    const [updatedAt] = useState(page.updatedAt);
    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: ItemTypes.PAGECARD,
        item: { 
            title:page.title,
            details:page.details,
            category:page.category,
            owner:page.owner,
            createdAt: page.createdAt,
            updatedAt: page.updatedAt,
            pageTag:page.pageTag,
            _id:page._id,
            x:page.x,
            y:page.y,
            widgets: page.widgets},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [_id, x, y ,title, details, category, owner, createdAt, updatedAt, pageTag, widgets]);

    const updateWidgets = useCallback((newWidgets, _id) => {
        console.log("x from widgetUpdate is ",page.x);
        console.log("y from widgetUpdate is ",page.y);
        setWidgets(newWidgets);
        widgetCallback(newWidgets,_id);
          }, [page.widgets]);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.FRESHWIDGET,
        drop(item, monitor) {
            const newWidgets = widgets == undefined ? [item] : [...widgets,item];
            updateWidgets(newWidgets, _id);
            return undefined;
        },
        // collect: (monitor) => ({
        //     isOver: monitor.isOver(),
        //     canDrop: monitor.canDrop(),
        // }),
    }), [updateWidgets]);

    
    // React.useEffect(() => {
    //     setWidgets(page.widgets);
    //     setX(page.x);
    //     setY(page.y);
    //   }, [page]);

    //this is the beautify react DND reorder function, not the drop new widget from over on the layout function
    function handleOnDragEnd(result) {
        if (!result.destination) return;
        const items = Array.from(widgets);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setWidgets(items);
        //widgetCallback(items,_id);
      }

    const handleDelete = async (_id, index) => {
    console.log("Delete this page!");
        Api.withToken().post('/deletepages/'+_id
        ).then(function (response) {
            console.log("worked to delete: ",response.data.title);
            deleteCallback(index);
        }).catch(function (error) {
        //console.log(error);
        });
    }

    const saveUpdatedWidgets = async (update, _id) => {
        console.log("function called to update widgets: ",update," for ",_id);
        Api.withToken().post('/pageupdate/'+_id,
            update
        ).then(function (response) {
            console.log("?worked ",response.data)
        }).catch(function (error) {
          console.log("page save failed for some reason: ",error.response);
        });
    }

    return(
        <Card 
            ref={drag}
            className={classes.withCoords}
            elevation={3}
            id={_id}
            key={page._id}
        >
            <div className={classes.topHeader}>
                <IconButton onClick={() => handleDelete(_id, index)} className={classes.deleteButton}>
                    <DeleteOutlined />
                </IconButton>
                <IconButton onClick={() => handleDelete(_id, index)} className={classes.expandButton}>
                    <SettingsOverscan />
                </IconButton>
            </div>
            <CardContent
                ref={drop}
                bg= {isOver ? green[500] : green[200]}
            >
                <div className={classes.cardBacking}>
                    <Typography variant="h6">{page.pageTag}</Typography>
                    <br/>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId={page.pageTag}>
                            {(provided) => (
                                <div className={classes.cardBoard} {...provided.droppableProps} ref={provided.innerRef}>
                                    {(widgets == undefined || widgets == []) ? null : widgets.map((widget, index) => {
                                        return (
                                            <Draggable key={index} draggableId={widget.id == undefined ? "fakeID" : widget.id} index={index}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    {GetWidget(widget)}
                                                </div>
                                            )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </CardContent>
        </Card>
    )
}