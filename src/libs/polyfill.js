if (!Array.prototype.reduce) {
	Object.defineProperty(Array.prototype, 'reduce', {
		value: function (callback /*, initialValue*/) {
			if (this === null) {
				throw new TypeError('Array.prototype.reduce ' +
					'called on null or undefined');
			}
			if (typeof callback !== 'function') {
				throw new TypeError(callback +
					' is not a function');
			}

			// 1. Let O be ? ToObject(this value).
			var o = Object(this);

			// 2. Let len be ? ToLength(? Get(O, "length")).
			var len = o.length >>> 0;

			// Steps 3, 4, 5, 6, 7      
			var k = 0;
			var value;

			if (arguments.length >= 2) {
				value = arguments[1];
			} else {
				while (k < len && !(k in o)) {
					k++;
				}

				// 3. If len is 0 and initialValue is not present,
				//    throw a TypeError exception.
				if (k >= len) {
					throw new TypeError('Reduce of empty array ' +
						'with no initial value');
				}
				value = o[k++];
			}

			// 8. Repeat, while k < len
			while (k < len) {
				// a. Let Pk be ! ToString(k).
				// b. Let kPresent be ? HasProperty(O, Pk).
				// c. If kPresent is true, then
				//    i.  Let kValue be ? Get(O, Pk).
				//    ii. Let accumulator be ? Call(
				//          callbackfn, undefined,
				//          « accumulator, kValue, k, O »).
				if (k in o) {
					value = callback(value, o[k], k, o);
				}

				// d. Increase k by 1.      
				k++;
			}

			// 9. Return accumulator.
			return value;
		}
	});
}

const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
const concat = Function.bind.call(Function.call, Array.prototype.concat);
const keys = Reflect.ownKeys;

if (!Object.values) {
	Object.values = function values(O) {
		return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
	};
}

if (!Object.entries) {
	Object.entries = function entries(O) {
		return reduce(keys(O), (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []), []);
	};
}
if (!Array.prototype.includes) {
	Object.defineProperty(Array.prototype, 'includes', {
		value: function (searchElement, fromIndex) {

			// 1. Let O be ? ToObject(this value).
			if (this == null) {
				throw new TypeError('"this" is null or not defined');
			}

			var o = Object(this);

			// 2. Let len be ? ToLength(? Get(O, "length")).
			var len = o.length >>> 0;

			// 3. If len is 0, return false.
			if (len === 0) {
				return false;
			}

			// 4. Let n be ? ToInteger(fromIndex).
			//    (If fromIndex is undefined, this step produces the value 0.)
			var n = fromIndex | 0;

			// 5. If n ≥ 0, then
			//  a. Let k be n.
			// 6. Else n < 0,
			//  a. Let k be len + n.
			//  b. If k < 0, let k be 0.
			var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

			// 7. Repeat, while k < len
			while (k < len) {
				// a. Let elementK be the result of ? Get(O, ! ToString(k)).
				// b. If SameValueZero(searchElement, elementK) is true, return true.
				// c. Increase k by 1.
				// NOTE: === provides the correct "SameValueZero" comparison needed here.
				if (o[k] === searchElement) {
					return true;
				}
				k++;
			}

			// 8. Return false
			return false;
		}
	});
}
if (!String.prototype.includes) {
	String.prototype.includes = function (search, start) {
		'use strict';
		if (typeof start !== 'number') {
			start = 0;
		}

		if (start + search.length > this.length) {
			return false;
		} else {
			return this.indexOf(search, start) !== -1;
		}
	};
}