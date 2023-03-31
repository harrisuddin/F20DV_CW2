import * as d3 from "d3";
import parseUnicodeString from "../../parseUnicodeString";
import { WYSCOUT_ID_PLAYER_MANU_MIDFIELDERS } from "../../wyscout";

// all css to manipulate this class here
// done this to separate concerns
// this js class just gives dom elements classes that are used in the css file
import "./DualAxisLineChart.css";

export default class DualAxisLineChart {
  defaultParams = {
    /**
     * Top margin, in pixels.
     */
    marginTop: 20,

    /**
     * Right margin, in pixels.
     */
    marginRight: 20,

    /**
     * Bottom margin, in pixels.
     */
    marginBottom: 25,

    /**
     * Left margin, in pixels.
     */
    marginLeft: 50,

    /**
     * Outer width, in pixels.
     */
    width: 768,

    /**
     * Outer height, in pixels.
     */
    height: 432,

    /**
     * The height of the legend section.
     */
    legendHeight: 35,

    /**
     * The left margin to give the legend.
     */
    legendMarginLeft: 0,

    /**
     * The HTML element to insert the chart into.
     */
    elementToInsertInto: "",

    /**
     * The id to give the SVG element.
     */
    id: "",

    /**
     * The class to give the created SVG element.
     */
    svgElementClass: "dual-axis-line-chart",

    /**
     * The selected player ids to filter the data by.
     */
    selectedPlayerIds: WYSCOUT_ID_PLAYER_MANU_MIDFIELDERS,

    /**
     * A function to group the data
     */
    groupData: (d) => d.playerId,

    /**
     * The x-axis scale type.
     */
    xScaleType: d3.scalePoint, // d3.scaleUtc,

    /**
     * The first y-axis scale type.
     */
    yScaleType1: d3.scaleLinear,

    /**
     * The second y-axis scale type.
     */
    yScaleType2: d3.scaleLinear,

    /**
     * A function that maps data to x values.
     */
    xMap: (d) => d.matchId,

    /**
     * A function that maps data to y values for the first y axis.
     */
    yMap1: (d) => Number.parseFloat(d.playerankScore),

    /**
     * A function that maps data to y values for the second y axis.
     */
    yMap2: undefined, // (d) => Number.parseFloat(d.new_vaccinations_smoothed_per_million),

    /**
     * Will be used in the following way to determine whether the field is defined
     * ```
     * (d) => xDefined(xMap(d))
     * ```
     */
    xDefined: (val) => !isNaN(val),

    /**
     * Will be used in the following way to determine whether the field is defined
     * ```
     * (d) => yDefined1(yMap1(d))
     * ```
     */
    yDefined1: (val) => !isNaN(val),

    /**
     * Will be used in the following way to determine whether the field is defined
     * ```
     * (d) => yDefined2(yMap2(d))
     * ```
     */
    yDefined2: (val) => !isNaN(val),

    /**
     * True when showing the second y-axis, false otherwise.
     */
    showSecondYAxis: false,

    /**
     * A function that formats the x axis tick labels.
     */
    xAxisTickFormat: (domainValue, i) => domainValue,

    /**
     * A function that formats y axis tick labels for the first y axis.
     */
    yTickFormat1: (d) =>
      Intl.NumberFormat("en", { notation: "compact" }).format(d),

    /**
     * A function that formats y axis tick labels for the second y axis.
     */
    yTickFormat2: (d) =>
      Intl.NumberFormat("en", { notation: "compact" }).format(d),

    /**
     * The label for the first y-axis.
     */
    yLabel1:
      "2017/18 PlayeRank Score (MNU Midfielders) (Bottom Axis = EPL Gameweek)",

    /**
     * The label for the second y-axis.
     */
    yLabel2: undefined,

    /**
     * The color scale used by the paths.
     */
    colorScale: d3.schemeTableau10,

    /**
     * Callback function when one of the keys in the legend is hovered.
     */
    onLegendMouseover: undefined,

    /**
     * Callback function when one of the keys in the legend is no longer hovered.
     */
    onLegendMouseout: undefined,

    chartEndDate: undefined,
  };

  /**
   *
   * @param {any[]} data
   * @param {typeof this.defaultParams} params
   */
  constructor(data, params) {
    this.data = data;
    this.params = { ...this.defaultParams, ...params };
  }

