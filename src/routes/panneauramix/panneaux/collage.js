const {getPanneau, collagePanneau} = require("../../../api/panneauramix");
module.exports = {
    method: "GET",
    exec: async (req, res) => {
        if (!req.query.id || !req.query.user) return {error:"Bad request",message: "No id or user provided."};
        return await collagePanneau(req.query.id, req.query.user);
    }
}