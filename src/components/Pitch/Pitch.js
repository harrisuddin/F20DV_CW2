import * as d3 from "d3";
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
    height: 507,
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

  draw() {
    const { width, height, svgElementClass } = this.params;
    console.log(this.data);

    this.initialiseSVGElements();

    this.setSVGAttributes();

    this.setPitchXScale();
    this.setPitchYScale();

    this.setPitchElementAttributes();

    // let passData = this.data.filter((elem) => elem.eventId == "8");
    // let passData = this.data.filter((elem) =>
    //   elem.tags.some((tag) => tag.id == "301")
    // );
    let passData = this.data.filter((elem) => elem.matchId == "2499756");
    console.log(passData);

    const onHover = (_, d) => {
      this.svg.selectAll(".pass").attr("opacity", 0.4);

      this.svg.selectAll(`.event-id-${d.id}`).attr("opacity", 0.7);
    };

    const offHover = (_, d) => {
      this.svg.selectAll(".pass").attr("opacity", 0.4);
    };

    const onClick = (_, d) => {
      console.log(d);
    };

    this.svg
      .append("marker")
      .attr("id", "triangle")
      .attr("viewBox", [0, 0, 10, 10])
      .attr("refX", 0)
      .attr("refY", 5)
      .attr("markerUnits", "strokeWidth")
      .attr("markerWidth", 4)
      .attr("markerHeight", 3)
      .attr("orient", "auto")
      //   .style("fill", "blue")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "blue");

    // this.svg
    //   .selectAll(".passStartCircle")
    //   .data(passData)
    //   .join("circle")
    //   .attr("class", (d) => `pass passStartCircle event-id-${d.id}`)
    //   .attr("cx", (d) => x(d.positions[0].x))
    //   .attr("cy", (d) => y(d.positions[0].y))
    //   .attr("r", 2)
    //   .attr("stroke", "green")
    //   .attr("opacity", 0.1)
    //   .on("mouseover", onHover)
    //   .on("mouseout", offHover)
    //   .on("click", onClick);

    this.svg
      .selectAll(".passLine")
      .data(passData)
      .join("line")
      .attr("class", (d) => `pass passLine event-id-${d.id}`)
      .attr("x1", (d) => this.pitchXScale(d.positions[0].x))
      .attr("y1", (d) => this.pitchYScale(100 - d.positions[0].y))
      .attr("x2", (d) => this.pitchXScale(d.positions[1].x))
      .attr("y2", (d) => this.pitchYScale(100 - d.positions[1].y))
      .attr("stroke", (d) => {
        if (
          d.tags.some((tag) => {
            return tag.id == "301";
          })
        )
          return "green";
        if (d.eventId == 8) return "blue";
        else return "red";
      })
      .attr("stroke-width", 2)
      .attr("opacity", 0.4)
      .attr("marker-end", "url(#triangle)")
      .on("mouseover", onHover)
      .on("mouseout", offHover)
      .on("click", onClick);

    // this.svg
    //   .selectAll(".passEndCircle")
    //   .data(passData)
    //   .join("circle")
    //   .attr("class", (d) => `pass passEndCircle event-id-${d.id}`)
    //   .attr("cx", (d) => x(d.positions[1].x))
    //   .attr("cy", (d) => y(d.positions[1].y))
    //   .attr("r", 2)
    //   .attr("stroke", "red")
    //   .attr("opacity", 0.1)
    //   .on("mouseover", onHover)
    //   .on("mouseout", offHover)
    //   .on("click", onClick);
  }
}
