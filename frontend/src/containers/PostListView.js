import React, { Component } from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid'
import withStyles from '@material-ui/core/styles/withStyles';

import PostListSection from './PostListSection';

import { saveScrollPosition } from '../actions/index'


// theme styles for responsive web design
const styles = theme => ({
    root: {
        maxWidth: 1300,
        margin: '0 auto',
        marginTop: 100,
        [theme.breakpoints.down('sm')]: {
            maxWidth: 1300,
            margin: '0 auto',
            marginTop: 60
        },
        [theme.breakpoints.down('xs')]: {
            maxWidth: 1300,
            margin: '0 auto',
            marginTop: 50
        }
    },
})

// stock list sub component
class PostListView extends Component {


    componentWillUnmount() {
        this.props.saveScrollPosition(this.props.location.pathname, { scrollX: window.scrollX, scrollY: window.scrollY })
    }

    render() {
        const { classes } = this.props


        return (
            <Grid container className={classes.root}>
                <PostListSection />
            </Grid>
        )
    }
}


const mapDispatchToProps = {
    saveScrollPosition,
};

export default connect(null, mapDispatchToProps)(withStyles(styles, { withTheme: true })(PostListView))