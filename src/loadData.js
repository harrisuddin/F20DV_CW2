import * as d3 from "d3";
import eplPlayerStatsData from "./data/epl-player-stats.csv?url";

/**
 * Load the EPL Player Data as CSV.
 */
async function loadEPLPlayerData() {
  return d3.csv(eplPlayerStatsData);
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

export let eplPlayerDispatch = d3.dispatch("eplPlayerDataLoaded");

/**
 * Stores the EPL player data. Should be accessed after the data has loaded in.
 * @type {Awaited<ReturnType<typeof loadEPLPlayerData>>}
 */
export let EPL_PLAYER_DATA;

Promise.all([loadEPLPlayerData()])
  .then((data) => {
    EPL_PLAYER_DATA = data[0];

    // calls the event specified in main.js
    eplPlayerDispatch.call("eplPlayerDataLoaded");

    showContent();
  })
  .catch((error) => {
    console.error(error);
    showErrorMessage();
  })
  .finally(() => {
    hideLoadingIcon();
  });
