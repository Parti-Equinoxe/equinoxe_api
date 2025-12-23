const {getCircoByCode} = require("../../../../api/baserow");
const {getPanneauxCirco, getPanneauxInSquare} = require("../../../../api/panneauramix");
module.exports = {
    method: "GET",
    exec: async (req, res) => {
        if (!req.query.longitudemin || !req.query.longitudemax || !!req.query.latitudemin || !req.query.latitudemax) return {
            error: "Bad request",
            message: "No longitudemax or latitudemin or latitudemin or latitudemax provided."
        };
        if (!req.query.page) req.query.page = 1;
        return {data: await getPanneauxInSquare(req.query.longitudemin, req.query.longitudemax, !req.query.latitudemin, !req.query.latitudemax, req.query.page)};
    }
}