import * as d3 from "d3";
import {
  WYSCOUT_EVENT_PASS,
  WYSCOUT_EVENT_PASS_HIGH_PASS,
  WYSCOUT_EVENT_PASS_SMART_PASS,
  WYSCOUT_EVENT_SHOT,
  WYSCOUT_TAGS,
} from "../../wyscout";
import "./Pitch.css";

export default class Pitch {
  defaultParams = {
    /**
     * The element to insert the SVG into.
     */
    elementToInsertInto: "",

    /**
     * The class to give the SVG.
     */
    svgElementClass: "pitch-chart",

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
     * True when showing shots visualisation.
     */
    showShots: false,

    /**
     * The array that controls the shot visualisations. Will control the appearance of each shot circle.
     */
    selectedShots: [
      {
        tag: WYSCOUT_TAGS[101],
        stroke: d3.schemeSet1[0],
        fill: d3.schemeSet1[0],
        opacityClass: "opacity-40",
        opacityClassHighlighted: "opacity-80",
      },
      {
        tag: WYSCOUT_TAGS[1801],
        stroke: d3.schemeSet1[1],
        fill: d3.schemeSet1[1],
        opacityClass: "opacity-40",
        opacityClassHighlighted: "opacity-80",
      },
      {
        tag: WYSCOUT_TAGS[1802],
        stroke: d3.schemeSet1[2],
        fill: "transparent",
        opacityClass: "opacity-60",
        opacityClassHighlighted: "opacity-90",
      },
    ],

    /**
     * True when showing pass visualisation.
     */
    showPasses: true,

    /**
     * Similar to selectedShots.
     */
    selectedPasses: [
      {
        tag: WYSCOUT_TAGS[301],
        stroke: d3.schemeSet1[0],
        fill: d3.schemeSet1[0],
        opacityClass: "opacity-40",
        opacityClassHighlighted: "opacity-80",
      },
      {
        tag: WYSCOUT_TAGS[302],
        stroke: d3.schemeSet1[1],
        fill: d3.schemeSet1[1],
        opacityClass: "opacity-40",
        opacityClassHighlighted: "opacity-80",
      },
    ],

    /**
     * The margin left to give the legend.
     */
    legendMarginLeft: 2.5,

    /**
     * The margin top to give the legend.
     */
    legendMarginTop: 25,

    /**
     * The height of the legend.
     */
    legendHeight: 25,

    /**
     * The label of the chart.
     */
    chartLabel: "Paul Pogba 2017/18 Assist/Key Pass Map",

    /**
     * The margin left of the chart label.
     */
    chartLabelMarginLeft: 2.5,
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
   * Append the svg and necessary elements within it to the DOM.
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

    this.initialisePitchElements();

    // check the passes marker doesn't exist and if so add to dom
    if (this.svg.select("#pass-marker").empty()) {
      this.svg.append("marker").attr("id", "pass-marker");
    }

    // check the shots legend doesn't exist and if so then add to dom
    if (this.svg.select(".legend").empty()) {
      this.svg.append("g").classed("legend", true);
    }

    // same for chart label
    if (this.svg.select(".chart-label").empty()) {
      this.svg.append("text").classed("chart-label", true);
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
   * Set the attributes of the pass marker.
   */
  setPassMarkerAttributes() {
    this.svg
      .select("#pass-marker")
      .attr("viewBox", [0, 0, 10, 10])
      .attr("refX", 0)
      .attr("refY", 5)
      .attr("markerUnits", "strokeWidth")
      .attr("markerWidth", 4)
      .attr("markerHeight", 3)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z");
  }

  /**
   * Set `this.pitchXScale`
   */
  setPitchXScale() {
    const { width } = this.params;

    this.pitchXScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
  }

  /**
   * Set `this.pitchYScale`
   */
  setPitchYScale() {
    const { height } = this.params;

    this.pitchYScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);
  }

  /**
   * Append all the pitch related elements (e.g. 6 yard box, halfway line, etc)
   * If any of the elements already are in the DOM then leave them there. ie will not append multiple of the same elements.
   */
  initialisePitchElements() {
    // append pitch outline rect if needed
    if (this.svg.select(".pitch-outline").empty()) {
      this.svg.append("rect").classed("pitch-outline", true);
    }

    // append left 18 yard box if needed
    if (this.svg.select(".box-18-yard-left").empty()) {
      this.svg.append("rect").classed("box-18-yard box-18-yard-left", true);
    }

    // same for left 6 yard box
    if (this.svg.select(".box-6-yard-left").empty()) {
      this.svg.append("rect").classed("box-6-yard box-6-yard-left", true);
    }

    // same for left pen spot
    if (this.svg.select(".pen-spot-left").empty()) {
      this.svg.append("circle").classed("pen-spot pen-spot-left", true);
    }

    // same for pitch center line
    if (this.svg.select(".pitch-center-line").empty()) {
      this.svg.append("line").classed("pitch-center pitch-center-line", true);
    }

    // same for pitch center spot
    if (this.svg.select(".pitch-center-spot").empty()) {
      this.svg.append("circle").classed("pitch-center pitch-center-spot", true);
    }

    // same for pitch center circle
    if (this.svg.select(".pitch-center-circle").empty()) {
      this.svg
        .append("circle")
        .classed("pitch-center pitch-center-circle", true);
    }

    // same for 18 yard box
    if (this.svg.select(".box-18-yard-right").empty()) {
      this.svg.append("rect").classed("box-18-yard box-18-yard-right", true);
    }

    // same for 6 yard box
    if (this.svg.select(".box-6-yard-right").empty()) {
      this.svg.append("rect").classed("box-6-yard box-6-yard-right", true);
    }

    // same for right pen spot
    if (this.svg.select(".pen-spot-right").empty()) {
      this.svg.append("circle").classed("pen-spot pen-spot-right", true);
    }
  }

  /**
   * set/draw the pitch lines (e.g. 6 yard box, halfway line, etc)
   */
  setPitchElementAttributes() {
    const { pitchXScale, pitchYScale } = this;
    const { width, height } = this.params;

    // pitch outlines are from https://apidocs.wyscout.com/assets/images/WyscoutDataCoordinates.png

    // pitch outline
    this.svg
      .select(".pitch-outline")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("stroke", "black");

    // left 18 yard box
    this.svg
      .select(".box-18-yard-left")
      .attr("x", 0)
      .attr("y", pitchYScale(100 - 19))
      .attr("width", pitchXScale(16))
      .attr("height", pitchYScale(19) - pitchYScale(100 - 19))
      .attr("fill", "none")
      .attr("stroke", "black");

    // left 6 yard box
    this.svg
      .select(".box-6-yard-left")
      .attr("x", 0)
      .attr("y", pitchYScale(100 - 37))
      .attr("width", pitchXScale(6))
      .attr("height", pitchYScale(37) - pitchYScale(100 - 37))
      .attr("fill", "none")
      .attr("stroke", "black");

    // left penalty spot
    this.svg
      .select(".pen-spot-left")
      .attr("cx", pitchXScale(10))
      .attr("cy", pitchYScale(50))
      .attr("r", 5);

    // halfway line
    this.svg
      .select(".pitch-center-line")
      .attr("x1", pitchXScale(50))
      .attr("x2", pitchXScale(50))
      .attr("y1", pitchYScale(0))
      .attr("y2", pitchYScale(100))
      .attr("stroke", "black");

    // center pitch spot
    this.svg
      .select(".pitch-center-spot")
      .attr("cx", pitchXScale(50))
      .attr("cy", pitchYScale(50))
      .attr("r", 5);

    // center pitch circle
    this.svg
      .select(".pitch-center-circle")
      .attr("cx", pitchXScale(50))
      .attr("cy", pitchYScale(50))
      .attr("r", pitchXScale(7))
      .attr("fill", "none")
      .attr("stroke", "black");

    // right 18 yard box
    this.svg
      .select(".box-18-yard-right")
      .attr("x", pitchXScale(100 - 16))
      .attr("y", pitchYScale(100 - 19))
      .attr("width", pitchXScale(16))
      .attr("height", pitchYScale(19) - pitchYScale(100 - 19))
      .attr("fill", "none")
      .attr("stroke", "black");

    // right 6 yard box
    this.svg
      .select(".box-6-yard-right")
      .attr("x", pitchXScale(100 - 6))
      .attr("y", pitchYScale(100 - 37))
      .attr("width", pitchXScale(6))
      .attr("height", pitchYScale(37) - pitchYScale(100 - 37))
      .attr("fill", "none")
      .attr("stroke", "black");

    // right penalty spot
    this.svg
      .select(".pen-spot-right")
      .attr("cx", pitchXScale(100 - 10))
      .attr("cy", pitchYScale(50))
      .attr("r", 5);
  }

  /**
   * Set/draw the chart label
   */
  setChartLabelAttributes() {
    const { chartLabel, chartLabelMarginLeft } = this.params;

    this.svg
      .select(".chart-label")
      .attr("transform", `translate(${chartLabelMarginLeft}, 0)`)
      .text(chartLabel);
  }

  /**
   * Remove all the shot elements from the DOM.
   */
  removeShotsElements() {
    this.svg
      .selectAll(".shot")
      .transition()
      .duration(1000)
      .style("opacity", 0)
      .remove();
  }

  /**
   * Remove all the pass elements from the DOM.
   */
  removePassElements() {
    this.svg
      .selectAll(".pass")
      .transition()
      .duration(1000)
      .style("opacity", 0)
      .remove();
  }

  /**
   * Return `selectedShots` or `selectedPasses` depending on `showPasses` and `showShots`
   */
  getSelectedEvents() {
    const { selectedPasses, selectedShots, showPasses, showShots } =
      this.params;

    if (showPasses) return selectedPasses;
    if (showShots) return selectedShots;
  }

  /**
   * Get the first element in `selectedShots` or `selectedPasses` that has a matching tag in the `event`.
   */
  getLegendForEvent(event) {
    let selectedEvents = this.getSelectedEvents();

    return selectedEvents.filter((ev) =>
      event.tags.some((tag) => ev.tag.id === tag.id)
    )[0];
  }

  /**
   * The function for when a pass/shot element is hovered.
   */
  onMouseover(legend) {
    this.svg
      .selectAll(`.tag-${legend.tag.id}`)
      .classed(legend.opacityClass, false)
      .classed(legend.opacityClassHighlighted, true);
  }

  /**
   * The function for when a pass/shot element is no longer hovered.
   */
  onMouseout(legend) {
    this.svg
      .selectAll(`.tag-${legend.tag.id}`)
      .classed(legend.opacityClass, true)
      .classed(legend.opacityClassHighlighted, false);
  }

  /**
   * Filter the data to only show shot events and draw those on the pitch. Display the shots with different colors as specified by `selectedShots`
   */
  drawShots() {
    const { selectedShots } = this.params;

    // filter the data so only shot events are shown
    const shotData = this.data.filter(
      (event) => event.eventId === WYSCOUT_EVENT_SHOT
    );

    const onClick = (_, d) => {
      console.log(d);
    };

    // draw the shot circles
    this.svg
      .selectAll(".shot")
      .data(shotData)
      .join("circle")
      .on("mouseover", (_, d) => {
        let legend = this.getLegendForEvent(d);
        this.onMouseover(legend);
      })
      .on("mouseout", (_, d) => {
        let legend = this.getLegendForEvent(d);
        this.onMouseout(legend);
      })
      .on("click", onClick)
      .transition()
      .duration(1000)
      .attr("class", (d) => {
        let classes = `shot event-id-${d.id}`;
        let legend = this.getLegendForEvent(d);
        classes += ` tag-${legend.tag.id} ${legend.opacityClass}`;
        return classes;
      })
      .attr("cx", (d) => this.pitchXScale(d.positions[0].x))
      .attr("cy", (d) => this.pitchYScale(100 - d.positions[0].y))
      .attr("r", 8)
      .attr("stroke", (d) => this.getLegendForEvent(d).stroke)
      .attr("fill", (d) => this.getLegendForEvent(d).fill);
  }

  /**
   * Filter the data so only passes with tags in `selectedPasses` are shown.
   * Display these passes as lines with different colors.
   */
  drawPasses() {
    const { selectedPasses } = this.params;

    const passData = this.data.filter((event) => {
      return event.tags.some((tag) =>
        selectedPasses.some((selectedTag) => selectedTag.tag.id === tag.id)
      );
    });

    const onClick = (_, d) => {
      console.log(d);
    };

    this.svg
      .selectAll(".pass")
      .data(passData)
      .join("line")
      .on("mouseover", (_, d) => {
        let legend = this.getLegendForEvent(d);
        this.onMouseover(legend);
      })
      .on("mouseout", (_, d) => {
        let legend = this.getLegendForEvent(d);
        this.onMouseout(legend);
      })
      .on("click", onClick)
      .transition()
      .duration(1000)
      .attr("class", (d) => {
        let classes = `pass event-id-${d.id}`;
        let legend = this.getLegendForEvent(d);
        classes += ` tag-${legend.tag.id} ${legend.opacityClass}`;
        return classes;
      })
      .attr("x1", (d) => this.pitchXScale(d.positions[0].x))
      .attr("y1", (d) => this.pitchYScale(100 - d.positions[0].y))
      .attr("x2", (d) => this.pitchXScale(d.positions[1].x))
      .attr("y2", (d) => this.pitchYScale(100 - d.positions[1].y))
      .attr("stroke", (d) => this.getLegendForEvent(d).stroke)
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#pass-marker)");
  }

  /**
   * Draw the pass and/or shot legend
   */
  drawLegend() {
    const { legendMarginLeft, legendMarginTop, legendHeight } = this.params;

    // get/set necessary variables
    let selectedEvents = this.getSelectedEvents();
    let circleCircumference = 20;
    let circleR = circleCircumference / 2;
    let spaceBetween = 10;
    let wordWidth = 60;
    let distanceToNextCircle =
      circleR + spaceBetween + wordWidth + spaceBetween + circleR;

    const legend = this.svg
      .select(".legend")
      .attr("transform", `translate(${legendMarginLeft}, ${legendMarginTop})`);

    legend
      .selectAll(".legend-circle")
      .data(selectedEvents)
      .join("circle")
      .on("mouseover", (_, d) => this.onMouseover(d))
      .on("mouseout", (_, d) => this.onMouseout(d))
      .attr("class", (d) => `legend-circle tag-${d.tag.id} ${d.opacityClass}`)
      .transition()
      .duration(1000)
      .attr("cy", legendHeight / 2)
      .attr("cx", (d, i) => circleR + i * distanceToNextCircle)
      .attr("r", circleR)
      .attr("fill", (d) => d.fill)
      .attr("stroke", (d) => d.stroke);

    legend
      .selectAll(".legend-text")
      .data(selectedEvents)
      .join("text")
      .on("mouseover", (_, d) => this.onMouseover(d))
      .on("mouseout", (_, d) => this.onMouseout(d))
      .attr("class", (d) => `legend-text tag-${d.tag.id} ${d.opacityClass}`)
      .transition()
      .duration(1000)
      .text((d) => d.tag.description)
      .attr("y", legendHeight / 2 + circleR / 2)
      .attr(
        "x",
        (d, i) => circleCircumference + spaceBetween + i * distanceToNextCircle
      );
  }

  draw() {
    const { showShots, showPasses } = this.params;

    // initialise all non-dynamic dom elements
    this.initialiseSVGElements();

    // set the base svg attributes
    this.setSVGAttributes();

    // set the x and y scales
    this.setPitchXScale();
    this.setPitchYScale();

    // set/draw pitch elements
    this.setPitchElementAttributes();

    // set/draw chart label
    this.setChartLabelAttributes();

    // draw shots
    if (showShots) {
      this.removePassElements();
      this.drawShots();
    }

    // draw passes
    if (showPasses) {
      this.removeShotsElements();
      this.setPassMarkerAttributes();
      this.drawPasses();
    }

    // draw legend
    this.drawLegend();
  }
}
