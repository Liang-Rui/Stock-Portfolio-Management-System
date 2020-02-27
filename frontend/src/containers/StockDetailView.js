
import React, { Fragment } from 'react';
import StockDetailChart from './StockDetailChart';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import LoadingBounce from '../components/LoadingBounce'
import Grid from '@material-ui/core/Grid';
import NavTitle from '../components/NavTitle'
import Typography from '@material-ui/core/Typography';
import PostCard from '../components/PostCard'
import Button from '@material-ui/core/Button'
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';


import {
    getStock,
    predictHistory,
    getNews,
    loadMoreNews,
    searchNews,
    loadMoreSearchNews
} from '../actions/portfolioActions';

import {
    Legend,ScatterChart,Scatter,LabelList,
    ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,Brush  
} from 'recharts';


// theme styles for responsive web design
const styles = theme => ({
    root: {
        marginTop: 80,
        [theme.breakpoints.down('sm')]: {
            marginTop: 90
        },
        [theme.breakpoints.down('xs')]: {
            marginTop: 80
        }
    },
    postDetailContainer: {
        maxWidth: 1800,
        margin: '0 auto',
    },
    postContentContainer: {
        padding: '0px 50px',
        [theme.breakpoints.down('sm')]: {
            padding: '0px 20px',
        }
    },
    navTitle: {
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 20,
        paddingBottom: 30,
        [theme.breakpoints.up('md')]: {
            paddingLeft: 30,
            paddingRight: 60
        },
    },
    tradingList2: {
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize:"small",
        [theme.breakpoints.down('sm')]: {
            padding: '30px 20px',
            fontSize:"small",
        }
    },
    loadMoreButtonContainer: {
        paddingTop: 20,
        paddingLeft: 15
    },
    loadMoreButton: {
        color: 'gray',
        '&:hover': {
            backgroundColor: 'white',
            opacity: '0.6'
        }
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: '#ededed',
        '&:hover': {
          opacity: '0.9'
        },
        marginLeft: 20,
        marginBottom: 30,
        width: 300,
        borderColor: 'black',
        [theme.breakpoints.down('sm')]: {
          width: 'auto',
          marginLeft: 20,
          marginRight: 20,
          marginBottom: 30,
        },
      },
      searchIcon: {
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
      },
      inputRoot: {
        color: 'inherit',
      },
      inputInput: {
        width: '100%',
        marginLeft: 10,
      },

})

