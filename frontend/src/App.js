import React, { Component } from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { BrowserRouter } from 'react-router-dom'
import Main from './containers/Main'
import './App.css';
import ScrollTop from './components/ScrollTop'

import PropTypes from 'prop-types';
import ReactGA from 'react-ga';


ReactGA.initialize('UA-134429967-1');

class GAListener extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  componentDidMount() {
    this.sendPageView(this.context.router.history.location);
    this.context.router.history.listen(this.sendPageView);
  }

  sendPageView(location) {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }

  render() {
    return this.props.children;
  }
}

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#fff'
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: "warnock-pro,Palatino,\"Palatino Linotype\",\"Palatino LT STD\",\"Book Antiqua\",Georgia,serif"
  },
});

// main application entry
class App extends Component {
  render() {
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <BrowserRouter>
            <GAListener>
              <ScrollTop>
                <Main />
              </ScrollTop>
            </GAListener>
          </BrowserRouter>
        </MuiThemeProvider>
      </div>

    );
  }
}

export default App;




