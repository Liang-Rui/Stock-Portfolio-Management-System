import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Button from '@material-ui/core/Button'
import MenuIcon from '@material-ui/icons/Menu'
import Home from '@material-ui/icons/Home';
import ArrowBack from '@material-ui/icons/ArrowBack'
import TrendingUp from '@material-ui/icons/TrendingUp';
import Equalizer from '@material-ui/icons/Equalizer';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle'
import AccountBox from '@material-ui/icons/AccountBox';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExitToApp from '@material-ui/icons/ExitToApp';
import CloseIcon from '@material-ui/icons/Close'
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline'
import InputAdornment from '@material-ui/core/InputAdornment';

import {
    toggleDrawer,
} from '../actions/index';

import {
    loginUser,
    registerUser,
    logoutUser,
    changeUserPassword,
    clearChangePassword
} from '../actions/userAuth';

import {
    getStockList,
    getPortfolio,
    getRecommendedStock
} from '../actions/portfolioActions';

import {getProfile} from '../utils/test'
import Image from '../logo.png';

// theme styles for responsive web design
const styles = theme => ({
    appbarMenuButton: {
        '&:hover': {
            backgroundColor: 'inherit',
            color: 'black'
        }
    },
    appBarMiddleContainer: {
        flexGrow: 1
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.grey['100']}`,
        backgroundColor: '#fafafa',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.05), 0 1px 1px rgba(0, 0, 0, 0.05)'
    },
    logo: {
        width: '9em',
        verticalAlign: 'top',
        paddingTop: 3,

    },
    logoButton: {
        '&:hover': {
            backgroundColor: 'inherit',
            opacity: 0.7
        }
    },
    nestedList: {
        paddingLeft: theme.spacing.unit * 4,
    },
    hideDrawerIcon: {
        '&:hover': {
            backgroundColor: 'inherit',
            color: 'black'
        }
    },
    drawerProfileContent: {
        paddingTop: 20,
        paddingLeft: 30,
    },
    drawerProfileCareer: {
        marginTop: `${theme.spacing.unit * 3}px`,
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: `0px ${theme.spacing.unit * 2}px 0px ${theme.spacing.unit * 2}px`
    },
    show: {
        transform: 'translate(0, 0)',
        transition: 'transform .5s',
    },
    hide: {
        transform: 'translate(0, -70px)',
        transition: 'transform .5s',
    },
    form: {
        width: '100%', // Fix IE 11 issue.

    },

})



class Topbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shouldShow: null,
            loginOpen: false,
            loginUserName: '',
            loginUserPassword: '',
            registerOpen: false,
            registerUserName: '',
            registerPassword: '',
            registerEmail: '',
            registerEmailNotValid: false,
            registerUserNameNotValid: false,
            accountDialogOpen: false,
            oldPasswordNotMatch: false,
            changePasswordOld: '',
            changePasswordNew: '',
            firstName: '',
            lastName: '',
            birthday: (new Date()).toISOString().substring(0,10),
            budget: 0,
            technology: false,
            media: false,
            finance: false

        }
        this.lastScroll = null;
        this.handleScroll = this.handleScroll.bind(this);
        this.handleAccountOpen = this.handleAccountOpen.bind(this);
        this.fetchUserProfile = this.fetchUserProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this)
   
    }

    componentDidMount() {

        window.addEventListener('scroll', this.handleScroll, { passive: true });
     
        getProfile().then( data => {
            this.setState({lastName:data[0] === undefined ? '' : data[0].lastName,
                                        firstName: data[0] === undefined ? '' : data[0].firstName,
                                        birthday:data[0] === undefined ? (new Date()).toISOString().substring(0,10) : data[0].birthday,
                                        budget:data[0] === undefined ? '' : data[0].budget})
        })
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        const lastScroll = window.scrollY;

        if (lastScroll === this.state.lastScroll) {
            return;
        }

        const shouldShow =
            this.lastScroll !== null ? (lastScroll < this.lastScroll || lastScroll === 0) : null;

        if (shouldShow !== this.state.shouldShow) {
            this.setState(prevState => ({
                ...prevState,
                shouldShow,
            }));
        }

        this.lastScroll = lastScroll;
    }

    getScrollClassName() {
        if (this.state.shouldShow === null) {
            return '';
        }

        return this.state.shouldShow
            ? this.props.classes.show
            : this.props.classes.hide;
    }


    toggleDrawer = () => () => this.props.toggleDrawer()
    handleGoHomeButton = () => () => this.props.toggleDrawer()

    handleLoginOpen = () => this.setState({ loginOpen: true })
    handleClose = () => this.setState({ loginOpen: false })

    handleRisterOpen = () => this.setState({ registerOpen: true, loginOpen: false })
    handleRisterClose = () => this.setState({ registerOpen: false })

    onChange = e => this.setState({ [e.target.name]: e.target.value });
    onLoginSubmit = e => {
        e.preventDefault();
        this.props.loginUser(this.state.loginUserName, this.state.loginUserPassword);
        setTimeout(()=> {
            this.props.getPortfolio()
            this.props.getStockList()
            this.props.getRecommendedStock()
        }, 500)
        
    };
    onRegisterSubmit = e => {
        e.preventDefault()
        if (!/[^0-9a-zA-Z@.+\-_]+/.test(this.state.registerUserName) && this.state.registerUserName !== '') {
            this.setState({ registerUserNameNotValid: false })
            if (/\S+@\S+\.\S+/.test(this.state.registerEmail)) {
                this.setState({ registerEmailNotValid: false })
                this.props.registerUser(this.state.registerUserName, this.state.registerEmail, this.state.registerPassword)
                setTimeout(()=> {
                    this.props.getPortfolio()
                    this.props.getStockList()
                    this.props.getRecommendedStock()
                }, 1000)
            } else {
                this.setState({ registerEmailNotValid: true })
            }
        } else {
            this.setState({ registerUserNameNotValid: true })
        }


    }

    handleLogout = () => {
        this.setState({ loginOpen: false, registerOpen: false })
        this.props.logoutUser()
        this.props.toggleDrawer()
    }



    handleAccountOpen = () => {
        this.setState({ accountDialogOpen: true })
    }

    handleAccountClose = () => {
        this.setState({ accountDialogOpen: false })
    }

    onChangePassword = e => {
        e.preventDefault();
        this.props.changeUserPassword(this.state.changePasswordOld, this.state.changePasswordNew)
    }

    fetchUserProfile = () => {
        const apiOption = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
            },
        }
        fetch("http://127.0.0.1:8000/getUserProfile/", apiOption)
        .then(response => response.json())
        .then(data => {
            return data
        })
    }

    updateProfile = e => {
        e.preventDefault();
        const apiOption = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('stockMasterUserToken')
            },
            body: JSON.stringify({ firstName: this.state.firstName, 
                lastName: this.state.lastName, 
                birthday: this.state.birthday, 
                budget: this.state.budget})

        }
        fetch("http://127.0.0.1:8000/updateUserProfile/", apiOption)
        .then(response => response.json())
        .then(data => {
            alert("Profile updated successfully!")
        })
    }

    render() {
        const {
            classes,
            leftDrawerOpened,
            authUser
        } = this.props;

        return (
            <Fragment>

   
                {/* Top app bar begins */}
                <AppBar position="fixed" color="default"
                    className={`${classes.appBar} ${this.getScrollClassName()}`}>
                    <Toolbar>
                        <IconButton onClick={this.toggleDrawer()} className={classes.appbarMenuButton}>
                            <MenuIcon />
                        </IconButton>

                        {/* logo button icon */}
                        <div className={classes.appBarMiddleContainer}>
                            <Button component={Link} to={'/'} disableRipple className={classes.logoButton}>
                            <img
                                    
                                    src={Image}
                                    style={{width:210,height:40}}
                                />
                            </Button>
                        </div>

                        {/* login button component */}
                        {authUser.token !== null ?
                            (<IconButton disabled>
                                <Avatar style={{ width: 32, height: 32 }}>
                                    {authUser.user.username[0]}
                                </Avatar>
                            </IconButton>) :
                            (<Button color="inherit" onClick={this.handleLoginOpen}>Login</Button>)}


                        {/* login user dialog */}
                        <Dialog open={this.state.loginOpen && authUser.token === null}

                            style={{ textAlign: 'center' }}>
                            <DialogContent>
                                <AccountCircle style={{ fontSize: '-webkit-xxx-large', margin: 10 }} />

                                <Typography variant="h5" >
                                    Sign In
                                </Typography>
                                <form noValidate onSubmit={this.onLoginSubmit}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="loginUserName"
                                        label="User Name"
                                        name="loginUserName"
                                        autoComplete="user name"
                                        autoFocus
                                        onChange={this.onChange}
                                    />

                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="loginUserPassword"
                                        label="Password"
                                        type="password"
                                        id="loginUserPassword"
                                        autoComplete="current-password"
                                        onChange={this.onChange}
                                    />
                                    <Typography variant='caption' style={{ color: 'red' }}>

                                    </Typography>
                                    {authUser.loginError && (
                                        <Typography variant='caption' style={{ color: 'red' }}>
                                            Username or password is wrong!
                                    </Typography>)}

                                    {authUser.isFetching ? (<CircularProgress style={{ marginTop: 20 }} />) :
                                        (<Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            style={{ marginTop: 20 }}
                                        >
                                            Sign In
                                    </Button>)}


                                    <Button
                                        onClick={this.handleRisterOpen}
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        style={{ marginTop: 20 }}
                                    >
                                        Don't have an account? Sign Up
                                    </Button>
                                </form>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose} color="primary">
                                    Cancel
                                </Button>

                            </DialogActions>
                        </Dialog>

                        {/* register user component */}
                        <Dialog open={this.state.registerOpen && authUser.token === null}
                            style={{ textAlign: 'center' }}>

                            <DialogContent>
                                <AccountCircle style={{ fontSize: '-webkit-xxx-large', margin: 10 }} />

                                <Typography variant="h5" >
                                    Sign Up
                                </Typography>
                                <form className={classes.form} noValidate onSubmit={this.onRegisterSubmit}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="registerUserName"
                                        label="User Name"
                                        name="registerUserName"
                                        autoComplete="user name"
                                        autoFocus
                                        onChange={this.onChange}
                                        error={this.state.registerUserNameNotValid}
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="registerEmail"
                                        label="Email Address"
                                        name="registerEmail"
                                        autoComplete="email"
                                        onChange={this.onChange}
                                        error={this.state.registerEmailNotValid}
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="registerPassword"
                                        label="Password"
                                        type="password"
                                        id="registerPassword"
                                        autoComplete="current-password"
                                        onChange={this.onChange}
                                    />
                                    {this.state.registerUserNameNotValid && (
                                        <Typography variant='caption' style={{ color: 'red' }}>
                                            Username is not valid!
                                    </Typography>)}

                                    {this.state.registerEmailNotValid && (
                                        <Typography variant='caption' style={{ color: 'red' }}>
                                            Email is not valid!
                                    </Typography>)}

                                    {authUser.registerError && (
                                        <Typography variant='caption' style={{ color: 'red' }}>
                                            Username already exists!
                                    </Typography>)}

                                    {authUser.registerFetching ? (<CircularProgress style={{ marginTop: 20 }} />) :
                                        (<Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            style={{ marginTop: 20 }}
                                        >
                                            Sign Up
                                    </Button>)}
                                </form>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleRisterClose} color="primary">
                                    Cancel
                                </Button>

                            </DialogActions>
                        </Dialog>



                    </Toolbar>
                </AppBar>
                {/* Top app bar ends */}


                {/* Left drawer begins */}
                <Drawer open={leftDrawerOpened} onClose={this.toggleDrawer()}>
                    <List>
                        <ListItem>
                            <ListItemSecondaryAction>
                                <IconButton aria-label="hide-drawer" className={classes.hideDrawerIcon} onClick={this.toggleDrawer()}>
                                    <ArrowBack fontSize="small" />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>


                        <Grid container justify="center" alignItems="center">
                            <Avatar style={{ margin: 10, width: 50, height: 50, fontSize: 'larger' }}>
                                {authUser.user === null ? 'S' : authUser.user.username[0]}
                            </Avatar>

                        </Grid>
                        <Grid container justify="center" alignItems="center">
                            <Typography variant='h6' style={{ fontWeight: 600 }}>
                                {authUser.user === null ? 'Stock Master' : authUser.user.username}
                            </Typography>
                        </Grid>
                        <Grid container justify="center" alignItems="center">
                            <Typography variant='caption' style={{ color: '#0000008a', paddingBottom: 20 }}>
                                {authUser.user === null ? 'v1.0.0' : authUser.user.email}
                            </Typography>
                        </Grid>


                        <Divider />

                        <Dialog  fullScreen open={this.state.accountDialogOpen} onClose={this.handleAccountClose} >
                            <AppBar style={{ position: 'relative', backgroundColor: '#fafafa' }}>
                                <Toolbar>
                                    <IconButton edge="start" color="default" onClick={this.handleAccountClose} aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                </Toolbar>
                            </AppBar>

                            <div>
                                <Typography variant='h6' style={{ fontWeight: 300, marginTop: 20, marginLeft: 25, marginBottom: 5 }}>
                                    Change Password:
                            </Typography>
                            </div>

                                
                            {/* change password form component */}
                            <form  className={classes.form} noValidate onSubmit={this.onChangePassword}>
                                <div style={{
                                    maxWidth: 400,
                                    borderRadius: 8,
                                    marginLeft: 20,
                                    marginRight:20
                                }}>
                                    <div>
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="changePasswordOld"
                                            label="Old Password"
                                            type="password"
                                            name="changePasswordOld"
                                            autoComplete="password"
                                            onChange={this.onChange}
                                            error={this.state.oldPasswordNotMatch}
                                            style={{ marginLeft: 20, paddingRight: 100 }}
                                        />
                                    </div>

                                    <div>
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="changePasswordNew"
                                            label="New Password"
                                            type="password"
                                            name="changePasswordNew"
                                            autoComplete="password"
                                            onChange={this.onChange}
                                            style={{ marginLeft: 20, paddingRight: 100 }}
                                        />
                                    </div>
                                    {authUser.changePasswordFailed && (
                                        <Typography variant='caption' style={{ color: 'red', marginLeft: 20 }}>
                                            Old password not correct!
                                    </Typography>)}
                                    <div>
                                        {authUser.changePasswordFetching ? (
                                            <CircularProgress style={{ marginTop: 20, marginLeft: 20, marginBottom: 20 }} />) :
                                            (<Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                style={{ marginTop: 20, marginLeft: 20, width: 150, marginBottom: 20, backgroundColor: '#4285f4' }}
                                            >
                                                Submit
                                    </Button>)}
                                    </div>
                                </div>
                            </form>


                            <div>
                                <Typography variant='h6' style={{ fontWeight: 300, marginTop: 20, marginLeft: 25, marginBottom: 5 }}>
                                    My Profile:
                            </Typography>
                            </div>

                            {/* user profile component */}
                            <form className={classes.form} noValidate onSubmit={this.updateProfile} style={{marginBottom:30}}>
                                <div style={{
                                    maxWidth: 400,
                                    background: '#fafafa',
                                    border: '1px solid #dadce0',
                                    borderRadius: 8,
                                    marginLeft: 20,
                                    marginRight:20
                                }}>
                                    <div>
                                        <TextField
                                            margin="normal"
                               
                                            fullWidth
                                            id="firstName"
                                            label="First Name"
                                            name="firstName"
                                            defaultValue={this.state.firstName}
                                        
                                            onChange={this.onChange}

                                            style={{ marginLeft: 20, paddingRight: 100 }}
                                        />
                                    </div>
                                    <div>
                                        <TextField
                                            margin="normal"
                                            fullWidth
 
                                            id="lastName"
                                            label="Last Name"
                                            name="lastName"
                                            defaultValue={this.state.lastName}
                                           
                                            onChange={this.onChange}

                                            style={{ marginLeft: 20, paddingRight: 100 }}
                                        />
                                    </div>
                                    <div>
                                        <TextField
                                            margin="normal"
                                            
                                            fullWidth
                                            id="birthday"
                                            label="Birthday"
                                            type="date"
                                            name="birthday"
                                            defaultValue={this.state.birthday}
                                            onChange={this.onChange}
                                            style={{ marginLeft: 20, paddingRight: 100 }}
                                        />
                                    </div>

                                    <div>
                                    <TextField
                                        id="budget"
                                        fullWidth
                                        label="Budget"
                                        name='budget'
                                        defaultValue={this.state.budget}
                                        InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                        style={{ marginLeft: 20, paddingRight: 100, marginTop: 16 }}
                                        onChange={this.onChange}
                                    />
                                    </div>

                                   {/* save button */}
                                    <div>
                                        {authUser.changePasswordFetching ? (
                                            <CircularProgress style={{ marginTop: 20, marginLeft: 20, marginBottom: 20 }} />) :
                                            (<Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                style={{ marginTop: 20, marginLeft: 20, width: 150, marginBottom: 20, backgroundColor: '#4285f4' }}
                                            >
                                                Save
                                    </Button>)}
                                    </div>
                                </div>
                            </form>
                        </Dialog>

                         {/* successfully save password dialog */}
                        <Dialog open={authUser.changePasswordSuccess}>
                            <Grid container justify="center" alignItems="center" style={{
                                height: 160,
                                background: '#c1ffc1'
                            }}>
                                <CheckCircleOutline style={{
                                    width: 80,
                                    height: 80,
                                    color: 'limegreen'
                                }} />
                            </Grid>
                            <Grid container justify="center" alignItems="center">
                                <DialogTitle>
                                    {'Success!'}
                                </DialogTitle>
                            </Grid>
                            <DialogContent>
                                <DialogContentText >
                                    You have successfully changed your password!
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.props.clearChangePassword}>
                                    OK
                                </Button>
                            </DialogActions>
                        </Dialog>


                        {/* left drawer list component */}
                        <ListItem button component={Link} to={'/'} style={{ marginTop: 15 }} onClick={this.handleGoHomeButton()}>
                            <ListItemIcon>
                                <Home />
                            </ListItemIcon>
                            <ListItemText inset primary='HOME' />
                        </ListItem>

                        {authUser.token !== null && (
                            <ListItem button onClick={this.handleAccountOpen}>
                                <ListItemIcon>
                                    <AccountBox />
                                </ListItemIcon>
                                <ListItemText inset primary='My Account' />
                            </ListItem>)}



                        <ListItem style={{ marginTop: 15, paddingBottom: 0 }}>
                            <ListItemText primary='My Apps' style={{ borderLeft: '2px solid', paddingLeft: 15, borderLeftColor: 'lightgrey' }} />
                        </ListItem>



                        {/* left drawer list component */}
                        <div style={{ paddingTop: 20, minWidth: 260 }}>
                            <ListItem button 
                            component={Link}
                            to={'/portfolio'}
                            onClick={this.toggleDrawer()}
                            >
                                <ListItemIcon>
                                    <Equalizer />
                                </ListItemIcon>
                                <ListItemText inset primary='My Portfolio' />
                            </ListItem>
                            <ListItem button
                                component={Link}
                                to={'/detail'}
                                onClick={this.toggleDrawer()}
                            >
                                <ListItemIcon>
                                    <TrendingUp />
                                </ListItemIcon>
                                <ListItemText inset primary='Stock Detail' />
                            </ListItem>
                            {authUser.token !== null && (
                                <ListItem button onClick={this.handleLogout}>
                                    <ListItemIcon>
                                        <ExitToApp />
                                    </ListItemIcon>
                                    <ListItemText inset primary='Logout' />
                                </ListItem>)}
                        </div>

                    </List>
                </Drawer>
                {/* Left drawer ends */}
            </Fragment>

        )
    }
}


const mapStateToProps = state => ({
    leftDrawerOpened: state.leftDrawer.leftDrawerOpened,
    authUser: state.authUser
})

const mapDispatchToProps = {
   
    toggleDrawer,
    loginUser,
    registerUser,
    logoutUser,
    changeUserPassword,
    clearChangePassword,
    getPortfolio,
    getStockList,
    getRecommendedStock
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Topbar));
