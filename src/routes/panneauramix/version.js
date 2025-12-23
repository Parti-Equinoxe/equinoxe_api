const version = require("../../panneauramix/config.json").version;
module.exports = {
    method: "GET",
    exec: async (req, res) => {
        return {message: `Version : ${version}`, data: {version: version}};
    }
}