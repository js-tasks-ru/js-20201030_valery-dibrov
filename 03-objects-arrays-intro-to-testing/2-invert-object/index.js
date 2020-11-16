/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (obj === undefined) return;

  const invertedObject = {};
  // for (let [key, value] of Object.entries(obj)) {
  //   invertedObject[value] = key;
  // }

  Object.entries(obj).forEach(([key, value]) => {
    invertedObject[value] = key;
  });

  return invertedObject;
}
