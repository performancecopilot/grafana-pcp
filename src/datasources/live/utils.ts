// stackoverflow development ftw
//
// https://stackoverflow.com/a/34890276/
function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

// https://stackoverflow.com/a/14810722/
function objectMap(object, mapFn) {
  return Object.keys(object).reduce(function(result, key) {
    result[key] = mapFn(object[key])
    return result
  }, {})
}

// https://stackoverflow.com/a/1917041/
function sharedPrefixLength(array) {
  var A = array.concat().sort()
  var a1= A[0], a2= A[A.length-1], L= a1.length, i= 0;
  while(i<L && a1.charAt(i)=== a2.charAt(i))
      i++;
  return i
}

const flatMap = (f, arr) => arr.reduce((x, y) => [...x, ...f(y)], [])

// https://stackoverflow.com/a/31464652/
function expandDottedStringToObject(str, value)
{
    var items = str.split(".") // split on dot notation
    var output = {} // prepare an empty object, to fill later
    var ref = output // keep a reference of the new object

    //  loop through all nodes, except the last one
    for(var i = 0; i < items.length - 1; i ++)
    {
        ref[items[i]] = {} // create a new element inside the reference
        ref = ref[items[i]] // shift the reference to the newly created object
    }

    ref[items[items.length - 1]] = value // apply the final value

    return output // return the full object
}

export {
    groupBy,
    objectMap,
    sharedPrefixLength,
    flatMap,
    expandDottedStringToObject,
}
