import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';

import NavTitle from '../components/NavTitle'

import { connect } from 'react-redux';

import MaterialTable from 'material-table';

import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Assessment from '@material-ui/icons/Assessment'

import {
    getStockList,
    addSymbol,
    getPortfolio,
    getStock,
    predictHistory,
    predictFuture,
    getNews,
    getRecommendedStock
} from '../actions/portfolioActions';



// theme styles for responsive web design
const styles = theme => ({
    loadMoreButtonContainer: {
        paddingTop: 20,
        paddingLeft: 15
    },
    loadMoreButton: {
        color: '#5f9b65',
        '&:hover': {
            backgroundColor: 'white',
            opacity: '0.6'
        }
    },
    navTitle: {
        [theme.breakpoints.up('md')]: {
            paddingLeft: 10,
            paddingRight: 20,
            paddingBottom: 30
        },
    },
    navTitlePaddingRight: {
        [theme.breakpoints.down('md')]: {
            maxWidth: 35
        },
    },
    tradingList2: {
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize:"middle",
        [theme.breakpoints.down('sm')]: {
            padding: '30px 20px',
            fontSize:"middle",
        }
    },
})


// stock list component for homepage
class PostListSection extends Component {


    componentDidMount() {
        if (this.props.authUser.token !== null) {
            if (this.props.portfolio.completeStockList.length === 0) {
                this.props.getRecommendedStock()
                this.props.getPortfolio()
            }
            if (this.props.portfolio.recommendedStockList.length === 0) {
                this.props.getStockList()
            }
        }

    }

   
    render() {
        const { classes, portfolio, authUser } = this.props;



        return (

            <Fragment>

                {/* post title start */}
                <Grid item xs={12} md={2} className={classes.navTitle}>
                    <NavTitle title='Indroduction Demo' postListSorting={true} />
                </Grid>
                {/* post title ends */}

                <Grid item md={10} className={classes.navTitlePaddingRight}></Grid>

                <Grid item xs={12} container>
                    {/* <Grid item xs={1}></Grid> */}
                    
                    <Grid item xs={12} style={{paddingLeft: 30, paddingRight: 30, paddingBottom: 100}}>
                        <iframe
                            width="100%"
                            height="715"
                            src="https://www.youtube.com/embed/7LpReUvbZiE"
                            frameborder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                        />
                    </Grid>
                    {/* <Grid item xs={1}></Grid> */}
                </Grid>


                {/* post title start */}
                <Grid item xs={12} md={2} className={classes.navTitle}>
                    <NavTitle title='Complete Stock List' postListSorting={true} />
                </Grid>
                {/* post title ends */}

                <Grid item md={10} className={classes.navTitlePaddingRight}></Grid>

                {/* post list starts */}
                <Grid item xs={12} container >


                        <Grid item xs={12} >

                            <MaterialTable
                                columns={[
                                    { title: 'Symbol', field: 'name', headerStyle: { maxWidth: 0 }, cellStyle: { color: 'darkblue', fontWeight: 900, fontSize:'medium' } },
                                    { title: 'Name', field: 'symbolName', cellStyle:{fontSize:'medium'}},
                                    { title: 'Last price', field: 'lastPrice', type: 'numeric', cellStyle: { fontWeight: 900, fontSize:'medium' } },
                                    {
                                        title: 'Change', field: 'change', type: 'numeric',
                                        cellStyle: rowData => (rowData > 0) ? ({ color: 'green', fontWeight: 900, fontSize:'medium' }) : (rowData == 0) ? ({ fontWeight: 900, fontSize:'medium' }) : ({ color: 'red', fontWeight: 900, fontSize:'medium' })
                                    },
                                    {
                                        title: 'Chg%', field: 'changePercent', type: 'numeric',
                                        customSort: (a, b) => Number(a.changePercent.substring(0, a.changePercent.length - 1)) - Number(b.changePercent.substring(0, b.changePercent.length - 1)),
                                        cellStyle: rowData => (Number(rowData.substring(0, rowData.length - 1)) > 0) ? ({ color: 'green', fontWeight: 900, fontSize:'medium' }) : (Number(rowData.substring(0, rowData.length - 1)) == 0) ? ({ fontWeight: 900, fontSize:'medium' }) : ({ color: 'red', fontWeight: 900, fontSize:'medium' })
                                    },
                                    { title: 'Volume', field: 'volume', type: 'numeric', 
                                        customSort: (a, b) => parseFloat(a.volume.replace(/,/g, '')) - parseFloat(b.volume.replace(/,/g, '')),
                                        cellStyle:{fontSize:'medium'} 
                                    }
                                ]}
   
                                data={portfolio.completeStockList}
                                isLoading={authUser.token === null ? false : portfolio.fetchingStockList ? true : false}
                                title=''
                                localization={{
                                    toolbar: {
                                        searchPlaceholder: "Your search placeholder"
                                    },
                                    body: {
                                        deleteTooltip: "Delete"
                                    }
                                }}
                                options={{
                                    headerStyle: {
                                        fontSize:'medium',
                                        backgroundColor: '#f6f6f6',
                                        color: '#000000',
                                        
                                    },
                                    pageSize: 15,
                                    pageSizeOptions: [5, 10, 20, 50, 100, 200, 500, 1000]
                                }}
                                actions={[
                                    rowData => ({
                                        icon: 'add',
                                        tooltip: 'Add stock to holding list',
                                        onClick: (event, rowData) => {this.props.addSymbol(rowData.name);alert("You added " + rowData.name)},
                                        disabled: portfolio.holdingListData.map(x => x.name).includes(rowData.name)
                                    }),
                                    {
                                        icon: () => 
                                            <IconButton 
                                                component={Link} 
                                                to={'/detail/'} 
                                                style={{
                                                    backgroundColor: 'inherit',
                                                    color: 'black',
                                                    padding: 0
                                                    }} 
                                                    >
                                                <Assessment fontSize="small" />
                                            </IconButton>,
                                        tooltip: 'See stock detail',
                                        onClick: (event, rowData) => {
                                            this.props.getStock(rowData.name); 
                                            this.props.predictHistory(rowData.name); 
                                            this.props.predictFuture(rowData.name);
                                            this.props.getNews(rowData.name, 1)
                                        }
                                    },
                                    
                                ]}
                            />
                    </Grid>

                </Grid>
                {/* post list ends */}


                {/* post title start */}
                <Grid item xs={12} md={2} className={classes.navTitle} style={{paddingTop:100}}>
                    <NavTitle title='Recommended Stock List' postListSorting={true} />
                </Grid>
                {/* post title ends */}

                <Grid item md={10} className={classes.navTitlePaddingRight}></Grid>

                {/* stock list starts */}
                <Grid item xs={12} container >

                        <Grid item xs={12}>

                            <MaterialTable
                                columns={[
                                    { title: 'Symbol', field: 'name', headerStyle: { maxWidth: 0 }, cellStyle: { color: 'darkblue', fontWeight: 900, fontSize:'medium' } },
                                    { title: 'Name', field: 'symbolName', cellStyle:{fontSize:'medium'}},
                                    { title: 'Last price', field: 'lastPrice', type: 'numeric', cellStyle: { fontWeight: 900, fontSize:'medium' } },
                                    {
                                        title: 'Change', field: 'change', type: 'numeric',
                                        cellStyle: rowData => (rowData > 0) ? ({ color: 'green', fontWeight: 900, fontSize:'medium' }) : (rowData == 0) ? ({ fontWeight: 900, fontSize:'medium' }) : ({ color: 'red', fontWeight: 900, fontSize:'medium' })
                                    },
                                    {
                                        title: 'Chg%', field: 'changePercent', type: 'numeric',
                                        customSort: (a, b) => Number(a.changePercent.substring(0, a.changePercent.length - 1)) - Number(b.changePercent.substring(0, b.changePercent.length - 1)),
                                        cellStyle: rowData => (Number(rowData.substring(0, rowData.length - 1)) > 0) ? ({ color: 'green', fontWeight: 900, fontSize:'medium' }) : (Number(rowData.substring(0, rowData.length - 1)) == 0) ? ({ fontWeight: 900, fontSize:'medium' }) : ({ color: 'red', fontWeight: 900, fontSize:'medium' })
                                    },
                                    { title: 'Volume', field: 'volume', type: 'numeric', 
                                        customSort: (a, b) => parseFloat(a.volume.replace(/,/g, '')) - parseFloat(b.volume.replace(/,/g, '')),
                                        cellStyle:{fontSize:'medium'} 
                                    }
                                ]}

                                data={portfolio.recommendedStockList}
                                isLoading={authUser.token === null ? false : portfolio.fetchingRecommendedStockList ? true : false}
                                title=''
                                localization={{
                                    toolbar: {
                                        searchPlaceholder: "Your search placeholder"
                                    },
                                    body: {
                                        deleteTooltip: "Delete"
                                    }
                                }}
                                options={{
                                    headerStyle: {
                                        fontSize:'medium',
                                        backgroundColor: '#f6f6f6',
                                        color: '#000000',
                                        
                                    },
                                    pageSize: 10,
                                    pageSizeOptions: [5, 10, 20, 50, 100, 200, 500, 1000]
                                }}
                                actions={[
                                    rowData => ({
                                        icon: 'add',
                                        tooltip: 'Add stock to holding list',
                                        onClick: (event, rowData) => {this.props.addSymbol(rowData.name);alert("You added " + rowData.name)},
                                        disabled: portfolio.holdingListData.map(x => x.name).includes(rowData.name)
                                    }),
                                    {
                                        icon: () => 
                                            <IconButton 
                                                component={Link} 
                                                to={'/detail/'} 
                                                style={{
                                                    backgroundColor: 'inherit',
                                                    color: 'black',
                                                    padding: 0
                                                    }} 
                                                    >
                                                <Assessment fontSize="small" />
                                            </IconButton>,
                                        tooltip: 'See stock detail',
                                        onClick: (event, rowData) => {
                                            this.props.getStock(rowData.name); 
                                            this.props.predictHistory(rowData.name); 
                                            this.props.predictFuture(rowData.name);
                                            this.props.getNews(rowData.name, 1)
                                        }
                                    },
                                ]}
                            />
                    </Grid>

                </Grid>

            </Fragment>

        );
    }

}

const mapStateToProps = state => ({
    portfolio: state.portfolio,
    authUser: state.authUser
})

const mapDispatchToProps = {
  
    getStockList,
    addSymbol,
    getPortfolio,
    getStock,
    predictHistory,
    predictFuture,
    getNews,
    getRecommendedStock
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(PostListSection));