// stock detail component
class ChartComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            searchKeyword: ''
        }
    }


    searchInput = e => this.setState({searchKeyword: e.target.value})

    searchNews = () => {
        this.props.searchNews(this.props.portfolio.currentStockDetailSymbolShort, encodeURIComponent(this.state.searchKeyword.trim()), 1)
    }


    render() {
        const { classes, portfolio, authUser } = this.props;


        if (authUser.token === null) {
            return (<Grid xs={12} style={{paddingTop: 100, paddingBottom: 450}}>
                <LoadingBounce />
            </Grid>)
        }


        return (
            <div className={classes.root}>
                <Grid container className={classes.postDetailContainer}>
                    <Grid container >
                        {/* stock detail symbol title component */}
                        {portfolio.currentStockDetailSymbol !== null && (
                        <Fragment>
                            <Grid item xs={12} md={2} className={classes.navTitle}>
                                <NavTitle title={portfolio.currentStockDetailSymbol} />
                            </Grid>
                            <Grid item xs={12} md={10} ></Grid>
    
                        </Fragment>)}
                        
                        {/* stock detail data component */}
                        <Grid item xs={12} container>
                            {portfolio.currentStockDeatilData === undefined || portfolio.currentStockDeatilData.length === 0 || portfolio.getStockRequest || portfolio.predictHistoryRequest || portfolio.predictFutureRequest ? (
                                <Grid item xs={12}>
                                    <LoadingBounce />
                                </Grid>) : (
                                    <Fragment>
                                    
                                        <Grid container xs={12}>

                                        {/* nav title component */}
                                        <Grid item xs={12}>
                                            <Typography variant="h5" gutterBottom align='center'>
                                                    Future Prediction
                                            </Typography>
                                        </Grid>
                                        
                                        <Grid item xs={1}></Grid>
                                        
                                        {/* future prediction chart */}
                                        <Grid item xs={10} style={{height: 300, marginTop: 20, paddingLeft: 5, paddingRight: 30}} className={classes.tradingList2}>
                                            
                                            <ResponsiveContainer style={{width: "99%"}}>
                                                <ComposedChart height={300} data={portfolio.predictFuture}
                                                        >
                                                    <defs>
                                                
                                                        <linearGradient id="colorPv" >
                                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.2}/>
                                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis dataKey="date" />
                                                    <YAxis domain={[dataMin => ((Math.abs(dataMin) * 0.2) < 0 ? 0 : (Math.abs(dataMin) * 0.2).toFixed(0)), dataMax => ((dataMax * 1.3).toFixed(0)) ]}/>
                                                    <Tooltip/>
                                                    <Legend verticalAlign="top" wrapperStyle={{paddingBottom: 30, paddingLeft: 30}} />
                                                    <CartesianGrid stroke='#f5f5f5'/>
                                                    <Line type='monotone' dataKey='outsample_yhat' stroke='#0000ff' name='Outsample Predict Price' dot={false} />
                                                    <Line type='monotone' dataKey='insample_yhat' stroke='darkblue' name='Insample Predict Price' dot={false} />
                                                    <Line type='monotone' dataKey='insample_y' stroke='darkred' name='Insample Stock Close Price' dot={false} />
                                                    <Area dataKey="insample_confidence_region" stroke="lightgray" fill="lightgray"  strokeDasharray="5 5" />
                                                    <Area dataKey="outsample_confidence_region" stroke="#2196f3" fill="#2196f3"  strokeDasharray="5 5" opacity={0.5}/>
                                                    <Brush dataKey='date' height={30} stroke="#B5B3BE" />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        </Grid>
                                        
                                        <Grid item xs={1}></Grid>
                                        {/* nav title */}
                                        <Grid item xs={12}>
                                            <Typography variant="h5" gutterBottom style={{paddingTop:60}} align='center'>
                                                    History Prediction Cross Validation
                                            </Typography>
                                        </Grid>
                                        
                                        <Grid item xs={1}></Grid>
                                        {/* historical prediction chart */}
                                        <Grid item xs={10} style={{height: 300, marginTop: 20, paddingLeft: 5, paddingRight: 30}} className={classes.tradingList2}>
                                            
                                            <ResponsiveContainer style={{width: "99%"}}>
                                                <ComposedChart height={300} data={portfolio.predictHistory}
                                                        >
                                                    <defs>
                                                
                                                        <linearGradient id="colorPv" >
                                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.2}/>
                                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis dataKey="date" />
                                                    <YAxis domain={[dataMin => ((Math.abs(dataMin) * 0.2) < 0 ? 0 : (Math.abs(dataMin) * 0.2).toFixed(0)), dataMax => ((dataMax * 1.3).toFixed(0)) ]}/>
                                                    <Tooltip/>
                                                    <Legend verticalAlign="top" wrapperStyle={{paddingBottom: 30, paddingLeft: 30}} />
                                                    <CartesianGrid stroke='#f5f5f5'/>
                                                    <Line type='monotone' dataKey='outsample_yhat' stroke='#0000ff' name='Outsample Predict Price' dot={false} />
                                                    <Line type='monotone' dataKey='insample_yhat' stroke='darkblue' name='Insample Predict Price' dot={false} />
                                                    <Line type='monotone' dataKey='outsample_y' stroke='#D75404' name='Out sample Stock Close Price' dot={false} />
                                                    <Line type='monotone' dataKey='insample_y' stroke='darkred' name='Insample Stock Close Price' dot={false} />
                                                    <Area dataKey="insample_confidence_region" stroke="lightgray" fill="lightgray"  strokeDasharray="5 5" />
                                                    <Area dataKey="outsample_confidence_region" stroke="#2196f3" fill="#2196f3"  strokeDasharray="5 5" opacity={0.5}/>
                                                    <Brush dataKey='date' height={30} stroke="#B5B3BE" />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        </Grid>

                                       
                                        
                                        <Grid item xs={1}></Grid>

                                       
                                        {/* nav title */}
                                        <Grid item xs={12}>
                                            <Typography variant="h5"  style={{paddingTop:60}} align='center'>
                                                    Prediction Error
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={1}></Grid>

                                        {/* prediction error chart */}
                                        <Grid item xs={10} style={{height: 300, marginTop: 20, paddingLeft: 5, paddingRight: 30}} className={classes.tradingList2}>
                                        <ResponsiveContainer style={{width: "99%"}}>
                                            <ScatterChart width={600} height={400} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                                                <CartesianGrid />
                                                <XAxis type="number" dataKey={'mse'} name='Mean Square Error' label={{ value: 'Mean Square Error', position: 'bottom' }} />
                                                  
                                                <YAxis type="number" dataKey={'r2'} name='R2 Score' label={{ value: 'R2 Score', angle: -90, position: 'insideLeft' }}/>
                                                <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                                                <Legend verticalAlign='top' wrapperStyle={{paddingBottom: 30, paddingLeft: 20}}/>
                                                <Scatter name='History Cross Validation' data={portfolio.predictionError.historyErrors} fill='#8884d8' line shape="wye">
                                                    <LabelList dataKey="name" position="top"  angle="45"/>
                                                </Scatter>
                                                <Scatter name='Future Prediction' data={portfolio.predictionError.futureErrors} fill='#82ca9d' line shape="wye">
                                                    <LabelList dataKey="name" position="top" angle="45" />
                                                </Scatter>
                                            </ScatterChart>
                                          
                                            </ResponsiveContainer>
                                        </Grid>

                                        <Grid item xs={1}></Grid>

                                       
                                    </Grid>

                                    {/* nav title */}
                                    <Grid item xs={12} md={2} className={classes.navTitle}>
                                        <NavTitle title='Stock Detail' />
                                    </Grid>
                                    <Grid item xs={12} md={10} ></Grid>

                                    <Grid item xs={12} className={classes.postContentContainer} >
                                        <StockDetailChart type={'hybrid'} data={portfolio.currentStockDeatilData} />
                                    </Grid>


                                    <Grid item xs={12} md={2} className={classes.navTitle}>
                                        <NavTitle title='Stock News' />
                                        
                                    </Grid>
                                    <Grid item xs={12} md={10} ></Grid>

                                   
                                    {/* stock news search bar */}
                                    <Grid item xs={12} className={classes.postContentContainer} >
                                        <Grid item xs={12}>
                                            <div className={classes.search}>
                                                <Button onClick={this.searchNews}>
                                                    <SearchIcon  />
                                                </Button>
                                                <InputBase
                                                placeholder="Search…"
                                                classes={{
                                                    root: classes.inputRoot,
                                                    input: classes.inputInput,
                                                }}
                                                inputProps={{ 'aria-label': 'search' }}
                                                onChange={this.searchInput}
                                                />
                                            </div>
                                    </Grid>

                                    {/* stock news component */}
                                    {portfolio.searchNews === undefined || portfolio.searchNews.length === 0 || ((portfolio.searchNewsKeyword !== this.state.searchKeyword) && portfolio.loadingSearchNews)? portfolio.loadingSearchNews &&
                                            (<Grid item xs={12}>
                                                <LoadingBounce />
                                            </Grid>) : portfolio.searchView && (
                                                <Fragment>
                                                    {portfolio.searchNews.map((post, index) => {
                                                    return (
                                                        <PostCard post={post} index={index} key={index*2+1} />
                                                    );
                                                    })}
                                                    {portfolio.searchNews === undefined || portfolio.searchNews.length === 0 ? <div></div> : !portfolio.loadingSearchNews ? 
                                                        (
                                                            <Grid item xs={12} container className={classes.loadMoreButtonContainer}>
                                                                <Button className={classes.loadMoreButton} onClick={this.props.loadMoreSearchNews}>Load More...</Button>
                                                            </Grid>
                                                        ) : 
                                                        <Grid item xs={12}>
                                                            <LoadingBounce />
                                                        </Grid>}

                                                </Fragment>
                                            )
                                            
                                    }


                                    {/* loading more news component */}
                                    {portfolio.news === undefined || portfolio.news.length === 0 ? portfolio.loadingNews &&
                                        (<Grid item xs={12}>
                                            <LoadingBounce />
                                        </Grid>) : !portfolio.searchView && (
                                            <Fragment>
                                                {portfolio.news.map((post, index) => {
                                                return (
                                                    <PostCard post={post} index={index} key={index*2+1} />
                                                );
                                                })}
                                                {portfolio.news === undefined || portfolio.news.length === 0 ? <div></div> : !portfolio.loadingNews ? 
                                                    (
                                                        <Grid item xs={12} container className={classes.loadMoreButtonContainer}>
                                                            <Button className={classes.loadMoreButton} onClick={this.props.loadMoreNews}>Load More...</Button>
                                                        </Grid>
                                                    ) : 
                                                    <Grid item xs={12}>
                                                        <LoadingBounce />
                                                    </Grid>}

                                            </Fragment>
                                        )
                                    }
                                    </Grid>
                                </Fragment>
                                )}
                        </Grid>

                      
                        
                        {/* Post footer */}
                        <Grid item xs={12}><div style={{ padding: 100 }}></div></Grid>

                    </Grid>
                </Grid>
            
            </div >

        )
    }
}


const mapStateToProps = state => ({
    portfolio: state.portfolio,
    authUser: state.authUser

})

const mapDispatchToProps = {
    getStock,
    predictHistory,
    getNews,
    loadMoreNews,
    searchNews,
    loadMoreSearchNews

};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(ChartComponent));