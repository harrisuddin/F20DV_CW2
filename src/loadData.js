import * as d3 from "d3";
import eplPlayerStatsData from "./data/epl-player-stats.csv?url";
import wyscoutPogbaEventsData from "./data/wyscout/pogba_events_England.json?url";
import wyscoutManUMatchesData from "./data/wyscout/manu_matches_England.json?url";
import wyscoutManUPlayeRankData from "./data/wyscout/manu_PlayeRank.json?url";
import wyscoutManUPlayersData from "./data/wyscout/manu_players.json?url";

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
  return d3.json(wyscoutPogbaEventsData);
}

async function loadWyscoutManUMatchesData() {
  return d3.json(wyscoutManUMatchesData);
}

async function loadWyscoutManUPlayeRankData() {
  return d3.json(wyscoutManUPlayeRankData);
}

async function loadWyscoutManUPlayersData() {
  return d3.json(wyscoutManUPlayersData);
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
export let WYSCOUT_POGBA_EVENTS_DATA;

/**
 * @type {Awaited<ReturnType<typeof loadWyscoutManUMatchesData>>}
 */
export let WYSCOUT_MANU_MATCHES_DATA;

/**
 * @type {Awaited<ReturnType<typeof loadWyscoutManUPlayeRankData>>}
 */
export let WYSCOUT_MANU_PLAYERANK_DATA;

/**
 * @type {Awaited<ReturnType<typeof loadWyscoutManUPlayersData>>}
 */
export let WYSCOUT_MANU_PLAYERS_DATA;

Promise.all([
  loadEPLPlayerData(),
  loadWyscoutEventsData(),
  loadWyscoutManUMatchesData(),
  loadWyscoutManUPlayeRankData(),
  loadWyscoutManUPlayersData(),
])
  .then((data) => {
    EPL_PLAYER_DATA = data[0];
    WYSCOUT_POGBA_EVENTS_DATA = data[1];
    WYSCOUT_MANU_MATCHES_DATA = data[2];
    WYSCOUT_MANU_PLAYERANK_DATA = data[3];
    WYSCOUT_MANU_PLAYERS_DATA = data[4];

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
