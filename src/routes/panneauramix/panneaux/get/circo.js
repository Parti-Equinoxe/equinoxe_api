const {getCircoByCode} = require("../../../../api/baserow");
const {getPanneauxCirco} = require("../../../../api/panneauramix");
module.exports = {
    method: "GET",
    exec: async (req, res) => {
        if (!req.query.code) return {error: "Bad request", message: "No code provided."};
        if (!req.query.page) req.query.page = 1;
        const circo = await getCircoByCode(req.query.code);
        console.log(circo);
        return {data: await getPanneauxCirco(circo.id, req.query.page)};
    }
}