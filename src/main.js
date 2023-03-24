import * as d3 from "d3";
import Pitch from "./components/Pitch/Pitch";
import {
  eplPlayerDispatch,
  EPL_EVENTS_DATA,
  EPL_PLAYER_DATA,
} from "./loadData";
import { WYSCOUT_POGBA_PLAYER_ID } from "./wyscout";

eplPlayerDispatch.on("eplPlayerDataLoaded", onEPLPlayerDataLoaded);

function onEPLPlayerDataLoaded() {
  // console.log(EPL_PLAYER_DATA);

  let pogbaEvents = EPL_EVENTS_DATA.filter(
    (elem) => elem.playerId == WYSCOUT_POGBA_PLAYER_ID
  );
  // console.log(pogbaEvents);

  let pitch = new Pitch(pogbaEvents, {
    elementToInsertInto: "#pitch-container",
    id: "pitch",
  });
  pitch.draw();
}
