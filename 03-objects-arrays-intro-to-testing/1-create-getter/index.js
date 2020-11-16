/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const arrPath = path.split('.');
  return (obj) => {
    let property = obj[arrPath[0]];
    arrPath.shift();
    arrPath.forEach(step => {
      if(property === undefined) {
        return property;
      }
      property = property[step];
    });
    return property;
  }
}
