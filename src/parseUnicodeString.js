/**
 * Takes a string, finds unicode substrings in the format "\uXXXX".
 * Then replaces them with the correct unicode characters and returns the correct string.
 * @param {string} unicodeString
 */
export default function parseUnicodeString(unicodeString) {
  // use regex to find anywhere that contains \uXXXX
  return unicodeString.replace(/\\u[\dA-F]{4}/gi, (match) => {
    // remove the \u to just leave the hex value
    let removedSlashU = match.replace(/\\u/g, "");

    // then turn the hex value to an int and convert to unicode
    return String.fromCharCode(parseInt(removedSlashU, 16));
  });
}
