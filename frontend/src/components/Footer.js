import React, {Component} from 'react'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import withStyles from '@material-ui/core/styles/withStyles';


// theme styles for responsive web design
const styles = theme => ({
    footer: {
        backgroundColor: theme.palette.background.paper,
        marginTop: theme.spacing.unit * 8,
        padding: `${theme.spacing.unit * 6}px 0 ${theme.spacing.unit * 3}px 0`,
      },
    footerDivider: {
        [theme.breakpoints.down('md')]: {
            padding: '0 3%'
        },
    },
    footerContent: {
        paddingTop: 20,
        [theme.breakpoints.down('md')]: {
            padding: '0 4%',
            paddingTop: 20,
        },
    }

})

// footer component on all the pages
class Footer extends Component {
    render() {
        const {classes} = this.props
        return (
            <footer className={classes.footer}>
                <Grid container style={{ maxWidth: 1000, margin: '0 auto'}}>
                    <Grid item xs={12} className={classes.footerDivider}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" align="center" color="textSecondary" component="p" className={classes.footerContent}>
                            Built with <a href="https://www.django-rest-framework.org" rel="noopener noreferrer" target="_blank">Django REST Framework</a> | <a href="https://reactjs.org" rel="noopener noreferrer" target="_blank">React</a> | <a href="https://redux.js.org" rel="noopener noreferrer" target="_blank">Redux</a> | <a href="https://material-ui.com" rel="noopener noreferrer" target="_blank">Material-UI</a>
                        </Typography>
                    </Grid>  
                </Grid>
            </footer>
        )
    }
}


export default withStyles(styles, { withTheme: true })(Footer)