function _callFromString(object, path) {
    const keys = path.split(".");
    let val = object;
    for (const key of keys) {
        if (!val[key]) return undefined;
        val = val[key];
    }
    return val;
}

/**
 * @param {Object} object
 * @param {String} path
 * @return {undefined | *}
 */
module.exports.callFromString = _callFromString;

/**
 * @param {Object} object
 * @param {String} path
 * @param {*} value
 * @return {undefined | *}
 */
module.exports.setFromString = (object, path, value) => {
    const keys = path.split(".");
    let val = object, start = {};
    start[keys[keys.length - 1]] = value;
    for (const i in keys.slice(0, keys.length - 1)) {
        let fromObj = _callFromString(val, keys.slice(0, keys.length - 1 - i).join(".")) ?? {};
        if (typeof fromObj !== "object") fromObj = {};
        const copy = {
            ...start,
            ...fromObj
        };
        start = {};
        start[keys[keys.length - i - 2]] = copy;
    }
    val = {
        ...val,
        ...start
    };
    return val;
}