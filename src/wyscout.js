/**
 * This file is to store information about the wyscout files.
 */

/**
 * Object containing the label and description of each tag that can appear in the events object.
 *
 * Obtained from https://apidocs.wyscout.com/#tag/Events/paths/~1matches~1{wyId}~1events/get.
 * NOTE: when accessing this site, be sure to select v2 of the API at the top of the page.
 */
export const WYSCOUT_TAGS = {
  101: {
    id: 101,
    label: "Goal",
    description: "Goal",
  },
  102: {
    id: 102,
    label: "own_goal",
    description: "Own goal",
  },
  301: {
    id: 301,
    label: "assist",
    description: "Assist",
  },
  302: {
    id: 302,
    label: "keyPass",
    description: "Key pass",
  },
  1901: {
    id: 1901,
    label: "counter_attack",
    description: "Counter attack",
  },
  401: {
    id: 401,
    label: "Left",
    description: "Left foot",
  },
  402: {
    id: 402,
    label: "Right",
    description: "Right foot",
  },
  403: {
    id: 403,
    label: "head/body",
    description: "Head/body",
  },
  1101: {
    id: 1101,
    label: "direct",
    description: "Direct",
  },
  1102: {
    id: 1102,
    label: "indirect",
    description: "Indirect",
  },
  2001: {
    id: 2001,
    label: "dangerous_ball_lost",
    description: "Dangerous ball lost",
  },
  2101: {
    id: 2101,
    label: "blocked",
    description: "Blocked",
  },
  801: {
    id: 801,
    label: "high",
    description: "High",
  },
  802: {
    id: 802,
    label: "low",
    description: "Low",
  },
  1401: {
    id: 1401,
    label: "interception",
    description: "Interception",
  },
  1501: {
    id: 1501,
    label: "clearance",
    description: "Clearance",
  },
  201: {
    id: 201,
    label: "opportunity",
    description: "Opportunity",
  },
  1301: {
    id: 1301,
    label: "feint",
    description: "Feint",
  },
  1302: {
    id: 1302,
    label: "missed ball",
    description: "Missed ball",
  },
  501: {
    id: 501,
    label: "free_space_r",
    description: "Free space right",
  },
  502: {
    id: 502,
    label: "free_space_l",
    description: "Free space left",
  },
  503: {
    id: 503,
    label: "take_on_l",
    description: "Take on left",
  },
  504: {
    id: 504,
    label: "take_on_r",
    description: "Take on right",
  },
  1601: {
    id: 1601,
    label: "sliding_tackle",
    description: "Sliding tackle",
  },
  601: {
    id: 601,
    label: "anticipated",
    description: "Anticipated",
  },
  602: {
    id: 602,
    label: "anticipation",
    description: "Anticipation",
  },
  1701: {
    id: 1701,
    label: "red_card",
    description: "Red card",
  },
  1702: {
    id: 1702,
    label: "yellow_card",
    description: "Yellow card",
  },
  1703: {
    id: 1703,
    label: "second_yellow_card",
    description: "Second yellow card",
  },
  1201: {
    id: 1201,
    label: "gb",
    description: "Position: Goal low center",
  },
  1202: {
    id: 1202,
    label: "gbr",
    description: "Position: Goal low right",
  },
  1203: {
    id: 1203,
    label: "gc",
    description: "Position: Goal center",
  },
  1204: {
    id: 1204,
    label: "gl",
    description: "Position: Goal center left",
  },
  1205: {
    id: 1205,
    label: "glb",
    description: "Position: Goal low left",
  },
  1206: {
    id: 1206,
    label: "gr",
    description: "Position: Goal center right",
  },
  1207: {
    id: 1207,
    label: "gt",
    description: "Position: Goal high center",
  },
  1208: {
    id: 1208,
    label: "gtl",
    description: "Position: Goal high left",
  },
  1209: {
    id: 1209,
    label: "gtr",
    description: "Position: Goal high right",
  },
  1210: {
    id: 1210,
    label: "obr",
    description: "Position: Out low right",
  },
  1211: {
    id: 1211,
    label: "ol",
    description: "Position: Out center left",
  },
  1212: {
    id: 1212,
    label: "olb",
    description: "Position: Out low left",
  },
  1213: {
    id: 1213,
    label: "or",
    description: "Position: Out center right",
  },
  1214: {
    id: 1214,
    label: "ot",
    description: "Position: Out high center",
  },
  1215: {
    id: 1215,
    label: "otl",
    description: "Position: Out high left",
  },
  1216: {
    id: 1216,
    label: "otr",
    description: "Position: Out high right",
  },
  1217: {
    id: 1217,
    label: "pbr",
    description: "Position: Post low right",
  },
  1218: {
    id: 1218,
    label: "Position: Post center left",
    description: "Position: Post center left",
  },
  1219: {
    id: 1219,
    label: "Position: Post low left",
    description: "Position: Post low left",
  },
  1220: {
    id: 1220,
    label: "Position: Post center right",
    description: "Position: Post center right",
  },
  1221: {
    id: 1221,
    label: "Position: Post high center",
    description: "Position: Post high center",
  },
  1222: {
    id: 1222,
    label: "Position: Post high left",
    description: "Position: Post high left",
  },
  1223: {
    id: 1223,
    label: "Position: Post high right",
    description: "Position: Post high right",
  },
  901: {
    id: 901,
    label: "Through",
    description: "Through",
  },
  1001: {
    id: 1001,
    label: "Fairplay",
    description: "Fairplay",
  },
  701: {
    id: 701,
    label: "Lost",
    description: "Lost",
  },
  702: {
    id: 702,
    label: "neutral",
    description: "Neutral",
  },
  703: {
    id: 703,
    label: "won",
    description: "Won",
  },
  1801: {
    id: 1801,
    label: "accurate",
    description: "Accurate",
  },
  1802: {
    id: 1802,
    label: "not accurate",
    description: "Not accurate",
  },
};

