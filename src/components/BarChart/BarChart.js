import * as d3 from "d3";
import "./BarChart.css";

export default class BarChart {
  defaultParams = {
    /**
     * The element to insert the SVG into.
     */
    elementToInsertInto: "",

    /**
     * The class to give the SVG.
     */
    svgElementClass: "bar-chart",

    /**
     * The id to give the SVG element.
     */
    id: "",

    /**
     * The width of the SVG.
     */
    width: 768,

    /**
     * The height of the SVG.
     */
    height: 432,

    marginTop: 20, // the top margin, in pixels
    marginRight: 0, // the right margin, in pixels
    marginBottom: 30, // the bottom margin, in pixels
    marginLeft: 40, // the left margin, in pixels

    /**
     * Function that maps the data to the values for the x-axis.
     */
    xMap: (d) => d.name,

    xPadding: 0.1, // amount of x-range to reserve to separate bars

    /**
     * Function that maps the data to the values for the y-axis.
     */
    yMap: (d) =>
      Number.parseFloat(d.through_balls) / Number.parseFloat(d.appearances),

    /**
     * Return true is x-axis value is defined.
     */
    xDefined: (d) => d,

    /**
     * Return true is y-axis value is defined.
     */
    yDefined: (d) => !isNaN(d),

    /**
     * The y-axis label.
     */
    yLabel: "Through Balls / Match",
  };

  /**
   * @param {*} data
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
   * Append the svg and any non-dynamic elements within it to the DOM.
   * If any of the elements already are in the DOM then leave them there. ie will not append multiple of the same elements.
   */
  initialiseSVGElements() {
    const { elementToInsertInto, svgElementClass, id } = this.params;

    // if the svg doesn't exist then insert into dom
    if (d3.select(`#${id}`).empty()) {
      this.svg = d3
        .select(elementToInsertInto)
        .append("svg")
        .attr("id", id)
        .attr("class", svgElementClass);
    }

    // append x-axis if needed
    if (this.svg.select(".x-axis").empty()) {
      this.svg.append("g").classed("x-axis", true);
    }

    // append y-axis if needed
    if (this.svg.select(".y-axis").empty()) {
      this.svg
        .append("g")
        .classed("y-axis", true)
        .append("text")
        .classed("y-axis-label", true);
    }

    // append bars group if needed
    if (this.svg.select(".bars").empty()) {
      this.svg.append("g").classed("bars", true);
    }
  }

  /**
   * Set the attributes of the SVG element.
   */
  setSVGAttributes() {
    const { width, height, svgElementClass } = this.params;

    this.svg
      .transition()
      .duration(1000)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("class", svgElementClass);
  }

  draw() {
    const {
      xMap,
      yMap,
      xPadding,
      xDefined,
      yDefined,
      width,
      height,
      marginLeft,
      marginRight,
      marginBottom,
      marginTop,
      yLabel,
    } = this.params;

    // initialise all non-dynamic dom elements
    this.initialiseSVGElements();

    // set the base svg attributes
    this.setSVGAttributes();

    const filteredData = d3.filter(
      this.data,
      (row) => xDefined(xMap(row)) && yDefined(yMap(row))
    );
    console.log(filteredData.find((row) => row.name.includes("Pogba")));
    const X = d3.map(filteredData, xMap);
    const Y = d3.map(filteredData, yMap);

    const topPlayers = d3
      .groupSort(filteredData, ([row]) => -yMap(row), xMap)
      .slice(0, 8);

    const topPlayersHasPogba = topPlayers.some((player) =>
      player.includes("Pogba")
    );
    if (!topPlayersHasPogba) {
      topPlayers.push("Paul Pogba");
    }

    const xDomain = new d3.InternSet(topPlayers);
    const xRange = [marginLeft, width - marginRight];
    const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);

    const yDomain = [0, d3.max(Y)];
    const yRange = [height - marginBottom, marginTop];
    const yScale = d3.scaleLinear(yDomain, yRange);

    // Omit any data not present in the x-domain.
    const I = d3.range(X.length).filter((i) => xDomain.has(X[i]));

    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40);

    // const formatValue = yScale.tickFormat(100, yFormat);
    const title = (i) => `${X[i]}\n${Y[i]}`;

    console.log(X, Y, I);

    this.svg
      .select(".y-axis")
      .transition()
      .duration(1000)
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      // .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          // .clone()
          .transition()
          .duration(1000)
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1)
      )
      .call((g) =>
        g
          .select(".y-axis-label")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel)
      );

    const bars = this.svg
      .select(".bars")
      .selectAll("rect")
      .data(I)
      .join("rect")
      .classed("bar", true)
      .attr("x", (i) => xScale(X[i]))
      .attr("y", (i) => yScale(Y[i]))
      .attr("height", (i) => yScale(0) - yScale(Y[i]))
      .attr("width", xScale.bandwidth());

    bars.html((i) => `<title>${title(i)}</title>`);

    this.svg
      .select(".x-axis")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);
  }
}
