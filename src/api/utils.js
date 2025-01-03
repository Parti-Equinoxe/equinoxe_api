function copyOf(object) {
    return JSON.parse(JSON.stringify(object));
}

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
    console.dir(val, {depth: null});
    for (const i in keys.slice(0, keys.length - 1)) {
        console.log(`### ${i} ###`);
        console.log(start);
        console.log(_callFromString(val, keys.slice(0, keys.length - 1 - i).join(".")))
        let fromObj = _callFromString(val, keys.slice(0, keys.length - 1 - i).join(".")) ?? {};
        if (typeof fromObj !== "object") fromObj = {};
        const copy = {
            ...start,
            ...fromObj
        };
        console.dir(copy, {depth: null});
        start = {};
        start[keys[keys.length - i - 2]] = copy;
    }
    console.dir(start, {depth: null});
    //val[keys[0]] = start;
    val = {
        ...val,
        ...start
    };
    console.log("### end ###");
    console.dir(val, {depth: null});
    return val;
}