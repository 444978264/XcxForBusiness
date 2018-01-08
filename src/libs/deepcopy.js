function getProto(obj) {
    // return Object.getPrototypeOf;
    return obj.getPrototypeOf;
}
function class2type() {
    return {};
}
function hasOwn() {
    return class2type.hasOwnProperty;
}

function fnToString() {
    return hasOwn.toString
}
function ObjectFunctionString() {
    return fnToString.call(Object)
}

let app = {
    isFunction(obj) {
        return typeof obj === "function" && typeof obj.nodeType !== "number";
    },
    isPlainObject(obj) {
        var proto, Ctor;

        if (!obj || toString.call(obj) !== "[object Object]") {
            return false;
        }

        proto = getProto(obj);

        if (!proto) {
            return true;
        }

        // Objects with prototype are plain iff they were constructed by a global Object function
        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    },
    isEmptyObj(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    }
}

app.extend = function () {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;

        // Skip the boolean and the target
        target = arguments[i] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !app.isFunction(target)) {
        target = {};
    }

    // Extend app itself if only one argument is passed
    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {

        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {

            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (app.isPlainObject(copy) ||
                    (copyIsArray = Array.isArray(copy)))) {

                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];

                    } else {
                        clone = src && app.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[name] = app.extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};

export default app
