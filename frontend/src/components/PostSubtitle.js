import React from 'react'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles';
import { timestampToDate } from '../utils/helper'
import { connect } from 'react-redux';

const styles = {
    categorySpan: {
        '&:hover': {
            fontWeight: 'bold',
            cursor: 'pointer',
            textDecoration: 'underline'
        }
    },
    folderOpen: {
        fontSize: 15,
        verticalAlign: 'text-top',
        marginRight: 8
    },
    verticalBar: {
        paddingLeft: 5,
        paddingRight: 5
    }
}

// news subtitle component
class PostSubtitle extends React.Component {

    render() {
        const { timestamp } = this.props
        return (
            <Typography variant="subtitle2" color="textSecondary" style={{ paddingBottom: 10 }}>
                Posted on {timestampToDate(timestamp)} 
            </Typography>
        )
    }
}



export default connect(null, null)(withStyles(styles)(PostSubtitle));