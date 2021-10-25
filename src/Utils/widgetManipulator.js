import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { makeStyles } from '@mui/styles';
import { red } from '@mui/material/colors';
import { Draggable } from 'react-beautiful-dnd';

const useStyles = makeStyles({
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
        float: 'left'
    },
    expandButton: {
        float: 'right'
    }
  })

export default function GetWidget(widgetProp) {
    const classes = useStyles(widgetProp)
    return(
            <Card className={classes.widget}>
                {ConvertWidgetForPage(widgetProp)}
            </Card>
            )
}

function ConvertWidgetForPage(widgetProp){
    switch(widgetProp.id){
        case "Header": 
            return(
                <CardContent>
                    <Typography variant="h6">{widgetProp.headerText == undefined ? "Header Text..." : widgetProp.headerText}</Typography>
                </CardContent>             
            )
        case "Alert": 
            return(
                <CardContent>
                    <Typography variant="subtitle2">{widgetProp.alertText == undefined ? "Warning..." : widgetProp.alertText}</Typography>
                </CardContent>
            )
        case "Question":
            return(
                <CardContent>
                    <Typography variant="subtitle2">{widgetProp.questionText == undefined ? "Question for user to answer..." : widgetProp.questionText}</Typography>
                </CardContent>
            )
        default:
            return;
    }
}


    // {
    //     icon: <HelpOutline className={classes.icon} />,
    //     text: "Question Text",
    //     id: "Question"
    // },
    // {
    //     icon: <TableRows className={classes.icon} />,
    //     text: "Lengthy Description Text",
    //     id: "LongDescription"
    // },
    // {
    //     icon: <PlaylistPlay className={classes.icon} />,
    //     text: "Decision Option",
    //     id: "Option"
    // },
    // {
    //     icon: <BackupTable className={classes.icon} />,
    //     text: "Table",
    //     id: "Table"
    // },
    // {
    //     icon: <Medication className={classes.icon} />,
    //     text: "Treatment Section",
    //     id: "Treatment"
    // },
    // {
    //     icon: <AddTask className={classes.icon} />,
    //     text: "Approval Code",
    //     id: "ApprovalCode"
    // },
    // {
    //     icon: <AssignmentLate className={classes.icon} />,
    //     text: "Referral",
    //     id: "Referral"
    // },
    // {
    //     icon: <FormatListBulleted className={classes.icon} />,
    //     text: "Footer Text",
    //     id: "Footer"
    // },
    // {
    //     icon: <MenuBookOutlined className={classes.icon} />,
    //     text: "References",
    //     id: "References"
    // },
    // {
    //     icon: <AddLink className={classes.icon} />,
    //     text: "Internal/External Link",
    //     id: "Link"
    // }

    // {
    //     icon: <BackupTable className={classes.icon} color="secondary"/>,
    //     text: "Adult Vancomycin Dosing Table",
    //     id: "AdultVancTable"
    // },
    // {
    //     icon: <BackupTable className={classes.icon} color="primary"/>,
    //     text: "Paediatric Vancomycin Dosing Table",
    //     id: "KidsVancTable"
    // },
    // {
    //     icon: <TableView className={classes.icon} color="secondary"/>,
    //     text: "Adult Gentamicin Dosing Table",
    //     id: "AdultGentTable"
    // },
    // {
    //     icon: <TableView className={classes.icon} color="primary"/>,
    //     text: "Paediatric Gentamicin Dosing Table",
    //     id: "KidsGentTable"
    // },
    // {
    //     icon: <Elderly className={classes.icon}/>,
    //     text: "Aminoglycoside Precautions Table",
    //     id: "AminoPrecautionsTable"
    // },
    // {
    //     icon: <CleanHands className={classes.icon}/>,
    //     text: "MRSA risk factors table",
    //     id: "MRSARiskTable"
    // }