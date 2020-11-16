/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0) return "";
  
  let resultString = "";
  let count = 0;
  let previousSymbol = null;
  for (const symbol of string) {
    if (count >= size && symbol === previousSymbol) continue;

    resultString += symbol;

    if (symbol === previousSymbol) {
      count++;
    } else {
      count = 1;
    }
    previousSymbol = symbol;
  }
  return resultString;
}
