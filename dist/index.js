/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class ArrayUtility {
  static all(items, predicate) {
    return items.every(predicate);
  }
  static any(items, predicate) {
    return predicate ? items.some(predicate) : items.length > 0;
  }
  static where(items, predicate) {
    return items.filter(predicate);
  }
  static whereAsync(items, callback) {
    return __awaiter(this, void 0, void 0, function* () {
      return items.filter(item => callback(item));
    });
  }
  static selectMany(items, collectionSelector) {
    const result = [];
    const length = items.length;
    for (let i = 0; i < length; i++) {
      const subItems = collectionSelector(items[i]);
      result.push(...subItems);
    }
    return result;
  }
  static chunk(items, size) {
    if (size < 1) throw Error(`Size "${size}" out of range, must be at least 1 or greater.`);
    const result = [];
    const copy = [...items];
    while (copy.length) {
      result.push(copy.splice(0, size));
    }
    return result;
  }
  static take(items, count) {
    if (count < 0) {
      count = 0;
    }
    let length = items.length;
    if (count >= 0 && count < length) {
      length = count;
    }
    const result = new Array(length);
    for (let i = 0; i < length; i++) {
      result[i] = items[i];
    }
    return result;
  }
  static takeLast(items, count) {
    if (count < 0) {
      count = 0;
    }
    let length = items.length;
    if (count >= 0 && count < length) {
      length = count;
    }
    const result = new Array(length);
    const prefix = items.length - length;
    for (let i = 0; i < length; i++) {
      result[i] = items[prefix + i];
    }
    return result;
  }
  static takeWhile(items, predicate) {
    const result = [];
    const length = items.length;
    for (let i = 0; i < length; i++) {
      const item = items[i];
      const valid = predicate(items[i], i);
      if (!valid) {
        break;
      }
      result.push(item);
    }
    return result;
  }
  static skip(items, count) {
    if (count < 0) {
      count = 0;
    }
    const length = items.length;
    const firstIndex = count < length ? count : length;
    const newLength = length - firstIndex;
    const result = new Array(newLength);
    for (let dest = 0, source = firstIndex; dest < newLength; dest++, source++) {
      result[dest] = items[source];
    }
    return result;
  }
  static first(items, predicate, defaultValue) {
    const item = ArrayUtility.firstOrDefault(items, predicate, defaultValue);
    if (item == null) {
      const error = predicate ? "No item found matching the specified predicate." : "The source sequence is empty.";
      throw Error(error);
    }
    return item;
  }
  static firstOrDefault(items, predicate, defaultValue) {
    const length = items.length;
    if (predicate) {
      for (let i = 0; i < length; i++) {
        const item = items[i];
        if (predicate(item)) {
          return item;
        }
      }
    } else if (length > 0) {
      return items[0];
    }
    return defaultValue !== null && defaultValue !== void 0 ? defaultValue : null;
  }
  static last(items, predicate, defaultValue) {
    const item = ArrayUtility.lastOrDefault(items, predicate, defaultValue);
    if (item == null) {
      const error = predicate ? "No item found matching the specified predicate." : "The source sequence is empty.";
      throw Error(error);
    }
    return item;
  }
  static lastOrDefault(items, callback, defaultValue) {
    const length = items.length;
    if (callback) {
      for (let i = length - 1; i >= 0; i--) {
        const item = items[i];
        if (callback(item)) {
          return item;
        }
      }
    } else if (length > 0) {
      return items[length - 1];
    }
    return defaultValue !== null && defaultValue !== void 0 ? defaultValue : null;
  }
  static forEachAsync(items, callback) {
    return __awaiter(this, void 0, void 0, function* () {
      const promises = items.map(item => callback(item));
      yield Promise.all(promises);
    });
  }
  static groupBy(items, callback = null) {
    const map = new Map();
    items.forEach(item => {
      const key = callback ? callback(item) : null;
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return Array.from(map.values());
  }
  static remove(items, item) {
    if (Array.isArray(item)) {
      const length = item.length;
      for (let i = 0; i < length; i++) {
        ArrayUtility.remove(items, item[i]);
      }
    } else {
      const index = items.indexOf(item);
      if (index !== -1) {
        items.splice(index, 1);
      }
    }
  }
  static removeAt(items, index) {
    if (index < 0 || index >= items.length) throw Error(`Array index "${index}" out of range, can be in [0..${items.length}].`);
    items.splice(index, 1);
  }
  static max(items, callback = null) {
    if (items.length === 0) throw Error("Array cannot be empty.");
    callback = callback || (item => item);
    let maxItem = items[0];
    let maxValue = callback(maxItem);
    const length = items.length;
    for (let i = 1; i < length; i++) {
      const item = items[i];
      const value = callback(item);
      if (value > maxValue) {
        maxValue = value;
        maxItem = item;
      }
    }
    return maxItem;
  }
  static maxValue(items, callback) {
    return callback(ArrayUtility.max(items, callback));
  }
  static min(items, callback = null) {
    if (items.length === 0) throw Error("Array cannot be empty.");
    callback = callback || (item => item);
    let minItem = items[0];
    let minValue = callback(minItem);
    const length = items.length;
    for (let i = 1; i < length; i++) {
      const item = items[i];
      const value = callback(item);
      if (value < minValue) {
        minValue = value;
        minItem = item;
      }
    }
    return minItem;
  }
  static minValue(items, callback) {
    return callback(ArrayUtility.min(items, callback));
  }
  static sum(items, callback) {
    let sum = 0;
    if (items) {
      items.forEach(item => {
        var _a;
        return sum += (_a = callback(item)) !== null && _a !== void 0 ? _a : 0;
      });
    }
    return sum;
  }
  static count(items, predicate) {
    let count = 0;
    if (items) {
      if (predicate) {
        items.forEach((item, index) => count += predicate(item, index) ? 1 : 0);
      } else {
        count = items.length;
      }
    }
    return count;
  }
  static distinct(items, callback) {
    const result = [];
    const length = items.length;
    if (length > 0) {
      const set = new Set();
      for (let i = 0; i < length; i++) {
        const item = items[i];
        const key = callback ? callback(item) : item;
        if (!set.has(key)) {
          set.add(key);
          result.push(items[i]);
        }
      }
    }
    return result;
  }
  static repeat(element, count) {
    const items = new Array(count);
    for (let i = 0; i < count; i++) {
      items[i] = element;
    }
    return items;
  }
  static sortBy(source, keySelector1, keySelector2, keySelector3, keySelector4, keySelector5, keySelector6) {
    const compare = (keySelector, x, y) => {
      const xKey = keySelector ? keySelector(x) : x;
      const yKey = keySelector ? keySelector(y) : y;
      return xKey > yKey ? 1 : xKey < yKey ? -1 : 0;
    };
    const comparator = (x, y) => {
      let value = compare(keySelector1, x, y);
      if (value === 0 && keySelector2) {
        value = compare(keySelector2, x, y);
        if (value === 0 && keySelector3) {
          value = compare(keySelector3, x, y);
          if (value === 0 && keySelector4) {
            value = compare(keySelector4, x, y);
            if (value === 0 && keySelector5) {
              value = compare(keySelector5, x, y);
              if (value === 0 && keySelector6) {
                value = compare(keySelector6, x, y);
              }
            }
          }
        }
      }
      return value;
    };
    source.sort(comparator);
  }
}

const ArrayExtensions = function () {
  if (Array.prototype.all == null) {
    Array.prototype.all = function (predicate) {
      return ArrayUtility.all(this, predicate);
    };
  }
  if (Array.prototype.any == null) {
    Array.prototype.any = function (predicate) {
      return ArrayUtility.any(this, predicate);
    };
  }
  if (Array.prototype.where == null) {
    Array.prototype.where = function (predicate) {
      return ArrayUtility.where(this, predicate);
    };
  }
  if (Array.prototype.whereAsync == null) {
    Array.prototype.whereAsync = function (predicate) {
      return ArrayUtility.whereAsync(this, predicate);
    };
  }
  if (Array.prototype.take == null) {
    Array.prototype.take = function (count) {
      return ArrayUtility.take(this, count);
    };
  }
  if (Array.prototype.takeLast == null) {
    Array.prototype.takeLast = function (count) {
      return ArrayUtility.takeLast(this, count);
    };
  }
  if (Array.prototype.takeWhile == null) {
    Array.prototype.takeWhile = function (predicate) {
      return ArrayUtility.takeWhile(this, predicate);
    };
  }
  if (Array.prototype.skip == null) {
    Array.prototype.skip = function (count) {
      return ArrayUtility.skip(this, count);
    };
  }
  if (Array.prototype.selectMany == null) {
    Array.prototype.selectMany = function (collectionSelector) {
      return ArrayUtility.selectMany(this, collectionSelector);
    };
  }
  if (Array.prototype.groupBy == null) {
    Array.prototype.groupBy = function (predicate) {
      return ArrayUtility.groupBy(this, predicate);
    };
  }
  if (Array.prototype.remove == null) {
    Array.prototype.remove = function (item) {
      ArrayUtility.remove(this, item);
    };
  }
  if (Array.prototype.removeAt == null) {
    Array.prototype.removeAt = function (index) {
      ArrayUtility.removeAt(this, index);
    };
  }
  if (Array.prototype.max == null) {
    Array.prototype.max = function (predicate = null) {
      return ArrayUtility.max(this, predicate);
    };
  }
  if (Array.prototype.maxValue == null) {
    Array.prototype.maxValue = function (predicate) {
      return ArrayUtility.maxValue(this, predicate);
    };
  }
  if (Array.prototype.min == null) {
    Array.prototype.min = function (predicate = null) {
      return ArrayUtility.min(this, predicate);
    };
  }
  if (Array.prototype.minValue == null) {
    Array.prototype.minValue = function (predicate) {
      return ArrayUtility.minValue(this, predicate);
    };
  }
  if (Array.prototype.sum == null) {
    Array.prototype.sum = function (predicate) {
      return ArrayUtility.sum(this, predicate);
    };
  }
  if (Array.prototype.count == null) {
    Array.prototype.count = function (predicate) {
      return ArrayUtility.count(this, predicate);
    };
  }
  if (Array.prototype.chunk == null) {
    Array.prototype.chunk = function (size) {
      return ArrayUtility.chunk(this, size);
    };
  }
  if (Array.prototype.distinct == null) {
    Array.prototype.distinct = function (predicate) {
      return ArrayUtility.distinct(this, predicate);
    };
  }
  if (Array.prototype.sortBy == null) {
    Array.prototype.sortBy = function (keySelector1, keySelector2, keySelector3, keySelector4, keySelector5, keySelector6) {
      ArrayUtility.sortBy(this, keySelector1, keySelector2, keySelector3, keySelector4, keySelector5, keySelector6);
    };
  }
  if (Array.prototype.forEachAsync == null) {
    Array.prototype.forEachAsync = function (predicate) {
      return ArrayUtility.forEachAsync(this, predicate);
    };
  }
  if (Array.prototype.first == null) {
    Array.prototype.first = function (predicate, defaultValue) {
      return ArrayUtility.first(this, predicate, defaultValue);
    };
  }
  if (Array.prototype.firstOrDefault == null) {
    Array.prototype.firstOrDefault = function (predicate, defaultValue) {
      return ArrayUtility.firstOrDefault(this, predicate, defaultValue);
    };
  }
  if (Array.prototype.last == null) {
    Array.prototype.last = function (predicate, defaultValue) {
      return ArrayUtility.last(this, predicate, defaultValue);
    };
  }
  if (Array.prototype.lastOrDefault == null) {
    Array.prototype.lastOrDefault = function (predicate, defaultValue) {
      return ArrayUtility.lastOrDefault(this, predicate, defaultValue);
    };
  }
  if (Array.prototype.repeat == null) {
    Array.prototype.repeat = function (element, count) {
      return ArrayUtility.repeat(element, count);
    };
  }
};
ArrayExtensions();

// Import (Array extension initialization)
// Static initializer (optional):
// Usage:
//   import Linq from "@reapptor/ts-linq";
//   Linq.init();
class Linq {
  static init() {}
}

export { ArrayExtensions, ArrayUtility, Linq as default };
