import React, { Component } from "react";
import { PropTypes } from "prop-types";
import * as d3 from "d3";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import Grid from "../grid/index";
import Bars from "./bars";
import Wrapper from "./index.style";
import appActions from "../../redux/app/actions";

const margins = {
  gapX: 24,
  gapY: 24,
  yTicksCount: 10,
};

const { updateDomain } = appActions;

class BarPlot extends Component {
  regl = null;
  container = null;

  constructor(props) {
    super(props);
    this.zoom = null;
    this.container = null;
    this.plotContainer = null;
    this.grid = null;
    let { results, xDomain } = this.props;

    let barsStruct = {
      barsY: results.getColumn("y").toArray(),
      barsStartPoint: results.getColumn("startPoint").toArray(),
      barsEndPoint: results.getColumn("endPoint").toArray(),
      barsFill: results.getColumn("color").toArray(),
      domainX: xDomain,
    };
    let globalMaxY = d3.max(barsStruct.barsY);
    let matched = Array.prototype.slice.call(
      barsStruct.barsY.slice(
        barsStruct.barsStartPoint.findIndex((d) => d >= xDomain[0]),
        barsStruct.barsStartPoint.findIndex((d) => d >= xDomain[1])
      )
    );

    let points = [...new Set(matched.map((e,j) => Math.round(e * 10) / 10))].sort((a,b) => d3.descending(a,b));
    barsStruct.domainY = [0, points[Math.floor(0.01 * points.length)] || globalMaxY];

    this.state = {
      barsStruct,
      globalMaxY,
    };
  }

  componentDidMount() {
    const regl = require("regl")({
      extensions: ["ANGLE_instanced_arrays"],
      container: this.container,
      pixelRatio: window.devicePixelRatio || 1.5,
      attributes: {
        antialias: true,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: true,
      },
    });

    regl.cache = {};
    this.regl = regl;

    this.regl.clear({
      color: [0, 0, 0, 0.0],
      stencil: true,
    });
    this.bars = new Bars(this.regl);
    let { barsStruct } = this.state;
    let stageWidth = this.props.width - 2 * margins.gapX;
    let stageHeight = this.props.height - 3 * margins.gapY;
    this.bars.load(stageWidth, stageHeight, barsStruct);
    this.bars.render();
  }

  componentDidUpdate(prevProps, prevState) {
    const { xDomain } = this.props;
    let { barsStruct, globalMaxY } = this.state;
    this.regl.clear({
      color: [0, 0, 0, 0.0],
      depth: false,
    });

    this.regl.poll();
    let matched = Array.prototype.slice.call(
      barsStruct.barsY.slice(
        barsStruct.barsStartPoint.findIndex((d) => d >= xDomain[0]),
        barsStruct.barsStartPoint.findIndex((d) => d >= xDomain[1])
      )
    );

    let points = [...new Set(matched.map((e,j) => Math.round(e * 10) / 10))].sort((a,b) => d3.descending(a,b));
    barsStruct.domainY = [0, points[Math.floor(0.01 * points.length)] || globalMaxY];

    if (prevProps.width !== this.props.width) {
      this.regl.destroy();
      this.componentDidMount();
    } else {
      this.bars.rescaleXY(this.props.xDomain, barsStruct.domainY);
    }
  }

  componentWillUnmount() {
    if (this.regl) {
      this.regl.destroy();
    }
  }

  render() {
    const { width, height, xDomain, chromoBins, title } = this.props;
    let { barsStruct, globalMaxY } = this.state;
    
    let stageWidth = width - 2 * margins.gapX;
    let stageHeight = height - 3 * margins.gapY;

    let matched = Array.prototype.slice.call(
      barsStruct.barsY.slice(
        barsStruct.barsStartPoint.findIndex((d) => d >= xDomain[0]),
        barsStruct.barsStartPoint.findIndex((d) => d >= xDomain[1])
      )
    );

    let points = [...new Set(matched.map((e,j) => Math.round(e * 10) / 10))].sort((a,b) => d3.descending(a,b));
    let yExtent = [0, points[Math.floor(0.01 * points.length)] || globalMaxY];

    const yScale = d3.scaleLinear().domain(yExtent).range([stageHeight, 0]);
    const xScale = d3.scaleLinear().domain(xDomain).range([0, stageWidth]);

    return (
      <Wrapper className="ant-wrapper" margins={margins}>
        <div
          className="scatterplot"
          style={{ width: stageWidth, height: stageHeight }}
          ref={(elem) => (this.container = elem)}
        />
        <svg width={width} height={height} className="plot-container">
          <clipPath id="clipping">
            <rect x={0} y={0} width={stageWidth} height={stageHeight} />
          </clipPath>
          <text
            transform={`translate(${[width / 2, margins.gapY]})`}
            textAnchor="middle"
            fontSize={14}
            dy="-4"
          >
            {title}
          </text>
          <g transform={`translate(${[margins.gapX, margins.gapY]})`}>
            {
              <Grid
                scaleX={xScale}
                scaleY={yScale}
                axisWidth={stageWidth}
                axisHeight={stageHeight}
                chromoBins={chromoBins}
              />
            }
          </g>
        </svg>
      </Wrapper>
    );
  }
}
BarPlot.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  xDomain: PropTypes.array,
  results: PropTypes.object,
  title: PropTypes.string,
  chromoBins: PropTypes.object,
  updateDomain: PropTypes.func,
};
BarPlot.defaultProps = {
  xDomain: [],
  defaultDomain: [],
};
const mapDispatchToProps = (dispatch) => ({
  updateDomain: (from, to, eventSource) =>
    dispatch(updateDomain(from, to, eventSource)),
});
const mapStateToProps = (state) => ({
  defaultDomain: state.App.defaultDomain,
  chromoBins: state.App.chromoBins,
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("common")(BarPlot));
