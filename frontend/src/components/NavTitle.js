import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';


const styles = theme => ({
    postListTitle: {
        marginTop: 20,
        paddingBottom: 10,
        borderTop: '3px solid black',
        [theme.breakpoints.up('md')]: {
            textAlign: 'right',
        },
        [theme.breakpoints.down('sm')]: {
            paddingTop: 5,
            paddingLeft: 10
        },
    },
    sortingSectionDivider: {
        borderTop: 'none',
        marginLeft: 90,
        [theme.breakpoints.down('sm')]: {
            marginLeft: 0,
            width: 80
        },
    },
    sortingSectionItem: {
        '&:hover': {
            color: 'black',
            cursor: 'pointer'
        }
    }
});


// navigation title component
class NavTitle extends Component {

    render() {
        const { title, classes } = this.props
        return (
            <div className={classes.postListTitle}>
                <Typography variant={'h6'}>
                    {title}
                </Typography>
            </div>
        )
    }
}



export default connect(null, null)(withStyles(styles, { withTheme: true })(NavTitle));