import * as d3 from "d3";
import { eplPlayerDispatch, EPL_PLAYER_DATA } from "./loadData";

function onEPLPlayerDataLoaded() {
  console.log(EPL_PLAYER_DATA);
}

eplPlayerDispatch.on("eplPlayerDataLoaded", onEPLPlayerDataLoaded);