// All the different type of events
export const WYSCOUT_EVENT_DUEL = 1;
export const WYSCOUT_EVENT_FOUL = 2;
export const WYSCOUT_EVENT_FREE_KICK = 3;
export const WYSCOUT_EVENT_GOALKEEPER_LEAVING_LINE = 4;
export const WYSCOUT_EVENT_INTERRUPTION = 5;
export const WYSCOUT_EVENT_OFFSIDE = 6;
export const WYSCOUT_EVENT_OTHERS_ON_THE_BALL = 7;
export const WYSCOUT_EVENT_PASS = 8;
export const WYSCOUT_EVENT_SAVE_ATTEMPT = 9;
export const WYSCOUT_EVENT_SHOT = 10;

// All the pass sub events
export const WYSCOUT_EVENT_PASS_CROSS = 80;
export const WYSCOUT_EVENT_PASS_HAND_PASS = 81;
export const WYSCOUT_EVENT_PASS_HEAD_PASS = 82;
export const WYSCOUT_EVENT_PASS_HIGH_PASS = 83;
export const WYSCOUT_EVENT_PASS_LAUNCH = 84;
export const WYSCOUT_EVENT_PASS_SIMPLE_PASS = 85;
export const WYSCOUT_EVENT_PASS_SMART_PASS = 86;

/**
 * The Wyscout player id for Paul Pogba
 */
export const WYSCOUT_ID_PLAYER_POGBA = 7936;

// All MNU midfielders

export const WYSCOUT_ID_PLAYER_MCTOMINAY = 397174;
export const WYSCOUT_ID_PLAYER_FRED = 40335;
export const WYSCOUT_ID_PLAYER_MATIC = 70122;
export const WYSCOUT_ID_PLAYER_FELLAINI = 8249;
export const WYSCOUT_ID_PLAYER_MATA = 7906;
export const WYSCOUT_ID_PLAYER_HERRERA = 3413;

export const WYSCOUT_ID_PLAYER_MANU_MIDFIELDERS = [
  WYSCOUT_ID_PLAYER_POGBA,
  WYSCOUT_ID_PLAYER_MCTOMINAY,
  WYSCOUT_ID_PLAYER_FRED,
  WYSCOUT_ID_PLAYER_MATIC,
  WYSCOUT_ID_PLAYER_FELLAINI,
  WYSCOUT_ID_PLAYER_MATA,
  WYSCOUT_ID_PLAYER_HERRERA,
];

// All MNU attackers

export const WYSCOUT_ID_PLAYER_RASHFORD = 397178;
export const WYSCOUT_ID_PLAYER_LUKAKU = 7905;
export const WYSCOUT_ID_PLAYER_LINGARD = 7934;
export const WYSCOUT_ID_PLAYER_MARTIAL = 134513;

export const WYSCOUT_ID_PLAYER_MANU_ATTACKERS = [
  WYSCOUT_ID_PLAYER_RASHFORD,
  WYSCOUT_ID_PLAYER_LUKAKU,
  WYSCOUT_ID_PLAYER_LINGARD,
  WYSCOUT_ID_PLAYER_MARTIAL,
];

/**
 * The Wyscout team id for Manchester United
 */
export const WYSCOUT_ID_TEAM_MANU = 1611;
