const {getPanneau} = require("../../../api/panneauramix");
module.exports = {
    method: "GET",
    exec: async (req, res) => {
        if (!req.query.id) return {error: "Bad request", message: "No id provided."};
        return await getPanneau(req.query.id);
    }
}