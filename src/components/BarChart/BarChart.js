import * as d3 from "d3";
import "./BarChart.css";
import addOrdinalSuffix from "../../ordinal";

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

    /**
     * The top margin, in pixels
     */
    marginTop: 20,

    /**
     * The right margin, in pixels
     */
    marginRight: 0,

    /**
     * The bottom margin, in pixels
     */
    marginBottom: 30,

    /**
     * The left margin, in pixels
     */
    marginLeft: 40,

    /**
     * Function that maps the data to the values for the x-axis.
     */
    xMap: (d) => d.name,

    /**
     * Amount of x range to separate bars.
     */
    xPadding: 0.15,

    /**
     * The nth top player to start the chart from. Will then display `numberOfBars` number of players.
     */
    chartStartingIndex: 0,

    /**
     * The number of bars to display.
     */
    numberOfBars: 10,

    /**
     * The name of the selected player. Will be displayed in every chart no matter how large/little their y-axis value.
     */
    selectedPlayerName: "Paul Pogba",

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
    yLabel: "Up To 09/2020 Through Balls / Match",

    /**
     * The function to format the x axis ticks
     * @param {String} domainValue
     * @param {number} i
     */
    xAxisTickFormat: (domainValue, i) => {
      let splitNames = domainValue.split(" ");

      // if only has one name
      if (splitNames.length === 1) return splitNames[0];

      // example "Jack" -> "J."
      let shortFirstName = splitNames[0].substring(0, 1) + ".";

      // get the last name
      // if >= 9 chars then make last name length 6 and then add ...
      let lastName = splitNames[splitNames.length - 1];
      if (lastName.length >= 9) lastName = lastName.substring(0, 6) + "...";

      return shortFirstName + " " + lastName;
    },

    /**
     * The fill colour for the bars.
     */
    barFill: d3.schemeTableau10[0],

    /**
     * The fill colour for the selected player bar.
     */
    selectedPlayerBarFill: d3.schemeTableau10[1],
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

  /**
   * Set `this.filteredData` equal to `this.data` filtered where `xMap` and `yMap` are valid.
   */
  setFilteredData() {
    const { xMap, yMap, xDefined, yDefined } = this.params;

    this.filteredData = d3.filter(
      this.data,
      (row) => xDefined(xMap(row)) && yDefined(yMap(row))
    );
  }

  /**
   * Set `this.xValues` and `this.yValues which maps `this.filteredData` using their mapping functions.
   */
  setXAndYValues() {
    const { xMap, yMap } = this.params;

    this.xValues = d3.map(this.filteredData, xMap);
    this.yValues = d3.map(this.filteredData, yMap);
  }

  /**
   * Set `this.xDomain` to a set with the top `numberOfBars` player names including the `selectedPlayerName`.
   */
  setXDomain() {
    const { xMap, yMap, numberOfBars, selectedPlayerName, chartStartingIndex } =
      this.params;

    // group sort will first sort by yMap in descending order
    // then will map the results using xMap
    // returns list of length `numberOfBars - 1`
    let topPlayers = d3.groupSort(
      this.filteredData,
      ([row]) => -yMap(row),
      xMap
    );

    /**
     * All the players from `this.filteredData` grouped and sorted.
     */
    this.allGroupSortedPlayers = topPlayers;

    topPlayers = topPlayers.slice(
      chartStartingIndex,
      chartStartingIndex + numberOfBars
    );

    // check the top players contains the selected player name
    const topPlayersHasSelectedPlayer = topPlayers.some(
      (player) => player === selectedPlayerName
    );

    // if not then add the player to the list
    if (!topPlayersHasSelectedPlayer) {
      topPlayers.push(selectedPlayerName);
    }

    this.xDomain = new d3.InternSet(topPlayers);
  }

  /**
   * Set `this.xScale` which is used for the x-axis.
   */
  setXScale() {
    const { marginLeft, width, marginRight, xPadding } = this.params;

    const xRange = [marginLeft, width - marginRight];
    this.xScale = d3.scaleBand(this.xDomain, xRange).padding(xPadding);
  }

  /**
   * Set `this.yScale`
   */
  setYScale() {
    const { height, marginBottom, marginTop } = this.params;

    const yDomain = [0, d3.max(this.yValues)];
    const yRange = [height - marginBottom, marginTop];
    this.yScale = d3.scaleLinear(yDomain, yRange);
  }

  /**
   * Set `this.selectedIndexes` which are the indexes of the players to display.
   */
  setSelectedIndexes() {
    this.selectedIndexes = d3
      .range(this.xValues.length)
      .filter((i) => this.xDomain.has(this.xValues[i]));
  }

  /**
   * Set `this.xAxis`.
   */
  setXAxis() {
    const { xAxisTickFormat } = this.params;

    this.xAxis = d3
      .axisBottom(this.xScale)
      .tickSizeOuter(0)
      .tickFormat(xAxisTickFormat);
  }

  /**
   * Set `this.yAxis`.
   */
  setYAxis() {
    const { height } = this.params;

    this.yAxis = d3.axisLeft(this.yScale).ticks(height / 40);
  }

  /**
   * Set/draw the x-axis shown in the svg element.
   */
  setSVGXAxis() {
    const { height, marginBottom } = this.params;

    this.svg
      .select(".x-axis")
      .transition()
      .duration(1000)
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(this.xAxis);
  }

  addRankingPartOfLabel() {
    const { chartStartingIndex } = this.params;

    let ranking = addOrdinalSuffix(chartStartingIndex + 1);
    return ` (Starting From ${ranking} Ranking)`;
  }

  /**
   * Set/draw the x-axis shown in the svg element.
   */
  setSVGYAxis() {
    const { marginLeft, width, marginRight, yLabel } = this.params;

    this.svg
      .select(".y-axis")
      .transition()
      .duration(1000)
      .attr("transform", `translate(${marginLeft},0)`)
      .call(this.yAxis)
      .call((g) =>
        g
          .selectAll(".tick line")
          .transition()
          .duration(1000)
          .attr("x2", width - marginLeft - marginRight)
      );

    this.svg
      .select(".y-axis-label")
      .transition()
      .duration(1000)
      .attr("x", -marginLeft)
      .attr("y", 12.5)
      .text(yLabel + this.addRankingPartOfLabel());
  }

  /**
   * Set/draw the rect bars.
   */
  setSVGRects() {
    const { selectedPlayerName, barFill, selectedPlayerBarFill } = this.params;

    const bars = this.svg
      .select(".bars")
      .selectAll("rect")
      .data(this.selectedIndexes)
      .join("rect")
      .classed("bar", true)
      .attr("fill", (i) => {
        let playerName = this.xValues[i];
        if (playerName === selectedPlayerName) return selectedPlayerBarFill;
        return barFill;
      })
      .call((barsInCall) => {
        barsInCall
          .transition()
          .duration(1000)
          .attr("x", (i) => this.xScale(this.xValues[i]))
          .attr("y", (i) => this.yScale(this.yValues[i]))
          .attr("height", (i) => this.yScale(0) - this.yScale(this.yValues[i]))
          .attr("width", this.xScale.bandwidth());
      });

    const title = (i) => {
      let playerName = this.xValues[i];
      let yValue = this.yValues[i];
      let ranking = addOrdinalSuffix(
        this.allGroupSortedPlayers.findIndex(
          (playerName) => this.xValues[i] === playerName
        ) + 1
      );
      return `${playerName}\n${yValue}\n${ranking} Ranking`;
    };
    bars.html((i) => `<title>${title(i)}</title>`);
  }

  draw() {
    // initialise all non-dynamic dom elements
    this.initialiseSVGElements();

    // set the base svg attributes
    this.setSVGAttributes();

    // setup data needed to draw
    this.setFilteredData();
    this.setXAndYValues();

    // setup x domain, x and y scales
    this.setXDomain();
    this.setXScale();
    this.setYScale();

    // set the selected player indexes
    this.setSelectedIndexes();

    // set the x and y axis
    this.setXAxis();
    this.setYAxis();

    // draw the x, y axis, and bars
    this.setSVGXAxis();
    this.setSVGYAxis();
    this.setSVGRects();
  }
}
