import * as d3 from "d3";
import calcSVGDimensions from "./calcSVGDimensions";
import BarChart from "./components/BarChart/BarChart";
import DualAxisLineChart from "./components/DualAxisLineChart/DualAxisLineChart";
import Pitch from "./components/Pitch/Pitch";
import {
  dataLoadedDispatch,
  WYSCOUT_POGBA_EVENTS_DATA,
  EPL_PLAYER_DATA,
  WYSCOUT_MANU_PLAYERANK_DATA,
  WYSCOUT_MANU_MATCHES_DATA,
  WYSCOUT_MANU_PLAYERS_DATA,
} from "./loadData";
import {
  WYSCOUT_ID_PLAYER_POGBA,
  WYSCOUT_ID_PLAYER_MCTOMINAY,
  WYSCOUT_ID_PLAYER_FRED,
  WYSCOUT_ID_PLAYER_MATIC,
  WYSCOUT_ID_PLAYER_FELLAINI,
  WYSCOUT_ID_PLAYER_MATA,
  WYSCOUT_ID_PLAYER_HERRERA,
  WYSCOUT_ID_TEAM_MANU,
  WYSCOUT_ID_PLAYER_MANU_MIDFIELDERS,
  WYSCOUT_ID_PLAYER_MANU_ATTACKERS,
} from "./wyscout";

dataLoadedDispatch.on("dataLoaded", onDataLoaded);

/**
 * @type {Pitch | null}
 */
let pitchChart = null;

/**
 * @type {BarChart | null}
 */
let barChart = null;

/**
 * @type {DualAxisLineChart | null}
 */
let lineChart = null;

function onDataLoaded() {
  let over38Appearances = EPL_PLAYER_DATA.filter(
    (row) => row.appearances >= 38
  );

  console.log(over38Appearances);

  console.log(WYSCOUT_MANU_MATCHES_DATA);
  console.log(WYSCOUT_MANU_PLAYERANK_DATA);

  let manuPlayeRanks = WYSCOUT_MANU_PLAYERANK_DATA.map((playeRank) => {
    return {
      ...playeRank,

      shortName: WYSCOUT_MANU_PLAYERS_DATA.find(
        (player) => player.wyId === playeRank.playerId
      ).shortName,
    };
  });
  console.log(manuPlayeRanks);

  try {
    pitchChart = new Pitch(WYSCOUT_POGBA_EVENTS_DATA, {
      elementToInsertInto: "#pitch-container",
      id: "pitch",
    });

    barChart = new BarChart(over38Appearances, {
      elementToInsertInto: "#bar-chart-container",
      id: "bar-chart",
    });

    lineChart = new DualAxisLineChart(manuPlayeRanks, {
      elementToInsertInto: "#line-chart-container",
      id: "line-chart",

      // format the x axis ticks to show the gameweek number
      xAxisTickFormat: (matchId, i) => {
        let match = WYSCOUT_MANU_MATCHES_DATA.find(
          (match) => match.wyId == matchId
        );
        return `${match.gameweek}`;
      },

      onLegendMouseover: onDualAxisLineChartLegendMouseover,
      onLegendMouseout: onDualAxisLineChartLegendMouseout,
    });

    resizeCharts();
  } catch (err) {
    debugger;
    console.error(err);
  }
}

// Bar Chart Controls

d3.select("#btn-bar-chart-duels-won-per-match").on("click", () => {
  barChart.setParams({
    chartStartingIndex: 0,
    yMap: (d) =>
      Number.parseFloat(d.duels_won) / Number.parseFloat(d.appearances),
    yLabel: "Up To 09/2020 Duels Won / Match",
  });
  barChart.draw();
});

d3.select("#btn-bar-chart-thrh-balls-per-match").on("click", () => {
  barChart.setParams({
    chartStartingIndex: 0,
    yMap: (d) =>
      Number.parseFloat(d.through_balls) / Number.parseFloat(d.appearances),
    yLabel: "Up To 09/2020 Through Balls / Match",
  });
  barChart.draw();
});

d3.select("#btn-bar-chart-50-50s-per-match").on("click", () => {
  barChart.setParams({
    chartStartingIndex: 0,
    yMap: (d) =>
      Number.parseFloat(d.successful_50_50s) / Number.parseFloat(d.appearances),
    yLabel: "Up To 09/2020 Successful 50/50s / Match",
  });
  barChart.draw();
});

d3.select("#btn-bar-chart-50-50s-per-match").on("click", () => {
  barChart.setParams({
    chartStartingIndex: 0,
    yMap: (d) =>
      Number.parseFloat(d.successful_50_50s) / Number.parseFloat(d.appearances),
    yLabel: "Up To 09/2020 Successful 50/50s / Match",
  });
  barChart.draw();
});

