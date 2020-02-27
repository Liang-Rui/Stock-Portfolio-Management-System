import React, { Component } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid'
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import MaterialTable from 'material-table'
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Assessment from '@material-ui/icons/Assessment'
import NavTitle from '../components/NavTitle'
import LoadingBounce from '../components/LoadingBounce'

import {
    PieChart, Pie, Sector, Cell, Radar, RadarChart, PolarGrid, Legend,
    PolarAngleAxis, PolarRadiusAxis, ComposedChart, Area, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
,Brush  } from 'recharts';


import {
    getStatisticPanel,
    addTransaction,
    editTransaction,
    deleteTransaction,
    addSymbol,
    deleteSymbol,
    getPortfolio,
    SETCURRENTTRANSACTION,
    getStockList,
    getStock,
    predictHistory,
    predictFuture,
    getNews
} from '../actions/portfolioActions';


// radar chart colors
const COLORS = ['#e8b15f','#44aa9f', '#cb7d6c', '#5786a0', '#65713f', '#93d14e','#a6a6a6', ];


// theme styles for responsive web design
const styles = theme => ({
    root: {
        maxWidth: 1600,
        margin: '0 auto',
        marginTop: 100,

        [theme.breakpoints.down('sm')]: {
            maxWidth: 1200,
            margin: '0 auto',
            marginTop: 60
        },
        [theme.breakpoints.down('xs')]: {
            maxWidth: 1200,
            margin: '0 auto',
            marginTop: 50
        }
    },
    statisticPannel: {
        paddingLeft: 20,
        [theme.breakpoints.down('md')]: {
            paddingLeft: 20,
        },
        [theme.breakpoints.down('sm')]: {
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 30
        },
    },
    PortfolioGainTitle: {
        paddingTop: 55, 
        paddingBottom: 5,
        paddingLeft: 30,
        [theme.breakpoints.down('md')]: {
            paddingTop: 55, 
            paddingBottom: 5,
            paddingLeft: 23
        },
        [theme.breakpoints.down('sm')]: {
            paddingTop: 55, 
            paddingBottom: 5,
            paddingLeft: 30
        },
    },
    PortfolioGainLegend: {
        margin: "auto",
        fontSize: "small",
        [theme.breakpoints.down('sm')]: {
            margin: "auto",
            fontSize: "small",
        }
    },
    portfolioGainChart: {
        height: 300, 
        paddingTop: 30, 
        paddingLeft: 100, 
        paddingRight: 150,
        [theme.breakpoints.down('md')]: {
            height: 300, 
            paddingTop: 30, 
            paddingLeft: 15, 
            paddingRight: 55,
        },
        [theme.breakpoints.down('sm')]: {
            height: 300, 
            paddingTop: 30, 
            paddingLeft: 0, 
            paddingRight: 50,
        }
    },
    twoCharts: {
        paddingBottom: 0,
        fontSize: "medium",       
        [theme.breakpoints.down('sm')]: {
            paddingBottom: 0,
            fontSize: "medium",
        }
    },
    omvText: {
        fontSize: "medium",       
        [theme.breakpoints.down('sm')]: {
            fontSize: "small",
        }
    },
    holdingList: {
        paddingTop: 70,
        paddingLeft: 20,
        paddingRight: 20,
        [theme.breakpoints.down('md')]: {
            padding: '0px 20px',
        }
    },
    tradingList: {
        paddingTop: 30,
        paddingLeft: 20,
        paddingRight: 20,
        [theme.breakpoints.down('md')]: {
            padding: '10px 20px',
        }
    },
    tradingList2: {
        paddingTop: 0,
        paddingLeft: 20,
        paddingRight: 20,
        [theme.breakpoints.down('sm')]: {
            padding: '30px 20px',
        }
    },
    navTitle: {
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 20,
        [theme.breakpoints.up('md')]: {
            paddingLeft: 30,
            paddingRight: 60
        },
    },

    

})



