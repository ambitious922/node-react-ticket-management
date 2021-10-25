import { makeStyles } from '@mui/styles';
import React from 'react';
import { Typography, Drawer, List, ListItemText, ListItem, ListItemIcon, Avatar, Grid } from '@mui/material';
import { AccountTreeOutlined, WebOutlined, PlaylistPlay, CreditCard, TableRows, NewReleases, HelpOutline, Medication, FormatListBulleted, MenuBookOutlined, AddTask, AssignmentLate, BackupTable, TableView, AddLink, Elderly, CleanHands } from '@mui/icons-material';
import { useHistory, useLocation } from 'react-router';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import WidgetCard from './WidgetCardDraggable';
import WidgetCardStationary from './WidgetCardStationary';
import { ItemTypes } from '../Utils/items';
import PageTree from './PageTree';

const drawerWidth = 440;

const useStyles = makeStyles((theme) => {
    return{
        page: {
            background: '#F9F9F9',
            width: '100%',
            padding: theme.spacing(3),
        },
        drawer: {
            width: drawerWidth
        },
        drawerPaper: {
            width: drawerWidth
        },
        root: {
            display: "flex",
            flexDirection: "row-reverse",
        },
        active: {
            background: '#f4f4f4'
        },
        title: {
            padding: theme.spacing(2),
        },
        subtitle: {
            padding: theme.spacing(2),
            textDecoration: "underline"
        },
        appbar: {
            display: "flex",
            flexDirection: "row-reverse",
        },
        toolbar: theme.mixins.toolbar,
        origAppbar: theme.mixins.drawer,
        date: {
            paddingRight: drawerWidth,
        },
        name: {
            position: "absolute",
            left: 10
        },
        bar: {
            display: "flex",
            flexDirection: "row-reverse",
        },
        avatar: {
            position: "absolute",
            marginRight: theme.spacing(2)
        },
        icon: {
            verticalAlign: "middle"
        },
        grid: {
            paddingLeft: 10,
            paddingRight:10
        }
        // mixins grabs all the default values from the theme for a thing so you can use that in other things (aka drop the content by the height of the toolbar)
        //could totes also just use flex
    }
})

