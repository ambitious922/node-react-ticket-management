import React, { useCallback, useEffect, useState } from 'react';
import PageCard from './PageCard';
import { useDrop } from "react-dnd";
import { ItemTypes } from "../Utils/items";
import Api from "../api.js"

const styles = {
  width: 1000,
  height: 3000,
  border: '1px solid black',
  position: 'relative',
};


function PageTree({AddNewPageFunc}) {
  const [pages, setPages] = useState([]);
  const updatePageState = useCallback((droppedPage) => {
  console.log("updating the page state with x value: ",droppedPage.x)
  const updatedPages = pages.map(page => droppedPage._id == page._id ? droppedPage : page);
  console.log("updated pages ",updatedPages);
  setPages(updatedPages);
    }, [pages]);
  const [{isOver}, drop] = useDrop(() => ({
        accept: ItemTypes.PAGECARD,
        drop(page, monitor) {
            const delta = monitor.getDifferenceFromInitialOffset();
            let x = Math.round(page.x + delta.x);
            let y = Math.round(page.y + delta.y);
            page.x = x;
            page.y = y;
            saveUpdatedPage({x: x, y:y}, page._id);
            updatePageState(page);
            return undefined;
        },
    }), [updatePageState]);

    const saveUpdatedPage = (update, id) => {
        console.log("function called to update: ",update," for ",id);
        Api.withToken().post('/pageupdate/'+id,
            update
        ).then(function (response) {
            console.log("?worked ",response.data)
        }).catch(function (error) {
          console.log("page save failed for some reason: ",error.response);
        });
    }

    const overwritePage = (newPage, id) => {
      console.log("function called to overwrite: ",newPage);
      Api.withToken().post('/pageoverwrite/'+id,
          newPage
      ).then(function (response) {
          console.log("?worked ",response.data)
      }).catch(function (error) {
        console.log("page save failed for some reason: ",error.response);
      });
  }

    React.useEffect(() => {
      AddNewPageFunc.current = AddNewPage
    }, [pages])

    const AddNewPage = useCallback(() => {
      Api.withToken().post('/addblankpage/'
        ).then(function (response) {
          console.log("produced: ",response.data);
          setPages([...pages,response.data])
      }).catch(function (error) {
        console.log(error.response);
      });
    }, [pages]);

    function handleMaximise (page){
      //console.log("maximise ",page);
    }

    function handleCopy (page){
      //console.log("copy ",page);
    }

    const handleDeletedCallback = useCallback((deletedIndex) => {
      //I HAVE NO IDEA WHY I HAVE TO CALL SETPAGES TWICE, BUT THAT IS THE RULES, IT WON'T WORK IF YOU DON'T...
      setPages(pages.splice(deletedIndex, 1));
      setPages(pages);
    }, [pages]);

    const WidgetAddCallback = (widgets, pageID) => {
      console.log("widget callback fired requesting widgets ",widgets," for ID ",pageID)
      const newPageIndex = pages.findIndex(page => page._id === pageID);
      console.log("existing x in state during widgetCallback ",pages[newPageIndex].x);
      const updatedPage = Object.assign(pages[newPageIndex], {widgets: widgets});
      //saveUpdatedPage({widgets}, pageID);
      updatePageState(updatedPage);
    }

    useEffect(() => {
      Api.withToken().get('/pages/') //can add in a prop to return only a given tree once the app gets bigger
      .then(res => {
        setPages(res.data);
      })
    }, []);

  return (
      <div ref={drop} style={styles}>
          {pages.map((page, index) => (<PageCard page={page} id={page._id} key={page._id} index={index} widgetCallback ={WidgetAddCallback} deleteCallback={handleDeletedCallback} handleMaximise={() => handleMaximise(page)} handleCopy={() => handleCopy(page)}/>))}
          {pages.map((page, index) => (console.log("re-rendering page with index ",index,"page ",page)))}
      </div>
      )
}

export default PageTree;