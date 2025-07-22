const br = require("../../../api/baserow");
module.exports = {
    method: "GET",
    exec: async (req, res) => {
        if (!req.query.id) return {error: "No id provided."};
        /*for (let i=34; i<43; i++) {
            await br.delete(`database/rows/table/${br.tables.panneau}/${i}/`);
        }*/
        const result = await br.delete(`database/rows/table/${br.tables.panneau}/${req.query.id}/`);
        console.log(result.data);
        return {message: "deleted"};
    }
};