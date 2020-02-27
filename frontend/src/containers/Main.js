import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import TopBar from './TopBar';
import PostListView from './PostListView';
import Footer from '../components/Footer';
import StockPortfolioView from './StockPortfolioView'
import StockDetailView from './StockDetailView'



// main component to router between different pages
class Main extends Component {

    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <TopBar />
                <Switch>
                    <Route exact path='/' component={PostListView} />
                    <Route exact path='/detail' component={StockDetailView} />
                    <Route exact path='/portfolio' component={StockPortfolioView} />
                </Switch>
                <Footer />
            </React.Fragment>
        )
    }
}

export default Main;