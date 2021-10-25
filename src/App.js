import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Notes from './components/PageTree'
import Create from './pages/Create'
import Login from './pages/Login'
import AddAccount from './pages/AddAccount'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import Layout from './components/Layout';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'
import './styling/app.css';

const theme = createTheme({
  //THEMES ARE THE DEVIL. NEVER USE THEMES
  // palette: {
  //   primary: {
  //     main: '#fefefe'
  //   },
  //   secondary: purple
  // },
  // typography: {
  //   fontWeightLight: 400,
  //   fontWeightRegular: 500,
  //   fontWeightMedium: 600,
  //   fontWeightBold: 700,
  // }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <Router>
            <Switch>
              <Route exact path="/">
                <Notes />
              </Route>
              <Route path="/create">
                <Create />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/addAccount">
                <AddAccount />
              </Route>
            </Switch>
          <Layout>
          </Layout>
        </Router>
      </DndProvider>
    </ThemeProvider>
  );
}

export default App;
