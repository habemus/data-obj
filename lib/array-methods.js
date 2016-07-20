/**
 * Ensures the key refers to an array.
 * If the key is undefined, creates it as an empty array
 * @param  {DataObj} instance
 * @param  {String} key
 * @return {Array}
 */
function _ensureKeyIsArray(instance, key) {
  var arr = instance.get(key);

  if (typeof arr === 'undefined') {
    arr = [];
    instance.set(key, arr);
  }

  if (!Array.isArray(arr)) {
    throw new TypeError('value at ' + key + ' is not an array');
  }

  return arr;
}

function _findIndex(arr, value, fn) {
  fn = fn || function (item) {
    return item === value;
  };

  return arr.findIndex(fn);
}

exports.arrayPush = function (key, value) {
  var arr = _ensureKeyIsArray(this, key);

  // make a copy of original array
  var originalArr = arr.slice(0);

  // push the value into the array
  arr.push(value);

  var changeData = {
    key: key,
    oldValue: originalArr,
    newValue: arr,

    kind: 'array.add',
    item: value,
    index: arr.length - 1,
  };

  this.emit('change', changeData);
  this.emit('change:' + key, changeData)
};

exports.arrayPop = function (key) {
  var arr = _ensureKeyIsArray(this, key);

};

exports.arrayInsertUnique = function (key, index, value, findFn) {
  var arr = _ensureKeyIsArray(this, key);

  // check if exists
  var existsInArr = _findIndex(arr, value, findFn);

  if (!existsInArr) {
    // changes will be made, keep copy of original array
    var originalArr = arr.slice(0);

    arr.splice(index, 0, value);

    var changeData = {
      key: key,
      oldValue: originalArr,
      newValue: arr,

      kind: 'array.add',
      item: value,
      index: index,
    };

    this.emit('change', changeData);
    this.emit('change:' + key, changeData);
  }
};

exports.arrayPushUnique = function (key, value, findFn) {
  var arr = _ensureKeyIsArray(this, key);

  // check if exists
  var index = _findIndex(arr, value, findFn);

  if (index === -1) {
    // changes will be made, keep copy of original array
    var originalArr = arr.slice(0);

    arr.push(value);

    var changeData = {
      key: key,
      oldValue: originalArr,
      newValue: arr,

      kind: 'array.add',
      item: value,
      index: arr.length - 1,
    };

    this.emit('change', changeData);
    this.emit('change:' + key, changeData);
  }
};

/**
 * Removes a value from the array at the given key.
 * @param  {String} key
 * @param  {*} value
 * @param  {Function} findFn
 */
exports.arrayRemove = function (key, value, findFn) {
  var arr = _ensureKeyIsArray(this, key);

  var index = _findIndex(arr, value, findFn);

  if (index !== -1) {
    // changes will be made
    var originalArr = arr.slice(0);

    var removed = arr.splice(index, 1)[0];

    var changeData = {
      key: key,
      oldValue: originalArr,
      newValue: arr,

      kind: 'array.remove',
      index: index,
      item: removed,
    };

    this.emit('change', changeData);
    this.emit('change:' + key, changeData);
  }
};