d3.select("#btn-bar-chart-goals-per-match").on("click", () => {
  barChart.setParams({
    chartStartingIndex: 27,
    yMap: (d) => Number.parseFloat(d.goals) / Number.parseFloat(d.appearances),
    yLabel: "Up To 09/2020 Goals / Match",
  });
  barChart.draw();
});

d3.select("#btn-bar-chart-big-chances-per-match").on("click", () => {
  barChart.setParams({
    chartStartingIndex: 0,
    yMap: (d) =>
      Number.parseFloat(d.big_chances_created) /
      Number.parseFloat(d.appearances),
    yLabel: "Up To 09/2020 Big Changes Created / Match",
  });
  barChart.draw();
});

d3.select("#btn-bar-chart-assists-per-match").on("click", () => {
  barChart.setParams({
    chartStartingIndex: 0,
    yMap: (d) =>
      Number.parseFloat(d.assists) / Number.parseFloat(d.appearances),
    yLabel: "Up To 09/2020 Assists / Match",
  });
  barChart.draw();
});

d3.select("#btn-bar-chart-recvs-per-match").on("click", () => {
  barChart.setParams({
    chartStartingIndex: 0,
    yMap: (d) =>
      Number.parseFloat(d.recoveries) / Number.parseFloat(d.appearances),
    yLabel: "Up To 09/2020 Recoveries / Match",
  });
  barChart.draw();
});

d3.select("#btn-bar-chart-passes-per-match").on("click", () => {
  barChart.setParams({
    chartStartingIndex: 0,
    yMap: (d) => Number.parseFloat(d.passes) / Number.parseFloat(d.appearances),
    yLabel: "Up To 09/2020 Passes / Match",
  });
  barChart.draw();
});

d3.select("#btn-bar-chart-acc-long-balls-per-match").on("click", () => {
  barChart.setParams({
    chartStartingIndex: 20,
    yMap: (d) =>
      Number.parseFloat(d.accurate_long_balls) /
      Number.parseFloat(d.appearances),
    yLabel: "Up To 09/2020 Accurate Long Balls / Match",
  });
  barChart.draw();
});

d3.select("#btn-bar-chart-arl-btls-per-match").on("click", () => {
  barChart.setParams({
    chartStartingIndex: 52,
    yMap: (d) =>
      Number.parseFloat(d.aerial_battles_won) /
      Number.parseFloat(d.appearances),
    yLabel: "Up To 09/2020 Aerial Battles Won / Match",
  });
  barChart.draw();
});

d3.select("#btn-bar-chart-intcps-per-match").on("click", () => {
  barChart.setParams({
    chartStartingIndex: 0,
    yMap: (d) =>
      Number.parseFloat(d.interceptions) / Number.parseFloat(d.appearances),
    yLabel: "Up To 09/2020 Interceptions / Match",
  });
  barChart.draw();
});

// Pitch Chart Controls

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

// Line Chart Controls

d3.select("#btn-line-chart-show-fwds").on("click", () => {
  lineChart.setParams({
    selectedPlayerIds: [
      ...WYSCOUT_ID_PLAYER_MANU_ATTACKERS,
      WYSCOUT_ID_PLAYER_POGBA,
    ],
    yLabel1:
      "2017/18 PlayeRank Score (MNU Attackers) (Bottom Axis = EPL Gameweek)",
  });
  lineChart.draw();
});

d3.select("#btn-line-chart-show-mids").on("click", () => {
  lineChart.setParams({
    selectedPlayerIds: WYSCOUT_ID_PLAYER_MANU_MIDFIELDERS,
    yLabel1:
      "2017/18 PlayeRank Score (MNU Midfielders) (Bottom Axis = EPL Gameweek)",
  });
  lineChart.draw();
});

function onDualAxisLineChartLegendMouseover(_, d) {
  /**
   * Callback for when one of the legend circle/text is hovered.
   * Will reduce opacity of all legend and lines except the associated one being hovered.
   * @param {d3.Selection<SVGSVGElement, any, HTMLElement, any>} svgElement
   */
  const highlightSelectedPlayerId = (svgElement) => {
    // reduce opacity of all lines and legend related elements
    svgElement.selectAll(`.playerId`).classed("opacity-20", true);

    // bring back opacity for hovered legend and its lines
    svgElement.selectAll(`.playerId-${d[0]}`).classed("opacity-20", false);
  };

  highlightSelectedPlayerId(lineChart.svg);
}

function onDualAxisLineChartLegendMouseout(_, d) {
  /**
   * Callback for when one of the legend circle/text is stopped hovering.
   * Will make the opacity of everything back to normal.
   */
  const noHighlight = (svgElement) => {
    svgElement.selectAll(".playerId").classed("opacity-20", false);
  };

  noHighlight(lineChart.svg);
}

// Resize All Charts

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

  if (lineChart) {
    lineChart.setParams({
      width,
      height,
    });
    lineChart.draw();
  }

  prevWidth = width;
}