  /**
   * Update any params, will keep previously set params.
   * @param {typeof this.defaultParams} params
   */
  setParams(params) {
    this.params = { ...this.params, ...params };
  }

  /**
   * Append the svg and necessary elements within it to the DOM.
   * If any of the elements already are in the DOM then leave them there. ie will not append multiple of the same elements.
   */
  initialiseSVGElements() {
    const { elementToInsertInto, svgElementClass, id, showSecondYAxis } =
      this.params;

    // if the svg doesn't exist then insert into dom
    if (d3.select(`#${id}`).empty()) {
      this.svg = d3
        .select(elementToInsertInto)
        .append("svg")
        .attr("id", id)
        .attr("class", svgElementClass);
    }

    // append x-axis if not there
    if (this.svg.select(".x-axis").empty()) {
      this.svg.append("g").attr("class", "x-axis");
    }

    // append first y-axis and its label if not there
    if (this.svg.select(".y-axis1").empty()) {
      this.svg
        .append("g")
        .attr("class", "y-axis y-axis1")
        .append("text")
        .attr("class", "y-axis1-label");
    }

    // append second y-axis and its label if not there
    // also check to show second axis
    if (this.svg.select(".y-axis2").empty() && showSecondYAxis) {
      this.svg
        .append("g")
        .attr("class", "y-axis y-axis2")
        .append("text")
        .attr("class", "y-axis2-label");
    }

    // append legend if not there
    if (this.svg.select(".legend").empty()) {
      this.svg.append("g").attr("class", "legend");
    }
  }

  /**
   * Set the attributes of the SVG element.
   */
  setSVGAttributes() {
    const { width, height, legendHeight, svgElementClass } = this.params;

    this.svg
      .transition()
      .duration(1000)
      .attr("width", width)
      .attr("height", height + legendHeight)
      .attr("viewBox", [0, 0, width, height + legendHeight])
      .attr("class", svgElementClass);
  }

  /**
   * Filter `this.data` and return only rows where the x and y-axes are defined.
   * Also filter for dates under/equal to `chartEndDate`.
   */
  filterDataForDefinedRows() {
    const {
      showSecondYAxis,
      yDefined1,
      yDefined2,
      xDefined,
      xMap,
      yMap1,
      yMap2,
      chartEndDate,
    } = this.params;

    let filteredData = this.data.filter((row) => xDefined(xMap(row)));
    filteredData = this.data.filter((row) => yDefined1(yMap1(row)));
    if (chartEndDate) {
      filteredData = filteredData.filter(
        (row) => xMap(row) <= new Date(chartEndDate)
      );
      // console.log(filteredData);
    }

    if (showSecondYAxis) {
      filteredData = filteredData.filter((row) => yDefined2(yMap2(row)));
    }

    return filteredData;
  }

  /**
   * Filter `this.filterDataForDefinedRows` with `this.params.selectedPlayerIds`.
   */
  filterDataBySelectedPlayerIds() {
    const { selectedPlayerIds, groupData } = this.params;

    const filteredData = this.definedData.filter((row) =>
      selectedPlayerIds.includes(groupData(row))
    );
    return filteredData;
  }

  /**
   * Group the `this.filteredData` data with `this.params.groupData`.
   */
  groupAndFilterData() {
    const { groupData } = this.params;

    const filteredGroupedData = d3.group(this.filteredData, groupData);
    return filteredGroupedData;
  }

  /**
   * Setup the data needed for the chart.
   */
  setupData() {
    this.definedData = this.filterDataForDefinedRows();
    this.filteredData = this.filterDataBySelectedPlayerIds();
    this.filteredAndGroupedData = this.groupAndFilterData();
  }

  /**
   * Set `this.xScale` using values from `this.data` and `this.params`.
   */
  setXScale() {
    const { marginRight, marginLeft, width, xScaleType, xMap } = this.params;
    const filteredData = this.filteredData;

    let domain = new Set(d3.sort(d3.map(filteredData, xMap)));

    this.xScale = xScaleType()
      .range([marginLeft, width - marginRight])
      .domain(domain.values());
  }

  /**
   * Set `this.yScale1` using values from `this.data` and `this.params`.
   */
  setYScale1() {
    const { marginTop, marginBottom, height, yScaleType1, yMap1 } = this.params;
    const filteredData = this.filteredData;

    this.yScale1 = yScaleType1()
      .range([height - marginBottom, marginTop])
      .domain(d3.extent(filteredData, yMap1));
  }

