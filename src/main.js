import * as d3 from "d3";
import calcSVGDimensions from "./calcSVGDimensions";
import BarChart from "./components/BarChart/BarChart";
import Pitch from "./components/Pitch/Pitch";
import {
  dataLoadedDispatch,
  WYSCOUT_POGBA_EVENTS_DATA,
  EPL_PLAYER_DATA,
} from "./loadData";
import { WYSCOUT_ID_PLAYER_POGBA } from "./wyscout";

dataLoadedDispatch.on("dataLoaded", onDataLoaded);

/**
 * @type {Pitch | null}
 */
let pitchChart = null;

/**
 * @type {BarChart | null}
 */
let barChart = null;

function onDataLoaded() {
  let over38Appearances = EPL_PLAYER_DATA.filter(
    (row) => row.appearances >= 38
  );

  console.log(over38Appearances);

  try {
    pitchChart = new Pitch(WYSCOUT_POGBA_EVENTS_DATA, {
      elementToInsertInto: "#pitch-container",
      id: "pitch",
    });

    barChart = new BarChart(over38Appearances, {
      elementToInsertInto: "#bar-chart-container",
      id: "bar-chart",
    });

    resizeCharts();
  } catch (err) {
    debugger;
    console.error(err);
  }
}

d3.select("#test").on("click", () => {
  barChart.setParams({
    yMap: (d) =>
      Number.parseFloat(d.duels_won) / Number.parseFloat(d.appearances),
    yLabel: "Duels Won / Match",
  });
  barChart.draw();
});

d3.select("#btn-pitch-chart-shot-map").on("click", () => {
  pitchChart.setParams({
    showPasses: false,
    showPassClusters: false,
    showShots: true,
    chartLabel: "2017/18 Shot Map",
  });
  pitchChart.draw();
});

d3.select("#btn-pitch-chart-assist-keypass-map").on("click", () => {
  pitchChart.setParams({
    showPasses: true,
    showPassClusters: false,
    showShots: false,
    chartLabel: "2017/18 Assist/Key Pass Map",
  });
  pitchChart.draw();
});

d3.select("#btn-pitch-chart-pass-clusters").on("click", () => {
  let { passClusterSamplePercent } = pitchChart.params;
  pitchChart.setParams({
    showPasses: false,
    showPassClusters: true,
    showShots: false,
    chartLabel: `2017/18 Pass Clusters (TP = Total Passes) (${
      passClusterSamplePercent * 100
    }% of passes shown)`,
  });
  pitchChart.draw();
});
d3.select("#btn-pitch-chart-regen-clusters").on("click", () => {
  let isShowingClusters = pitchChart.params.showPassClusters;

  if (isShowingClusters) {
    pitchChart.setupClustering();
    pitchChart.draw();
  }
});

d3.select("#centroids-size").on("change", (event) => {
  let numberOfCentroids = event.target.value;
  let isShowingClusters = pitchChart.params.showPassClusters;

  pitchChart.setParams({
    numberOfCentroids,
  });
  pitchChart.setupClustering();

  if (isShowingClusters) {
    pitchChart.draw();
  }
});

d3.select("#percent-pass-clusters").on("change", (event) => {
  let passClusterSamplePercent = event.target.value / 100;

  let isShowingClusters = pitchChart.params.showPassClusters;

  pitchChart.setParams({
    passClusterSamplePercent,
    chartLabel: `2017/18 Pass Clusters (TP = Total Passes) (${
      passClusterSamplePercent * 100
    }% of passes shown)`,
  });

  pitchChart.setupClustering();

  if (isShowingClusters) {
    pitchChart.draw();
  }
});

d3.select(window).on("resize", resizeCharts);

let prevWidth = null;
function resizeCharts() {
  let [width, height] = calcSVGDimensions();

  if (width === prevWidth) return;

  if (pitchChart) {
    pitchChart.setParams({
      width,
      height,
    });
    pitchChart.draw();
  }

  if (barChart) {
    barChart.setParams({
      width,
      height,
    });
    barChart.draw();
  }

  prevWidth = width;
}
