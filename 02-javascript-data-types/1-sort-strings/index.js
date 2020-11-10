/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const arrToSort = [...arr];
  let numberParam = 1;
  switch(param) {
    case "desc": {
      numberParam = -1;    
      break;
    }
    case "asc":
    default: {
      numberParam = 1;
    }
  }

  return arrToSort.sort((string1, string2) => {
      return numberParam * string1.localeCompare(string2, ['ru', 'en'], {caseFirst: 'upper'});
  });
}
