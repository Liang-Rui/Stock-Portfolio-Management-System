import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';
import PostPreview from './PostPreview'

// theme styles for responsive web design
const sytles = theme => ({
    firstPost: {
        marginBottom: 20,
        [theme.breakpoints.up('sm')]: {
            padding: 20,
        },
        [theme.breakpoints.down('sm')]: {
            margin: 10,
            padding: 15,
        },
        '&:hover': {
            boxShadow: '0 0 5px rgba(0,0,0,.2)'
        },
    },
    posts: {
        marginTop: 20,
        marginBottom: 20,
        [theme.breakpoints.up('sm')]: {
            padding: 20,
        },
        [theme.breakpoints.down('sm')]: {
            margin: 10,
            padding: 15,
        },
        '&:hover': {
            boxShadow: '0 0 5px rgba(0,0,0,.2)'
        },
    }
})

// news card component for news
const PostCard = ({ post, index, classes }) => {
    return (
        <Fragment>
            <Grid item xs={12} container className={index === 0 ? classes.firstPost : classes.posts}>
                <Grid item xs={12}>
                    <PostPreview TopBorder={false} post={post} />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
        </Fragment>
    )

}

export default withStyles(sytles, { withTheme: true })(PostCard)