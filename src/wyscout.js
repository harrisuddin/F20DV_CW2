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
    tag: "101",
    label: "Goal",
    description: "Goal",
  },
  102: {
    tag: "102",
    label: "own_goal",
    description: "Own goal",
  },
  301: {
    tag: "301",
    label: "assist",
    description: "Assist",
  },
  302: {
    tag: "302",
    label: "keyPass",
    description: "Key pass",
  },
  1901: {
    tag: "1901",
    label: "counter_attack",
    description: "Counter attack",
  },
  401: {
    tag: "401",
    label: "Left",
    description: "Left foot",
  },
  402: {
    tag: "402",
    label: "Right",
    description: "Right foot",
  },
  403: {
    tag: "403",
    label: "head/body",
    description: "Head/body",
  },
  1101: {
    tag: "1101",
    label: "direct",
    description: "Direct",
  },
  1102: {
    tag: "1102",
    label: "indirect",
    description: "Indirect",
  },
  2001: {
    tag: "2001",
    label: "dangerous_ball_lost",
    description: "Dangerous ball lost",
  },
  2101: {
    tag: 2101,
    label: "blocked",
    description: "Blocked",
  },
  801: {
    tag: 801,
    label: "high",
    description: "High",
  },
  802: {
    tag: 802,
    label: "low",
    description: "Low",
  },
  1401: {
    tag: 1401,
    label: "interception",
    description: "Interception",
  },
  1501: {
    tag: 1501,
    label: "clearance",
    description: "Clearance",
  },
  201: {
    tag: 201,
    label: "opportunity",
    description: "Opportunity",
  },
  1301: {
    tag: 1301,
    label: "feint",
    description: "Feint",
  },
  1302: {
    tag: 1302,
    label: "missed ball",
    description: "Missed ball",
  },
  501: {
    tag: 501,
    label: "free_space_r",
    description: "Free space right",
  },
  502: {
    tag: 502,
    label: "free_space_l",
    description: "Free space left",
  },
  503: {
    tag: 503,
    label: "take_on_l",
    description: "Take on left",
  },
  504: {
    tag: 504,
    label: "take_on_r",
    description: "Take on right",
  },
  1601: {
    tag: 1601,
    label: "sliding_tackle",
    description: "Sliding tackle",
  },
  601: {
    tag: 601,
    label: "anticipated",
    description: "Anticipated",
  },
  602: {
    tag: 602,
    label: "anticipation",
    description: "Anticipation",
  },
  1701: {
    tag: 1701,
    label: "red_card",
    description: "Red card",
  },
  1702: {
    tag: "1702",
    label: "yellow_card",
    description: "Yellow card",
  },
  1703: {
    tag: "1703",
    label: "second_yellow_card",
    description: "Second yellow card",
  },
  1201: {
    tag: "1201",
    label: "gb",
    description: "Position: Goal low center",
  },
  1202: {
    tag: "1202",
    label: "gbr",
    description: "Position: Goal low right",
  },
  1203: {
    tag: "1203",
    label: "gc",
    description: "Position: Goal center",
  },
  1204: {
    tag: "1204",
    label: "gl",
    description: "Position: Goal center left",
  },
  1205: {
    tag: "1205",
    label: "glb",
    description: "Position: Goal low left",
  },
  1206: {
    tag: "1206",
    label: "gr",
    description: "Position: Goal center right",
  },
  1207: {
    tag: "1207",
    label: "gt",
    description: "Position: Goal high center",
  },
  1208: {
    tag: "1208",
    label: "gtl",
    description: "Position: Goal high left",
  },
  1209: {
    tag: "1209",
    label: "gtr",
    description: "Position: Goal high right",
  },
  1210: {
    tag: "1210",
    label: "obr",
    description: "Position: Out low right",
  },
  1211: {
    tag: "1211",
    label: "ol",
    description: "Position: Out center left",
  },
  1212: {
    tag: "1212",
    label: "olb",
    description: "Position: Out low left",
  },
  1213: {
    tag: "1213",
    label: "or",
    description: "Position: Out center right",
  },
  1214: {
    tag: "1214",
    label: "ot",
    description: "Position: Out high center",
  },
  1215: {
    tag: "1215",
    label: "otl",
    description: "Position: Out high left",
  },
  1216: {
    tag: "1216",
    label: "otr",
    description: "Position: Out high right",
  },
  1217: {
    tag: "1217",
    label: "pbr",
    description: "Position: Post low right",
  },
  1218: {
    tag: "1218",
    label: "Position: Post center left",
    description: "Position: Post center left",
  },
  1219: {
    tag: "1219",
    label: "Position: Post low left",
    description: "Position: Post low left",
  },
  1220: {
    tag: "1220",
    label: "Position: Post center right",
    description: "Position: Post center right",
  },
  1221: {
    tag: "1221",
    label: "Position: Post high center",
    description: "Position: Post high center",
  },
  1222: {
    tag: "1222",
    label: "Position: Post high left",
    description: "Position: Post high left",
  },
  1223: {
    tag: "1223",
    label: "Position: Post high right",
    description: "Position: Post high right",
  },
  901: {
    tag: "901",
    label: "Through",
    description: "Through",
  },
  1001: {
    tag: "1001",
    label: "Fairplay",
    description: "Fairplay",
  },
  701: {
    tag: "701",
    label: "Lost",
    description: "Lost",
  },
  702: {
    tag: "702",
    label: "neutral",
    description: "Neutral",
  },
  703: {
    tag: "703",
    label: "won",
    description: "Won",
  },
  1801: {
    tag: "1801",
    label: "accurate",
    description: "Accurate",
  },
  1802: {
    tag: "1802",
    label: "not accurate",
    description: "Not accurate",
  },
};

/**
 * The Wyscout player id for Paul Pogba
 */
export const WYSCOUT_POGBA_PLAYER_ID = 7936;

/**
 * The Wyscout team id for Manchester United
 */
export const WYSCOUT_MANU_TEAM_ID = 1611;