  /**
   * Set `this.yScale2` using values from `this.data` and `this.params`.
   */
  setYScale2() {
    const { marginTop, marginBottom, height, yScaleType2, yMap2 } = this.params;
    const filteredData = this.filteredData;

    this.yScale2 = yScaleType2()
      .range([height - marginBottom, marginTop])
      .domain(d3.extent(filteredData, yMap2));
  }

  /**
   * Set `this.xAxis` using `this.xScale`.
   */
  setXAxis() {
    const { width, xAxisTickFormat } = this.params;

    this.xAxis = d3
      .axisBottom(this.xScale)
      .tickSizeOuter(0)
      .tickFormat(xAxisTickFormat);
  }

  /**
   * Set `this.yAxis1` using `this.yScale1` and any related params.
   */
  setYAxis1() {
    const { height, yTickFormat1 } = this.params;

    this.yAxis1 = d3
      .axisLeft(this.yScale1)
      .ticks(height / 60)
      .tickFormat(yTickFormat1);
  }

  /**
   * Set `this.yAxis2` using `this.yScale2` and any related params.
   */
  setYAxis2() {
    const { height, yTickFormat2 } = this.params;

    this.yAxis2 = d3
      .axisRight(this.yScale2)
      .ticks(height / 60)
      .tickFormat(yTickFormat2);
  }

  /**
   * Set `this.line2` using related params and scale fields.
   */
  setLine1() {
    const { xMap, yMap1 } = this.params;

    this.line1 = d3
      .line()
      .x((d) => this.xScale(xMap(d)))
      .y((d) => this.yScale1(yMap1(d)));
  }

  /**
   * Set `this.line2` using related params and scale fields.
   */
  setLine2() {
    const { xMap, yMap2 } = this.params;

    this.line2 = d3
      .line()
      .x((d) => this.xScale(xMap(d)))
      .y((d) => this.yScale2(yMap2(d)));
  }

  /**
   * Set the x-axis shown in the svg element.
   */
  setSVGXAxis() {
    const { height, marginBottom, legendHeight } = this.params;

    this.svg
      .select(".x-axis")
      .transition()
      .duration(1000)
      .attr("transform", `translate(0,${height - marginBottom + legendHeight})`)
      .call(this.xAxis);
  }

  /**
   * Set the first y-axis shown in the svg element.
   */
  setSVGYAxis1() {
    const { marginLeft, yLabel1, legendHeight } = this.params;

    this.svg
      .select(".y-axis1")
      .transition()
      .duration(1000)
      .attr("transform", `translate(${marginLeft}, ${legendHeight})`)
      .call(this.yAxis1);

    this.svg
      .select(".y-axis1-label")
      .transition()
      .duration(1000)
      .attr("x", -marginLeft)
      .attr("y", 10)
      .text(yLabel1);
  }

  /**
   * Set the second y-axis shown in the svg element.
   */
  setSVGYAxis2() {
    const { width, marginRight, yLabel2, legendHeight } = this.params;

    this.svg
      .select(".y-axis2")
      .transition()
      .duration(1000)
      .attr("transform", `translate(${width - marginRight}, ${legendHeight})`)
      .call(this.yAxis2);

    this.svg
      .select(".y-axis2-label")
      .transition()
      .duration(1000)
      .attr("x", marginRight)
      .attr("y", 10)
      .text(yLabel2);
  }

  /**
   * If the second y-axis exists then remove it
   */
  removeSVGAxis2() {
    if (!this.svg.select(".y-axis2").empty()) {
      this.svg
        .select(".y-axis2")
        .transition()
        .duration(1000)
        .attr("opacity", 0)
        .remove();
    }
  }

  /**
   * Set the svg path of the first line
   */
  setSVGPath1() {
    const { legendHeight, colorScale } = this.params;

    console.log(this.filteredAndGroupedData);

    this.svg
      .selectAll(".y-axis1-line")
      .data(this.filteredAndGroupedData)
      .join("path")
      .attr(
        "class",
        (d, i) => `playerId playerId-${d[0]} line y-axis1-line y-axis1-line${i}`
      )
      .transition()
      .duration(1000)
      .attr("transform", `translate(0, ${legendHeight})`)
      .attr("stroke", (d, i) => colorScale[i])
      .attr("d", (d) => this.line1(d[1]));
  }

