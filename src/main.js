import * as d3 from "d3";
import calcSVGDimensions from "./calcSVGDimensions";
import Pitch from "./components/Pitch/Pitch";
import {
  eplPlayerDispatch,
  EPL_EVENTS_DATA,
  EPL_PLAYER_DATA,
} from "./loadData";
import { WYSCOUT_ID_PLAYER_POGBA } from "./wyscout";

eplPlayerDispatch.on("eplPlayerDataLoaded", onEPLPlayerDataLoaded);

/**
 * @type {Pitch | null}
 */
let pitchChart = null;

function onEPLPlayerDataLoaded() {
  let pogbaEvents = EPL_EVENTS_DATA.filter(
    (event) => event.playerId == WYSCOUT_ID_PLAYER_POGBA
  );

  console.dir(JSON.stringify(EPL_EVENTS_DATA[0], null, 2));

  try {
    pitchChart = new Pitch(pogbaEvents, {
      elementToInsertInto: "#pitch-container",
      id: "pitch",
    });
    pitchChart.draw();
  } catch (err) {
    debugger;
    console.error(err);
  }
}

d3.select("#btn-pitch-chart-shot-map").on("click", () => {
  pitchChart.setParams({
    showPasses: false,
    showShots: true,
    chartLabel: "Paul Pogba 2017/18 Shot Map",
  });
  pitchChart.draw();
});

d3.select("#btn-pitch-chart-assist-keypass-map").on("click", () => {
  pitchChart.setParams({
    showPasses: true,
    showShots: false,
    chartLabel: "Paul Pogba 2017/18 Assist/Key Pass Map",
  });
  pitchChart.draw();
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

  prevWidth = width;
}
