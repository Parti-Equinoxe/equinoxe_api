const msg = require("../../panneauramix/config.json").message;
module.exports = {
    method: "GET",
    exec(req, res) {
        return {message: msg};
    }
}