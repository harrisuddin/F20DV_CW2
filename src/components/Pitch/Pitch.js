import * as d3 from "d3";
import sampleSize from "lodash.samplesize";
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
    chartLabel:
      "2017/18 Pass Clusters (TP = Total Passes) (50% of passes shown)",

    /**
     * The margin left of the chart label.
     */
    chartLabelMarginLeft: 2.5,

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
    showPasses: false,

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
     * True when showing passes cluster visualisation.
     */
    showPassClusters: true,

    /**
     * The initial position of each centroid.
     */
    initialCentroids: [
      {
        id: 0,
        x: 25,
        y: 20,
      },
      {
        id: 1,
        x: 25,
        y: 80,
      },
      {
        id: 2,
        x: 50,
        y: 50,
      },
      {
        id: 3,
        x: 75,
        y: 20,
      },
      {
        id: 4,
        x: 75,
        y: 80,
      },
    ],

    /**
     * True if you want to use the initial centroids array or will randomly generate them.
     */
    useInitialCentroids: false,

    /**
     * Used if useInitialCentroids is false
     */
    numberOfCentroids: 10,

    /**
     * The color scale used for the cluster vis.
     */
    clusterColorScale: d3.schemePaired,

    /**
     * A number between 0-1. Determines the % of passes to display for the cluster vis.
     */
    passClusterSamplePercent: 0.5,
  };

  /**
   * @param {*} data
   * @param {typeof this.defaultParams} params
   */
  constructor(data, params) {
    this.data = data;
    this.params = { ...this.defaultParams, ...params };
    this.setupClustering();
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

    // check the legend doesn't exist and if so then add to dom
    if (this.svg.select(".legend").empty()) {
      this.svg.append("g").classed("legend", true);
    }

    // same for chart label
    if (this.svg.select(".chart-label").empty()) {
      this.svg.append("text").classed("chart-label", true);
    }

    // same for cluster legend
    if (this.svg.select(".cluster-legend").empty()) {
      this.svg.append("g").classed("cluster-legend", true);
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
    const { showPassClusters } = this.params;

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

    if (this.svg.select(".pitch-right-halfspace").empty() && showPassClusters) {
      this.svg.append("rect").classed("cluster pitch-right-halfspace", true);
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

    // the right halfspace
    this.svg
      .select(".pitch-right-halfspace")
      .attr("x", this.pitchXScale(16))
      .attr("y", this.pitchYScale(100 - 60))
      .attr("height", this.pitchYScale(100 - 20))
      .attr("width", this.pitchXScale(84 - 16))
      .attr("fill", "none")
      .attr("stroke", "black");
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

    const selectedPassEvents = this.data.filter((event) => {
      return event.tags.some((tag) =>
        selectedPasses.some((selectedTag) => selectedTag.tag.id === tag.id)
      );
    });

    const onClick = (_, d) => {
      console.log(d);
    };

    this.svg
      .selectAll(".pass")
      .data(selectedPassEvents)
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
   * Remove all cluster elements and the cluster legend.
   */
  removeClusterElements() {
    this.svg
      .selectAll(".cluster")
      .transition()
      .duration(1000)
      .style("opacity", 0)
      .remove();
    this.svg
      .select(".cluster-legend")
      .transition()
      .duration(1000)
      .style("opacity", 0)
      .remove();
  }

  /**
   * Runs the k means clustering algorithm for this specific case.
   */
  kMeansClustering() {
    const { numberOfCentroids, useInitialCentroids, initialCentroids } =
      this.params;

    const points = this.mappedPassEvents;

    let centroids;
    let k;

    // if using initial centroids then just use them
    if (useInitialCentroids) {
      centroids = initialCentroids;
      k = centroids.length;
    } else {
      // otherwise randomly generate the centroids
      centroids = [];
      k = numberOfCentroids;
      for (let i = 0; i < k; i++) {
        let x = 0;
        let y = 0;
        // stops x and/or y becoming 0
        while (x === 0 || y === 0) {
          x = Math.random();
          y = Math.random();
        }
        centroids.push({ x, y, id: i });
      }
    }

    /**
     * euclidean distance formula = sqrt((x2 - x1)^2 + (y2 - y1)^2)
     */
    const euclideanDistance = (point, centroid) => {
      return Math.sqrt(
        (point.x - centroid.x) ** 2 + (point.y - centroid.y) ** 2
      );
    };

    /**
     * Returns the points new closest clusters id.
     */
    const getPointsClosestCentroid = (
      point,
      closestCentroidID,
      closestDistance
    ) => {
      for (let i = 0; i < k; i++) {
        const centroid = centroids[i];
        const distance = euclideanDistance(point, centroid);

        if (distance < closestDistance) {
          closestCentroidID = centroid.id;
          closestDistance = distance;
        }
      }

      return closestCentroidID;
    };

    // Assign each point to the closest centroid
    for (const point of points) {
      let closestCentroidID = 0;
      let closestDistance = Infinity;

      closestCentroidID = getPointsClosestCentroid(
        point,
        closestCentroidID,
        closestDistance
      );

      point.cluster = closestCentroidID;
    }

    /**
     * Move each centroid to the center of its cluster
     */
    const moveCentroidsToClusterCenter = () => {
      for (let i = 0; i < k; i++) {
        const centroid = centroids[i];
        let clusterSize = 0;
        let totalX = 0;
        let totalY = 0;
        for (const point of points) {
          if (point.cluster === i) {
            clusterSize++;
            totalX += point.x;
            totalY += point.y;
          }
        }
        if (clusterSize > 0) {
          centroid.x = totalX / clusterSize;
          centroid.y = totalY / clusterSize;
        }
      }
    };

    moveCentroidsToClusterCenter();

    // Repeat previous 2 blocks until convergence
    let iterations = 1;
    let maxIterations = 100;
    while (iterations <= maxIterations) {
      let clustersChanged = false;
      // Assign each point to the closest centroid
      for (const point of points) {
        let closestCentroidID = point.cluster;
        let closestDistance = euclideanDistance(
          point,
          centroids.find((centroid) => centroid.id === closestCentroidID)
        );

        closestCentroidID = getPointsClosestCentroid(
          point,
          closestCentroidID,
          closestDistance
        );

        if (closestCentroidID !== point.cluster) {
          point.cluster = closestCentroidID;
          clustersChanged = true;
        }
      }
      if (!clustersChanged) {
        // Convergence achieved
        break;
      }
      moveCentroidsToClusterCenter();
      iterations++;
    }

    return { points, centroids };
  }

  /**
   * Setup the class fields needed for the clustering. Calls the k means clustering method.
   * Ideally this method will not be called in draw for performance reasons.
   */
  setupClustering() {
    const { passClusterSamplePercent } = this.params;

    // get all pass events
    const allPassEvents = this.data.filter(
      (event) => event.eventId === WYSCOUT_EVENT_PASS
    );

    this.passEventsForClustering = sampleSize(
      allPassEvents,
      allPassEvents.length * passClusterSamplePercent
    );

    this.mappedPassEvents = this.passEventsForClustering.map((event, index) => {
      return {
        /**
         * The id of the cluster the point is assigned to.
         */
        cluster: 0,

        /**
         * The event starting x position.
         */
        x: event.positions[0].x,

        /**
         * The event starting y position.
         */
        y: event.positions[0].y,

        /**
         * The event ending x position.
         */
        x2: event.positions[1].x,

        /**
         * The event ending x position.
         */
        y2: event.positions[1].y,

        /**
         * The index of the event in the original array
         */
        eventIndex: index,
      };
    });

    let { points, centroids } = this.kMeansClustering();

    this.clusteredPassEvents = points;

    // sort the centroids by x pos from lowest to highest
    // so its easy to see how the player moves from the start to the end of the pitch
    this.centroids = centroids.sort(
      (centroidA, centroidB) => centroidA.x - centroidB.x
    );
  }

  /**
   * Called when the cluster center or cluster pass is hovered. Will increase the opacity of the selected cluster.
   */
  onClusterCenterMouseover(_, clusterId) {
    this.svg
      .selectAll(`.cluster-pass.cluster-${clusterId}`)
      .classed("opacity-20", false);
    this.svg
      .selectAll(`.cluster-pass.cluster-${clusterId}`)
      .classed("opacity-100", true);
  }

  /**
   * Called when the cluster center or cluster pass is stopped hovered. Will normalise the opacity of all cluster passes.
   */
  onClusterCenterMouseout = (_, clusterId) => {
    this.svg
      .selectAll(`.cluster-pass.cluster-${clusterId}`)
      .classed("opacity-20", true);
    this.svg
      .selectAll(`.cluster-pass.cluster-${clusterId}`)
      .classed("opacity-100", false);
  };

  /**
   * Draws the passes for the cluster vis.
   */
  drawPassClusters() {
    const { clusterColorScale } = this.params;

    this.svg
      .selectAll(".cluster-center")
      .data(this.centroids, (d) => d.id)
      .join("circle")
      .on("mouseover", (_, d) => this.onClusterCenterMouseover(_, d.id))
      .on("mouseout", (_, d) => this.onClusterCenterMouseout(_, d.id))
      .attr("class", (d, i) => `cluster cluster-center cluster-${d.id}`)
      .transition()
      .duration(1000)
      .attr("cx", (d) => this.pitchXScale(d.x))
      .attr("cy", (d) => this.pitchYScale(100 - d.y))
      .attr("fill", (d, i) => clusterColorScale[d.id])
      .attr("r", 8);

    this.svg
      .selectAll(".cluster-pass")
      .data(this.clusteredPassEvents)
      .join("line")
      .on("click", (_, d) =>
        console.log(this.passEventsForClustering[d.eventIndex])
      )
      .attr(
        "class",
        (d) => `cluster cluster-pass cluster-${d.cluster} opacity-20`
      )
      .on("mouseover", (_, d) => this.onClusterCenterMouseover(_, d.cluster))
      .on("mouseout", (_, d) => this.onClusterCenterMouseout(_, d.cluster))
      .transition()
      .duration(1000)
      .attr("x1", (d) => this.pitchXScale(d.x))
      .attr("y1", (d) => this.pitchYScale(100 - d.y))
      .attr("x2", (d) => this.pitchXScale(d.x2))
      .attr("y2", (d) => this.pitchYScale(100 - d.y2))
      .attr("stroke", (d) => clusterColorScale[d.cluster])
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#pass-marker)");
  }

  /**
   * Returns an object where the key is the centroid id and the value is the number of pass events for that centroid.
   */
  getClusterCounts() {
    const clusterCounts = {};

    // add all the keys (centroid ids) to the object
    this.centroids.forEach((centroid) => (clusterCounts[centroid.id] = 0));

    // loop for each pass event and increment the counter
    this.clusteredPassEvents.forEach((point) => clusterCounts[point.cluster]++);

    return clusterCounts;
  }

  /**
   * Draw the legend of the cluster vis.
   */
  drawClusterLegend() {
    const {
      legendMarginLeft,
      legendMarginTop,
      legendHeight,
      clusterColorScale,
    } = this.params;

    let circleCircumference = 20;
    let circleR = circleCircumference / 2;
    let spaceBetween = 10;
    let wordWidth = 45;
    let distanceToNextCircle =
      circleR + spaceBetween + wordWidth + spaceBetween + circleR;

    let clusterCounts = this.getClusterCounts();

    const legend = this.svg
      .select(".cluster-legend")
      .attr("transform", `translate(${legendMarginLeft}, ${legendMarginTop})`);

    legend
      .selectAll(".cluster-legend-circle")
      .data(this.centroids)
      .join("circle")
      .on("mouseover", (_, d) => this.onClusterCenterMouseover(_, d.id))
      .on("mouseout", (_, d) => this.onClusterCenterMouseout(_, d.id))
      .attr("class", (d) => `cluster-legend-circle cluster-${d.id}`)
      .transition()
      .duration(1000)
      .attr("cy", legendHeight / 2)
      .attr("cx", (d, i) => circleR + i * distanceToNextCircle)
      .attr("r", circleR)
      .attr("fill", (d) => clusterColorScale[d.id]);

    legend
      .selectAll(".cluster-legend-text")
      .data(this.centroids)
      .join("text")
      .attr("class", (d) => `cluster-legend-text cluster-${d.id}`)
      .transition()
      .duration(1000)
      .text((d) => clusterCounts[d.id] + "TP")
      .attr("y", legendHeight / 2 + circleR / 2)
      .attr(
        "x",
        (d, i) => circleCircumference + spaceBetween + i * distanceToNextCircle
      );
  }

  /**
   * Remove the legend from the DOM.
   */
  removeLegend() {
    this.svg
      .select(".legend")
      .transition()
      .duration(1000)
      .style("opacity", 0)
      .remove();
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
    const { showShots, showPasses, showPassClusters } = this.params;

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
      this.drawLegend();
    }

    // draw passes
    if (showPasses) {
      this.removeShotsElements();
      this.setPassMarkerAttributes();
      this.drawPasses();
      this.drawLegend();
    }

    // draw passes clustering
    if (showPassClusters) {
      // remove other vis elements
      this.removePassElements();
      this.removeLegend();
      this.removeShotsElements();

      // draw cluster vis
      this.setPassMarkerAttributes();
      this.drawPassClusters();
      this.drawClusterLegend();
    } else {
      this.removeClusterElements();
    }
  }
}
