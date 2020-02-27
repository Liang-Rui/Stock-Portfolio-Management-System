import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart, ZoomButtons } from "react-stockcharts";
import {
    BarSeries,
    BollingerSeries,
    CandlestickSeries,
    LineSeries,
    StochasticSeries,
    MACDSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
    CrossHairCursor,
    EdgeIndicator,
    CurrentCoordinate,
    MouseCoordinateX,
    MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
    OHLCTooltip,
    MovingAverageTooltip,
    BollingerBandTooltip,
    StochasticTooltip,
    GroupTooltip,
    MACDTooltip,
} from "react-stockcharts/lib/tooltip";
import { ema, stochasticOscillator, bollingerBand, macd } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

const bbAppearance = {
    stroke: {
        top: "#964B00",
        middle: "#FF6600",
        bottom: "#964B00",
    },
    fill: "#4682B4"
};
const stoAppearance = {
    stroke: Object.assign({},
        StochasticSeries.defaultProps.stroke,
        { top: "#37a600", middle: "#b8ab00", bottom: "#37a600" })
};

const macdAppearance = {
    stroke: {
        macd: "#FF0000",
        signal: "#00F300",
    },
    fill: {
        divergence: "#4682B4"
    },
};

const mouseEdgeAppearance = {
    textFill: "#542605",
    stroke: "#05233B",
    strokeOpacity: 1,
    strokeWidth: 3,
    arrowWidth: 5,
    fill: "#BCDEFA",
};


// stock detail chart
class CandleStickChartWithDarkTheme extends React.Component {
    constructor(props) {
		super(props);
		this.handleReset = this.handleReset.bind(this);
    }

    componentWillMount() {
		this.setState({
			suffix: 1
		});
    }
    
    handleReset() {
		this.setState({
			suffix: this.state.suffix + 1
		});
	}
    
