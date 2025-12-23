const {getCommuneByCP} = require("../../../../api/baserow");
const {getPanneauxCommune} = require("../../../../api/panneauramix");
module.exports = {
    method: "GET",
    exec: async (req, res) => {
        if (!req.query.codepostal) return {error: "Bad request", message: "No codepostal provided."};
        if (!req.query.page) req.query.page = 1;
        const com = await getCommuneByCP(req.query.codepostal);
        return {data: await getPanneauxCommune(com.id, req.query.page)};
    }
}