// portfolio main component
class portfolioView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex: 0,

        }
    }


    componentDidMount() {
        if (this.props.authUser.token !== null) {
            this.props.getPortfolio()
            this.props.getStockList()
        }
    }
    
    onPieEnter = (data, index) => 
    this.setState({
        activeIndex: index,
    })
      


    render() {
        const { classes, portfolio, authUser } = this.props

        // custom pie chart to change shape dynamically according to mouse hover
        // code from official documentation
        const renderActiveShape = (props) => {
            const RADIAN = Math.PI / 180;
            const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
              fill, payload, percent, value } = props;
            const sin = Math.sin(-RADIAN * midAngle);
            const cos = Math.cos(-RADIAN * midAngle);
            const sx = cx + (outerRadius + 10) * cos;
            const sy = cy + (outerRadius + 10) * sin;
            const mx = cx + (outerRadius + 20) * cos;
            const my = cy + (outerRadius + 20) * sin;
            const ex = mx + (cos >= 0 ? 1 : -1) * 11;
            const ey = my;
            const textAnchor = cos >= 0 ? 'start' : 'end';
          
            return (
              <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
                <Sector
                  cx={cx}
                  cy={cy}
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  fill={fill}
                />
                <Sector
                  cx={cx}
                  cy={cy}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  innerRadius={outerRadius + 6}
                  outerRadius={outerRadius + 10}
                  fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className={classes.omvText}>{`OMV ${value}`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" style={{fontSize: 'small'}}>
                  {`(Rate ${(percent * 100).toFixed(2)}%)`}
                </text>
              </g>
            );
          };


        if (authUser.token === null) {
            return (<Grid xs={12} style={{paddingTop: 100, paddingBottom: 450}}>
                <LoadingBounce />
            </Grid>)
        }

        return (
            <Grid container className={classes.root}>
            

                {/* Statistics panel begins */}
                <Grid item xs={12} md={3}className={classes.statisticPannel} >
                    <Card  >
                        <CardContent>
                                <Typography variant="h4" gutterBottom style={{paddingTop:20}}>
                                Statistics Panel
                                </Typography>
                                <Typography variant="subtitle1" component="p" color="textSecondary" gutterBottom style={{paddingTop: 40}}>
                                Portfolio Value ($): <Typography variant='h6' style={{display: 'inline-block', paddingLeft: 5}}>{parseInt(portfolio.statisticsPanel.portfolioValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Typography>
                                </Typography >
                                <Typography  variant="subtitle1" component="p" color="textSecondary" gutterBottom style={{paddingTop: 30}}>
                                Total Gain ($): <Typography variant='h6' style={{display: 'inline-block', paddingLeft: 5, color: Number(portfolio.statisticsPanel.totalGain) >= 0 ? 'green' : 'red'}}>{parseInt(portfolio.statisticsPanel.totalGain).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Typography>
                                </Typography>
                                <Typography variant="subtitle1" component="p" color="textSecondary" gutterBottom style={{paddingTop: 30, paddingBottom: 30}}>
                                Daily Gain ($): <Typography variant='h6' style={{display: 'inline-block', paddingLeft: 5, color: Number(portfolio.statisticsPanel.dailyGain) >= 0 ? 'green' : 'red'}}>{parseInt(portfolio.statisticsPanel.dailyGain).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Typography>
                                </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Statistics panel ends */}

  
                {/* Radar chart begins */}
                <Grid item xs={12} sm={6} md={4} className={classes.twoCharts}>
                    <ResponsiveContainer style={{width: "99%"}} >
                        <RadarChart outerRadius={100} data={portfolio.radarChart} >
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={18}  />
                            {Object.keys(portfolio.radarChart[0]).slice(1,-1).map((entry, index) => <Radar name={entry} dataKey={entry} stroke={COLORS[index % COLORS.length]} fill={COLORS[index % COLORS.length]} fillOpacity={0.3}/>)}
                            <Legend iconSize={10} wrapperStyle={{fontSize: "smaller"}}/>
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </Grid>   
                {/* Radar chart ends */}


                {/* Pie chart begins */}
                <Grid item xs={12} sm={6} md={5}  className={classes.twoCharts}>
                    <ResponsiveContainer style={{width: "99%"}}  >
                        <PieChart >
                            <Pie 
                                activeIndex={this.state.activeIndex}
                                activeShape={renderActiveShape} 
                                data={portfolio.pieChart} 
                                innerRadius={50}
                                outerRadius={65} 
                                fill="#8884d8"
                                onMouseEnter={this.onPieEnter}
                            >
                            {
                                portfolio.pieChart.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                            }
                            </Pie>
                                <Legend iconSize={10} wrapperStyle={{paddingLeft:24, fontSize: "smaller"}}/>
                        </PieChart>  
                    </ResponsiveContainer>
                </Grid>  
                {/* Pie chart ends */}


                
                {/* Portfolio tend heading */}
                <Grid item xs={12} md={2} className={classes.navTitle}>
                    <NavTitle title='Portfolio Trend' />
                </Grid>

                {/* Padding between title and left side of the screen dynamically */}
                <Grid item xs={12} md={10} ></Grid>

                {/* Portfolio gain chart begins */}
                <Grid item xs={12} className={classes.portfolioGainChart}>
                    <ResponsiveContainer style={{width: "100%"}}>
                    <ComposedChart width={600} height={400} data={portfolio.portfolioComposedChart}
                        className={classes.PortfolioGainLegend}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip/>
                        <Legend verticalAlign="top" wrapperStyle={{paddingBottom: 30, paddingLeft: 30}}/>
                        <CartesianGrid stroke='#f5f5f5'/>
                        <Area type='monotone' dataKey='tg' fill='#8884d8' stroke='#8884d8' name='Total Gain'/>
                        <Bar dataKey='mv' barSize={20} fill='#14325C' fillOpacity='0.6' name='Market Value'/>
                        <Line type='monotone' dataKey='dg' stroke='#D75404' name='Daily Gain' dot={false}/>

                        <Brush dataKey='date' height={30} stroke="#B5B3BE" />
                    </ComposedChart>
                    </ResponsiveContainer>
                </Grid>
                {/* Portfolio gain chart ends */}

                {/* Table showing user share holding list */}
                <Grid item xs={12} className={classes.holdingList}>
                    <div style={{ maxWidth: '100%', paddingTop: '20px' }}>
                        <MaterialTable
                            columns={[
                                { 
                                    title: 'Symbol', 
                                    field: 'name', 
                                    cellStyle: { color: 'darkblue', fontWeight: 900 } 
                                },
                                { 
                                    title: 'Last Price', 
                                    field: 'lastPrice', 
                                    type: 'numeric',  
                                    editable: 'never', 
                                    headerStyle: { maxWidth: 160 }, 
                                    cellStyle: { maxWidth: 160, fontWeight: 900 } 
                                },
                                {
                                    title: 'Change', 
                                    field: 'change', 
                                    type: 'numeric', 
                                    editable: 'never',
                                    cellStyle: rowData => (rowData === undefined) ? (rowData) : ((rowData > 0) ? ({ color: 'green', fontWeight: 900 }) : (rowData == 0) ? ({ fontWeight: 900 }) : ({ color: 'red', fontWeight: 900 }))
                                    
                                },
                                {
                                    title: 'Chg%', 
                                    field: 'changePercent', 
                                    type: 'numeric', 
                                    editable: 'never',
                                    customSort: (a, b) => (a.changePercent === undefined || b.changePercent === undefined) ? (1) : Number(a.changePercent.substring(0, a.changePercent.length - 1)) - Number(b.changePercent.substring(0, b.changePercent.length - 1)),
                                    cellStyle: rowData => (rowData === undefined) ? (rowData) : (Number(rowData.substring(0, rowData.length - 1)) > 0) ? ({ color: 'green', fontWeight: 900 }) : (Number(rowData.substring(0, rowData.length - 1)) == 0) ? ({ fontWeight: 900 }) : ({ color: 'red', fontWeight: 900 })
                                },
                                { 
                                    title: 'Shares', 
                                    field: 'shares', 
                                    type: 'numeric', 
                                    editable: 'never', 
                                    headerStyle: { maxWidth: 160 }, 
                                    cellStyle: { maxWidth: 160, fontWeight: 900 } 
                                },
                                { 
                                    title: 'Cost Basis', 
                                    field: 'costBasis', 
                                    type: 'numeric', 
                                    editable: 'never', 
                                    headerStyle: { maxWidth: 160 }, 
                                    cellStyle: { maxWidth: 160, fontWeight: 900 } 
                                },
                                { 
                                    title: 'Market Value $ (Hundreds)', 
                                    field: 'marketValue', 
                                    type: 'numeric', 
                                    editable: 'never', 
                                    headerStyle: { maxWidth: 160 }, 
                                    cellStyle: { maxWidth: 160, fontWeight: 900 } 
                                },
                                { 
                                    title: 'Daily Gain', 
                                    field: 'dailyGain', 
                                    type: 'numeric', 
                                    editable: 'never',
                                    cellStyle: rowData => (rowData === undefined) ? (rowData) : ((rowData > 0) ? ({ color: 'green', fontWeight: 900 }) : (rowData == 0) ? ({ fontWeight: 900 }) : ({ color: 'red', fontWeight: 900 }))
                                },
                                { 
                                    title: 'Total Gain', 
                                    field: 'totalGain', 
                                    type: 'numeric', 
                                    editable: 'never',
                                    cellStyle: rowData => (rowData === undefined) ? (rowData) : (rowData > 0) ? ({ color: 'green', fontWeight: 900 }) : (rowData == 0) ? ({ fontWeight: 900 }) : ({ color: 'red', fontWeight: 900 }) 
                                },
                                { 
                                    title: 'No. lots', 
                                    field: 'noLots', 
                                    type: 'numeric', 
                                    editable: 'never', 
                                    headerStyle: { maxWidth: 160 }, 
                                    cellStyle: { maxWidth: 160, fontWeight: 900 } 
                                }
                            ]}
                            data={portfolio.holdingListData}
                            editable={{
                                onRowAdd: newData =>
                                  new Promise((resolve, reject) => {
                                    const symbolDic = portfolio.completeStockList.reduce((c,x) => ({...c, [x.name]: x.symbolName}), {})
                                    if (symbolDic[newData.name] === undefined) {
                                        alert("Entered symbol does not exist in database!")
                                        reject()
                                    } else {
                                        this.props.addSymbol(newData.name)
                                        this.props.getPortfolio()
                                        resolve()
                                    }
                                    
                                  }).then(new Promise((resolve, reject) => !portfolio.fetchingPortfolio && resolve())),
                               
                                onRowDelete: oldData =>
                                  new Promise((resolve, reject) => {
                                    this.props.deleteSymbol(oldData)
                                    setTimeout(() => {
                                      {
                                        this.props.getPortfolio()
                                      }
                                      resolve()
                                    }, 500)
                                  }).then(new Promise((resolve, reject) => setTimeout(() => !portfolio.fetchingPortfolio && resolve(), 500))),
                              }}
                              actions={[
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
                                  }
                            ]}
                            detailPanel={[
                                {
                                tooltip: 'Show transaction records, click row to add new transactions.',
                                render: rowData => {
                                    return (
                                        <Grid container >
                                            <Grid item xs={6} >
                                                <MaterialTable 
                                                    columns={[
                                                        { 
                                                            title: 'Trade Date', 
                                                            field: 'tradeDate',
                                                            type: 'date',
                                                            
                                                        },
                                                        { 
                                                            title: 'Shares', 
                                                            field: 'shares',
                                                            type: 'numeric'
                                                        },
                                                        { 
                                                            title: 'Price', 
                                                            field: 'price', 
                                                            type: 'numeric' 
                                                        },
                                                        {
                                                            title: 'Action',
                                                            field: 'action',
                                                            lookup: { '1': 'Buy', '-1': 'Sell' },
                                                        }
                                                    ]}
                                                    data={portfolio.transactionData[rowData.name]}
                                                    options={{
                                                        search: false,
                                                        
                                                    }}
                                                    title='Transactions'
                                                />
                                            </Grid>
                                          

                                            <Grid item xs={6} style={{height: 300, marginTop: 70, paddingLeft: 5, paddingRight: 30}}>
                                                
                                                <ResponsiveContainer style={{width: "99%"}}>
                                                <ComposedChart width={600} height={400} data={portfolio.transactionComposedChart[rowData.name]}
                                                    className={classes.PortfolioGainLegend}>
                                                    <XAxis dataKey="date" />
                                                    <YAxis />
                                                    <Tooltip/>
                                                    <Legend verticalAlign="top" wrapperStyle={{paddingBottom: 30, paddingLeft: 30}}/>
                                                    <CartesianGrid stroke='#f5f5f5'/>
                                                    <Area type='monotone' dataKey='tg' fill='#5398D9' stroke='#5398D9' name='Total Gain'/>
                                                    <Bar dataKey='mv' barSize={20} fill='#14325C' fillOpacity='0.6' name='Market Value'/>
                                                    <Line type='monotone' dataKey='dg' stroke='#D75404' name='Daily Gain' dot={false}/>
                                                    <Brush dataKey='date' height={30} stroke="#B5B3BE"/>
                                                </ComposedChart>
                                                </ResponsiveContainer>

                                                
                                                
                                            </Grid>
                                            

                                        </Grid>
                                        
                                      
                                    )
                                  }}]}
                            onRowClick={(event, rowData, togglePanel) => this.props.SETCURRENTTRANSACTION(rowData.name)}
                            title='Holding List'
                            options={{
                                headerStyle: {
                                    backgroundColor: '#f6f6f6',
                                    color: '#000000',
                                },
                                search: true
                            }}
                        />
                    </div>
                </Grid>



                <Grid item xs={12} md={2} className={classes.navTitle}>
                    <NavTitle title='Current Trading' />
                </Grid>

                {/* current trading table */}
                <Grid item xs={12} md={10} ></Grid>

                    <Grid item xs={12} md={6} className={classes.tradingList}>
                        <MaterialTable 
                            columns={[
                                { 
                                    title: 'Trade Date', 
                                    field: 'tradeDate',
                                    type: 'date',
                                    
                                },
                                { 
                                    title: 'Shares', 
                                    field: 'shares',
                                    type: 'numeric'
                                },
                                { 
                                    title: 'Price', 
                                    field: 'price', 
                                    type: 'numeric' 
                                },
                                {
                                    title: 'Action',
                                    field: 'action',
                                    lookup: { '1': 'Buy', '-1': 'Sell' },
                                }
                            ]}
                            data={portfolio.currentTransactionData}
                            editable={portfolio.currentTransactionSymbol === null ? null : {
                                onRowAdd: newData =>
                                    new Promise((resolve, reject) => {
                                    const today = new Date('2019-10-31')
                                    const todayTime = today.getTime()        
                                    if (newData.tradeDate === undefined) {
                                        alert("You need to enter trade date!")
                                        reject()
                                    } else if (newData.tradeDate !== undefined && newData.tradeDate.getTime() > todayTime) {
                                        alert("Our database only contains data before 2019-10-31!")
                                        reject()
                                    } else if (newData.shares === undefined) {
                                        alert("You need to enter shares!")
                                        reject()
                                    } else if (newData.price === undefined) {
                                        alert("You need to enter price!")
                                        reject()
                                    } else if (newData.action === undefined) {
                                        alert("You need to enter action!")
                                        reject()
                                    } else if (newData.shares <= 0) {
                                        alert("Stock share cannot be negative or zero!")
                                        reject()
                                    } else if (newData.price <= 0) {
                                        alert("Stock price cannot be negative or zero!")
                                        reject()
                                    } else {
                                        var newTransactionData = portfolio.currentTransactionData.map( (x) => ({date: x.tradeDate, trade: x.shares * x.action}))
                                        newTransactionData.push({date: newData.tradeDate.toISOString().substring(0, 10), trade: newData.shares * newData.action})
                                        newTransactionData = newTransactionData.sort((a,b) => {
                                            if (a.date < b.date) {
                                                return -1
                                            }
                                            if (a.date > b.date) {
                                                return 1
                                            }
                                            return 0
                                        })
                                        var i = 0
                                        var needReject = false
                                        var totalTrade = 0
                                        for (i = 0; i< newTransactionData.length; i++){
                                            totalTrade = totalTrade + newTransactionData[i].trade
                                            if (totalTrade < 0){
                                                needReject = true
                                            }
                                        }
                                        if (needReject) {
                                            alert("You are selling more shares than you own! Please check again!")
                                            reject()
                                        } else {
                                            this.props.addTransaction(portfolio.currentTransactionSymbol, newData)
                                            setTimeout(() => {
                                                {
                                                    this.props.getPortfolio()
                                                    resolve()
                                                }
                                                }, 1000)
                                        }
                                    }
                                    }).then(new Promise((resolve, reject) => setTimeout(() => !portfolio.fetchingPortfolio && resolve(), 500))),
                                onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve, reject) => {
                                    var today = new Date('2019-10-31')
                                    today.setDate(today.getDate() + 1)
                                    if (newData.tradeDate === undefined || newData.tradeDate === null) {
                                        alert("You need to enter trade date!")
                                        reject()
                                    } else if (typeof(newData.tradeDate) === "object" && newData.tradeDate.toISOString().substring(0,10) > today.toISOString().substring(0,10)) {
                                        alert("Our database only contains data before 2019-10-31!")
                                        reject()
                                    } else if (newData.shares === undefined || newData.shares === null) {
                                        alert("You need to enter shares!")
                                        reject()
                                    } else if (newData.price === undefined || newData.price === null) {
                                        alert("You need to enter price!")
                                        reject()
                                    } else if (newData.action === undefined || newData.action === null) {
                                        alert("You need to enter action!")
                                        reject()
                                    } else if (newData.shares <= 0) {
                                        alert("Stock share cannot be negative or zero!")
                                        reject()
                                    } else if (newData.price <= 0) {
                                        alert("Stock price cannot be negative or zero!")
                                        reject()
                                    } else {
                                        var newTransactionData = portfolio.currentTransactionData.map( (x) => (x.id !== newData.id ? {date: x.tradeDate, trade: x.shares * x.action} : {date: typeof(newData.tradeDate) === 'string' ? newData.tradeDate : newData.tradeDate.toISOString().substring(0, 10), trade: newData.shares * newData.action}))
                                        newTransactionData = newTransactionData.sort((a,b) => {
                                            if (a.date < b.date) {
                                                return -1
                                            }
                                            if (a.date > b.date) {
                                                return 1
                                            }
                                            return 0
                                        })
                                        var i = 0
                                        var needReject = false
                                        var totalTrade = 0
                                        for (i = 0; i< newTransactionData.length; i++){
                                            totalTrade = totalTrade + newTransactionData[i].trade
                                            if (totalTrade < 0){
                                                needReject = true
                                            }
                                        }
                                        if (needReject) {
                                            alert("You are selling more shares than you own! Please check again!")
                                            reject()
                                        } else {
                                            this.props.editTransaction(portfolio.currentTransactionSymbol, oldData, newData)
                                            setTimeout(() => {
                                                {
                                                    this.props.getPortfolio()
                                                    resolve()
                                                }
                                                }, 1000)
                                        }
                                    }
                                    }),
                                onRowDelete: oldData =>
                                    new Promise((resolve, reject) => {

                                        var newTransactionData = portfolio.currentTransactionData.map( (x) => (x.id !== oldData.id ? {date: x.tradeDate, trade: x.shares * x.action} : {date: oldData.tradeDate, trade: 0}))
                                        newTransactionData = newTransactionData.sort((a,b) => {
                                            if (a.date < b.date) {
                                                return -1
                                            }
                                            if (a.date > b.date) {
                                                return 1
                                            }
                                            return 0
                                        })
                                        var i = 0
                                        var needReject = false
                                        var totalTrade = 0
                                        for (i = 0; i< newTransactionData.length; i++){
                                            totalTrade = totalTrade + newTransactionData[i].trade
                                            if (totalTrade < 0){
                                                needReject = true
                                            }
                                        }
                                        if (needReject) {
                                            alert("Delete this row will cause selling shares greater than buying shares! Please check again!")
                                            reject()
                                        } else {
                                            this.props.deleteTransaction(portfolio.currentTransactionSymbol, oldData)
                                            setTimeout(() => {
                                                {
                                                    this.props.getPortfolio()
                                                    resolve()
                                                }
                                                }, 1000)
                                        }
                                    }),
                                }}
                            options={{
                                pageSize: 15
                                
                            }}
                            title={portfolio.currentTransactionSymbol === null ? 'Transactions' : portfolio.currentTransactionSymbol}
                            
                        />
                    </Grid>

                    {/* stock gain chart */}
                    <Grid item container xs={12} md={6}>
                    <Grid item xs={12}  style={{height: 300, marginTop: 70, paddingLeft: 5, paddingRight: 30}} className={classes.tradingList}>
                        
                        <ResponsiveContainer style={{width: "99%"}}>
                        <ComposedChart width={600} height={400} data={portfolio.currentTransactionChart}
                            className={classes.PortfolioGainLegend}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip/>
                            <Legend verticalAlign="top" wrapperStyle={{paddingBottom: 30, paddingLeft: 30}}/>
                            <CartesianGrid stroke='#f5f5f5'/>
                            <Area type='monotone' dataKey='tg' fill='#5398D9' stroke='#5398D9' name='Total Gain'/>
                            <Bar dataKey='mv' barSize={20} fill='#14325C' fillOpacity='0.6' name='Market Value'/>
                            <Line type='monotone' dataKey='dg' stroke='#D75404' name='Daily Gain' dot={false}/>
                            <Brush dataKey='date' height={30} stroke="#B5B3BE"/>
                        </ComposedChart>
                        </ResponsiveContainer>
                    </Grid>

                    {/* stock cost basis chart */}
                    <Grid item xs={12} style={{height: 300, marginTop: 0, paddingLeft: 5, paddingRight: 30}} className={classes.tradingList2}>
                        
                        <ResponsiveContainer style={{width: "99%"}}>
                        <ComposedChart width={600} height={400} data={portfolio.currentTransactionChart}
                            className={classes.PortfolioGainLegend}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip/>
                            <Legend verticalAlign="top" wrapperStyle={{paddingBottom: 30, paddingLeft: 30}}/>
                            <CartesianGrid stroke='#f5f5f5'/>
                            <Line type='monotone' dataKey='dailyCostBasis' stroke='#5398D9' name='Cost Basis' strokeDasharray="5 5" dot={false}/>
                            <Line type='monotone' dataKey='close' stroke='#D75404' name='Stock Close Price' dot={false} />
                            <Brush dataKey='date' height={30} stroke="#B5B3BE"/>
                        </ComposedChart>
                        </ResponsiveContainer>
                    </Grid>

                    </Grid>
                    
            </Grid>
        )
    }
}


const mapStateToProps = state => ({
    portfolio: state.portfolio,
    authUser: state.authUser

})

const mapDispatchToProps = {
    getStatisticPanel,
    addTransaction,
    addTransaction,
    editTransaction,
    deleteTransaction,
    addSymbol,
    deleteSymbol,
    getPortfolio,
    SETCURRENTTRANSACTION,
    getStockList,
    getStock,
    predictHistory,
    predictFuture,
    getNews

};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(portfolioView))


