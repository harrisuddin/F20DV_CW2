import * as d3 from "d3";
import eplPlayerStatsData from "./data/epl-player-stats.csv?url";
import wyscoutEventsData from "./data/wyscout/events_England.json?url";
import wyscoutMatchesData from "./data/wyscout/matches_England.json?url";

/**
 * Load the EPL Player Data as CSV.
 */
async function loadEPLPlayerData() {
  return d3.csv(eplPlayerStatsData);
}

/**
 * @returns {Promise<{
 * eventId: number;
 * subEventName: string;
 * tags: {
 * id: number;
 * }[];
 * playerId: number;
 * positions: {
 * y: number;
 * x: number;
 * }[];
 * matchId: number;
 * eventName: string;
 * teamId: number;
 * matchPeriod: string;
 * eventSec: number;
 * subEventId: number;
 * id: number;
 * }[]>}
 */
async function loadWyscoutEventsData() {
  return d3.json(wyscoutEventsData);
}

/**
 *
 */
async function loadWyscoutMatchesData() {
  return d3.json(wyscoutMatchesData);
}

/**
 * Hide the `#loading-icon` element in the HTML.
 */
function hideLoadingIcon() {
  document.getElementById("loading-icon").classList.remove("flex");
  document.getElementById("loading-icon").classList.add("hidden");
}

/**
 * Show the `#default-content` and `#footer` element in the HTML.
 */
function showContent() {
  document.getElementById("default-content").classList.remove("hidden");
  document.getElementById("footer").classList.remove("hidden");
}

/**
 * Hide the `#error-message` element in the HTML.
 */
function showErrorMessage() {
  document.getElementById("error-message").classList.add("flex");
  document.getElementById("error-message").classList.remove("hidden");
}

export let dataLoadedDispatch = d3.dispatch("dataLoaded");

/**
 * Stores the EPL player data. Should be accessed after the data has loaded in.
 * @type {Awaited<ReturnType<typeof loadEPLPlayerData>>}
 */
export let EPL_PLAYER_DATA;

/**
 * @type {Awaited<ReturnType<typeof loadWyscoutEventsData>>}
 */
export let WYSCOUT_EVENTS_DATA;

Promise.all([
  loadEPLPlayerData(),
  loadWyscoutEventsData(),
  // loadWyscoutMatchesData(),
])
  .then((data) => {
    EPL_PLAYER_DATA = data[0];
    WYSCOUT_EVENTS_DATA = data[1];

    // console.log(
    //   data[2].filter((elem) => elem.label.includes("Manchester United"))
    // );

    // let matchesExtent = d3.extent(data[2], (elem) => new Date(elem.dateutc));
    // console.log(matchesExtent);

    // calls the event specified in main.js
    dataLoadedDispatch.call("dataLoaded");

    showContent();
  })
  .catch((error) => {
    console.error(error);
    showErrorMessage();
  })
  .finally(() => {
    hideLoadingIcon();
  });
