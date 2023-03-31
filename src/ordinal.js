const ordinalRules = new Intl.PluralRules("en", {
  type: "ordinal",
});

const suffixes = {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th",
};

/**
 * Examples:
 * 1 -> 1st
 * 2 -> 2nd
 * 3 -> 3rd
 * 4 -> 4th
 * etc
 * @param {number} number
 * @returns {string}
 */
export default function addOrdinalSuffix(number) {
  const category = ordinalRules.select(number);
  const suffix = suffixes[category];
  return number + suffix;
}