    // calculate different technical detail charts
    render() {
        const height = 1100;
        const { type, data: initialData, width, ratio } = this.props;

        const margin = { left: 70, right: 70, top: 20, bottom: 0 };

        const gridHeight = height - margin.top - margin.bottom;
        const gridWidth = width - margin.left - margin.right;

        const showGrid = true;
        const yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.2 } : {};
        const xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.2 } : {};

        const ema20 = ema()
            .id(0)
            .options({ windowSize: 20 })
            .merge((d, c) => { d.ema20 = c; })
            .accessor(d => d.ema20);

        const ema50 = ema()
            .id(2)
            .options({ windowSize: 50 })
            .merge((d, c) => { d.ema50 = c; })
            .accessor(d => d.ema50);

        const slowSTO = stochasticOscillator()
            .options({ windowSize: 14, kWindowSize: 3 })
            .merge((d, c) => { d.slowSTO = c; })
            .accessor(d => d.slowSTO);
        const fastSTO = stochasticOscillator()
            .options({ windowSize: 14, kWindowSize: 1 })
            .merge((d, c) => { d.fastSTO = c; })
            .accessor(d => d.fastSTO);
        const fullSTO = stochasticOscillator()
            .options({ windowSize: 14, kWindowSize: 3, dWindowSize: 4 })
            .merge((d, c) => { d.fullSTO = c; })
            .accessor(d => d.fullSTO);

        const bb = bollingerBand()
            .merge((d, c) => { d.bb = c; })
            .accessor(d => d.bb);

        const macdCalculator = macd()
            .options({
                fast: 12,
                slow: 26,
                signal: 9,
            })
            .merge((d, c) => { d.macd = c; })
            .accessor(d => d.macd);


        const calculatedData = macdCalculator(bb(ema20(ema50(slowSTO(fastSTO(fullSTO(initialData)))))));
        const xScaleProvider = discontinuousTimeScaleProvider
            .inputDateAccessor(d => d.date);
        const {
            data,
            xScale,
            xAccessor,
            displayXAccessor,
        } = xScaleProvider(calculatedData);

        const start = xAccessor(last(data));
        const end = xAccessor(data[Math.max(0, data.length - 150)]);
        const xExtents = [start, end];

        // return charts
        return (
            // main chart
            <ChartCanvas height={1100}
                width={width}
                ratio={ratio}
                margin={margin}
                type={type}
                seriesName={`MSFT_${this.state.suffix}`}
                data={data}
                xScale={xScale}
                xAccessor={xAccessor}
                displayXAccessor={displayXAccessor}
                xExtents={xExtents}
                zoomEvent={false}
            >

                {/* stock detail chart begines */}
                <Chart id={1} height={325}
                    yExtents={[d => [d.high, d.low], bb.accessor(), ema20.accessor(), ema50.accessor()]}
                    padding={{ top: 10, bottom: 20 }}
                    origin={(w, h) => [0, h-970]}
                >
                    <YAxis axisAt="right" orient="right" ticks={5} {...yGrid} inverted={true}
                        tickStroke="#000000" />
                    <XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0}
                        stroke="#000000" opacity={0.5} />

                    <MouseCoordinateY
                        at="right"
                        orient="right"
                        displayFormat={format(".2f")} />

                    <CandlestickSeries
                        stroke={d => d.close > d.open ? "#6BA583" : "#DB0000"}
                        wickStroke={d => d.close > d.open ? "#6BA583" : "#DB0000"}
                        fill={d => d.close > d.open ? "#6BA583" : "#DB0000"} />

                    <LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()} />
                    <LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()} />

                    <BollingerSeries yAccessor={d => d.bb}
                        {...bbAppearance} />
                    <CurrentCoordinate yAccessor={ema20.accessor()} fill={ema20.stroke()} />
                    <CurrentCoordinate yAccessor={ema50.accessor()} fill={ema50.stroke()} />

                    <EdgeIndicator itemType="last" orient="right" edgeAt="right"
                        yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#DB0000"} />

                    <OHLCTooltip origin={[-40, -110]} />
 
                    <GroupTooltip
                        layout="vertical"
                        origin={[-38, -85]}
                        verticalSize={20}
                        onClick={e => console.log(e)}
                        options={[
                            {
                                yAccessor: ema20.accessor(),
                                yLabel: `${ema20.type()}(${ema20.options().windowSize})`,
                                valueFill: ema20.stroke(),
                                withShape: true,
                            },
                            {
                                yAccessor: ema50.accessor(),
                                yLabel: `${ema50.type()}(${ema50.options().windowSize})`,
                                valueFill: ema50.stroke(),
                                withShape: true,
                            },
                        ]}
                    />
                    <BollingerBandTooltip
                        origin={[-38, -45]}
                        yAccessor={d => d.bb}
                        options={bb.options()}
                    />

                    <ZoomButtons
					    onReset={this.handleReset}
					/>
                    
                </Chart>

                {/* MACD technical chart begins */}
                <Chart id={2}
                    yExtents={d => d.volume}
                    origin={(w, h) => [0, h - 745]} height={100}

                >
                    <XAxis axisAt="bottom" orient="bottom" />
                    <YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}
                        tickStroke="#000000" />
                    <BarSeries
                        yAccessor={d => d.volume}
                        fill={d => d.close > d.open ? "#6BA583" : "#DB0000"} />
                </Chart>

                {/* Slow STO chart */}

                <Chart id={3}
                    yExtents={[0, 100]}
                    origin={(w, h) => [0, h - 345]} height={100} padding={{ top: 30, bottom: 0 }}
                >
                    <XAxis axisAt="bottom" orient="bottom"
                        showTicks={false}
                        outerTickSize={0}
                        stroke="#000000" opacity={0.5} />
                    <YAxis axisAt="right" orient="right"
                        tickValues={[20, 50, 80]}
                        tickStroke="#000000" />
                    <MouseCoordinateY
                        at="right"
                        orient="right"
                        displayFormat={format(".2f")} />

                    <StochasticSeries
                        yAccessor={d => d.slowSTO}
                        {...stoAppearance} />
                    <StochasticTooltip
                        origin={[-38, -30]}
                        yAccessor={d => d.slowSTO}
                        options={slowSTO.options()}
                        appearance={stoAppearance}
                        label="Slow STO" />
                </Chart>

                {/* Slow full STO chart */}

                <Chart id={4} height={100}
                    yExtents={macdCalculator.accessor()}
                    origin={(w, h) => [0, h - 545]} padding={{ top: 10, bottom: 10 }}
                >
                    <XAxis axisAt="bottom" orient="bottom" />
                    <YAxis axisAt="right" orient="right" ticks={2} />

                    <MouseCoordinateX
                        at="bottom"
                        orient="bottom"
                        displayFormat={timeFormat("%Y-%m-%d")}
                        rectRadius={5}
                        {...mouseEdgeAppearance}
                    />
                    <MouseCoordinateY
                        at="right"
                        orient="right"
                        displayFormat={format(".2f")}
                        {...mouseEdgeAppearance}
                    />

                    <MACDSeries yAccessor={d => d.macd}
                        {...macdAppearance} />
                    <MACDTooltip
                        origin={[-38, -30]}
                        yAccessor={d => d.macd}
                        options={macdCalculator.options()}
                        appearance={macdAppearance}
                    />
                </Chart>

                 {/* Bottom labels */}
                <Chart id={5}
                    yExtents={[0, 100]}
                    height={125}
                    origin={(w, h) => [0, h - 155]}
                    padding={{ top: 10, bottom: 10 }}
                >
                    <XAxis axisAt="bottom" orient="bottom"
                      
                        tickStroke="#000000"
                        stroke="#000000" />
                    <YAxis axisAt="right" orient="right"
                        tickValues={[20, 50, 80]}
                        tickStroke="#000000" />

                    <MouseCoordinateX
                        at="bottom"
                        orient="bottom"
                        displayFormat={timeFormat("%Y-%m-%d")} />
                    <MouseCoordinateY
                        at="right"
                        orient="right"
                        displayFormat={format(".2f")} />

                    <StochasticSeries
                        yAccessor={d => d.fullSTO}
                        {...stoAppearance} />
                    <StochasticTooltip
                        origin={[-38, -25]}
                        yAccessor={d => d.fullSTO}
                        options={fullSTO.options()}
                        appearance={stoAppearance}
                        label="Full STO" />
                </Chart>
                <CrossHairCursor stroke="#000000" />
            </ChartCanvas>
        );
    }
}
CandleStickChartWithDarkTheme.propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    ratio: PropTypes.number.isRequired,
    type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithDarkTheme.defaultProps = {
    type: "svg",
};
CandleStickChartWithDarkTheme = fitWidth(CandleStickChartWithDarkTheme);

export default CandleStickChartWithDarkTheme;