  /**
   * Set the svg path of the second line
   */
  setSVGPath2() {
    const { legendHeight, colorScale } = this.params;

    this.svg
      .selectAll(".y-axis2-line")
      .data(this.filteredAndGroupedData)
      .join("path")
      .attr("class", (d, i) => `line y-axis2-line y-axis2-line${i}`)
      .transition()
      .duration(1000)
      .attr("transform", `translate(0, ${legendHeight})`)
      .attr("stroke", (d, i) => colorScale[i])
      .attr("d", (d) => this.line2(d[1]));
  }

  /**
   * If the second y-axis exists then remove it
   */
  removeSVGPath2() {
    if (!this.svg.selectAll(".y-axis2-line").empty()) {
      this.svg
        .selectAll(".y-axis2-line")
        .transition()
        .duration(1000)
        .attr("opacity", 0)
        .remove();
    }
  }

  /**
   * Sets the legends attributes.
   *
   * Adds a circle and text for each ISO code in `this.groupAndFilterData`.
   *
   * The circle/text are given mouseover/mouseout listeners than reduce the opacity of the other non-hovered lines, circles/texts.
   */
  setLegend() {
    const {
      legendMarginLeft,
      legendHeight,
      colorScale,
      onLegendMouseover,
      onLegendMouseout,
    } = this.params;

    // set legend attributes
    const legend = this.svg
      .select(".legend")
      .attr("transform", `translate(${legendMarginLeft}, 0)`);

    // get/set necessary variables
    let filteredGroupedData = this.filteredAndGroupedData;
    let circleCircumference = 20;
    let circleR = circleCircumference / 2;
    let spaceBetween = 10;
    let wordWidth = 90;
    let distanceToNextCircle =
      circleR + spaceBetween + wordWidth + spaceBetween + circleR;

    legend
      .selectAll(".legend-circle")
      .data(filteredGroupedData)
      .join("circle")
      .attr("class", (d) => `playerId playerId-${d[0]} legend-circle`)
      .on("mouseover", onLegendMouseover)
      .on("mouseleave", onLegendMouseout)
      .transition()
      .duration(1000)
      .attr("cy", legendHeight / 2)
      .attr("cx", (d, i) => circleR + i * distanceToNextCircle)
      .attr("r", circleR)
      .style("fill", (d, i) => colorScale[i]);

    legend
      .selectAll(".legend-text")
      .data(filteredGroupedData)
      .join("text")
      .attr("class", (d) => `playerId playerId-${d[0]} legend-text`)
      .on("mouseover", onLegendMouseover)
      .on("mouseleave", onLegendMouseout)
      .transition()
      .duration(1000)
      .text((d) => parseUnicodeString(d[1][0].shortName))
      .attr("y", legendHeight / 2 + circleR / 2)
      .attr(
        "x",
        (d, i) => circleCircumference + spaceBetween + i * distanceToNextCircle
      );
  }

  /**
   * Used to draw the SVG and can be called to update the visualisation.
   */
  draw() {
    const { showSecondYAxis } = this.params;

    this.setupData();

    // initialise any/all svg elements if needed
    this.initialiseSVGElements();

    // set the svgs attributes
    this.setSVGAttributes();

    // if shouldn't show second y-axis then remove the axis and path if exists
    if (!showSecondYAxis) {
      this.removeSVGAxis2();
      this.removeSVGPath2();
    }

    // create scales for all axes
    this.setXScale();
    this.setYScale1();
    if (showSecondYAxis) this.setYScale2();

    // create all axes
    this.setXAxis();
    this.setYAxis1();
    if (showSecondYAxis) this.setYAxis2();

    // create line generators for 2 y axes
    this.setLine1();
    if (showSecondYAxis) this.setLine2();

    // set the x-axis attributes
    this.setSVGXAxis();

    // set the first y axis attributes
    this.setSVGYAxis1();

    // set the second y axis attributes
    if (showSecondYAxis) {
      this.setSVGYAxis2();
    }

    // add lines to svg
    // set the first path attributes
    this.setSVGPath1();

    // set the second path attributes
    if (showSecondYAxis) {
      this.setSVGPath2();
    }

    // set/draw the legend
    this.setLegend();
  }
}