export default function Layout({ children }) {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const AddNewPageFunc = React.useRef(null)

    const menuItems = [
        {
            text: "Start a New Pathway",
            icon: <PlaylistPlay color="secondary"/>,
            path: '/'
        },
        {
            text: "Create Branch",
            icon: <AccountTreeOutlined color="secondary"/>,
            path: '/'
        }
    ]

    const commonWidgets = [
        {
            icon: <CreditCard className={classes.icon} />,
            text: "Header Segment",
            id: "Header"
        },
        {
            icon: <NewReleases className={classes.icon} color="secondary"/>,
            text: "Alert Text",
            id: "Alert"
        },
        {
            icon: <HelpOutline className={classes.icon} />,
            text: "Question Text",
            id: "Question"
        },
        {
            icon: <TableRows className={classes.icon} />,
            text: "Lengthy Description Text",
            id: "LongDescription"
        },
        {
            icon: <PlaylistPlay className={classes.icon} />,
            text: "Decision Option",
            id: "Option"
        },
        {
            icon: <BackupTable className={classes.icon} />,
            text: "Table",
            id: "Table"
        },
        {
            icon: <Medication className={classes.icon} />,
            text: "Treatment Section",
            id: "Treatment"
        },
        {
            icon: <AddTask className={classes.icon} />,
            text: "Approval Code",
            id: "ApprovalCode"
        },
        {
            icon: <AssignmentLate className={classes.icon} />,
            text: "Referral",
            id: "Referral"
        },
        {
            icon: <FormatListBulleted className={classes.icon} />,
            text: "Footer Text",
            id: "Footer"
        },
        {
            icon: <MenuBookOutlined className={classes.icon} />,
            text: "References",
            id: "References"
        },
        {
            icon: <AddLink className={classes.icon} />,
            text: "Internal/External Link",
            id: "Link"
        }
    ]

    const uncommonWidgets = [
        {
            icon: <BackupTable className={classes.icon} color="secondary"/>,
            text: "Adult Vancomycin Dosing Table",
            id: "AdultVancTable"
        },
        {
            icon: <BackupTable className={classes.icon} color="primary"/>,
            text: "Paediatric Vancomycin Dosing Table",
            id: "KidsVancTable"
        },
        {
            icon: <TableView className={classes.icon} color="secondary"/>,
            text: "Adult Gentamicin Dosing Table",
            id: "AdultGentTable"
        },
        {
            icon: <TableView className={classes.icon} color="primary"/>,
            text: "Paediatric Gentamicin Dosing Table",
            id: "KidsGentTable"
        },
        {
            icon: <Elderly className={classes.icon}/>,
            text: "Aminoglycoside Precautions Table",
            id: "AminoPrecautionsTable"
        },
        {
            icon: <CleanHands className={classes.icon}/>,
            text: "MRSA risk factors table",
            id: "MRSARiskTable"
        }
    ]

    return(
        <div className={classes.root}>
            {/* The classname set as root to allow flex so the drawer makes up part of the page (stuff doesn't go under it) */}
            
            {/* Cheeky trick here, an empty div with the same dimensions as the toolbar */}
            <div className={classes.origAppbar}></div>
            <AppBar className={classes.appbar} elevation={0}>
                <Toolbar className={classes.bar}>
                    <Typography className={classes.date}>
                        Today is the { format(new Date(), 'do MMMM Y') }
                    </Typography>
                    <Avatar src="/img/kraken.png" className={classes.avatar}/>
                    <Typography className={classes.name}>
                        Tentacles - Clinical Decision Development Tool
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                anchor="right"
                classes={{ paper: classes.drawerPaper}}
            >
                <div>
                    <Typography variant="h5" className={classes.title}>
                        Page Builder
                    </Typography>
                </div>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1} className={classes.grid}>
                        <Grid item item xs={6} key="navList">
                            <List>
                                {menuItems.map((item) => (
                                    <ListItem 
                                    button
                                    key={item.text}
                                    onClick={() => history.push(item.path)}
                                    className={location.pathname == item.path ? classes.active : null}
                                    >
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                        <Grid item item xs={6}>
                            <br/> 
                            <WidgetCardStationary
                                key="extraSideButtons"
                                id="addPage"
                                icon={<WebOutlined color="secondary"/>}
                                className="addPage"
                                text="Add New Page"
                                onClick={() => AddNewPageFunc.current()}
                            />
                        </Grid>
                    </Grid>
                </Box>        
                <div>
                    <Typography variant="h6" className={classes.subtitle}>
                        Common Page Widgets
                    </Typography>
                </div>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1} className={classes.grid}>
                        {commonWidgets.map((widget) => (
                            <Grid item item xs={6} key={widget.text}>
                                <WidgetCard 
                                id={widget.id}
                                key={widget.text}
                                icon={widget.icon}
                                text={widget.text}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <div>
                <Typography variant="h6" className={classes.subtitle}>
                    Uncommon Page Widgets
                </Typography>
                </div>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1} className={classes.grid}>
                        {uncommonWidgets.map((uncommonWidget) => (
                            <Grid item item xs={6} key={uncommonWidget.text}>
                                <WidgetCard 
                                id={uncommonWidget.id}
                                key={uncommonWidget.text}
                                icon={uncommonWidget.icon}
                                text={uncommonWidget.text}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Drawer>
            <div className={classes.page}>
                {/* Cheeky trick there, an empty div with the same dimensions as the toolbar */}
                <div className={classes.toolbar}></div>
                    <PageTree AddNewPageFunc={AddNewPageFunc} pages={[]}/>
            </div>
        </div>
    )
}