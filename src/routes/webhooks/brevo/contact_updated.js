const status = require("../../../api/status.json");
module.exports = {
    method: "POST",
    /**
     * @param {Request} req
     * @param {Response} res
     * @return {{message: string}}
     */
    async exec(req, res) {
        const data = req.body;
        console.dir(data, {depth: null});
        if (!data || data.event !== "contact_updated" || !data.content) return {error: "Bad event."};
        let done = false;
        if (data.content.hasOwnProperty("link_list_ids") || data.content.hasOwnProperty("unlink_list_ids")) {
            const type = {
                ajout: (data.content["link_list_ids"] ?? []).filter(id => status.filters.brevo.includes(id)),
                suppression: (data.content["unlink_list_ids"] ?? []).filter(id => status.filters.brevo.includes(id))
            };//filtrage des id des list pour avoir seulement les lists que l'on veut mettre a jour
            for (const email of data.content.emails) {
                for (const list of type.ajout) {
                    //code pour ajouter le status sur qomon
                    console.log(`Ajout de ${email} sur la list ${list}`);
                    done = true;
                }
                for (const list of type.suppression) {
                    //code pour supprimer le status sur qomon
                    console.log(`Suppression de ${email} sur la list ${list}`);
                    done = true;
                }
            }
        }
        if (data.content.hasOwnProperty("attributes")) {

        }
        if (!done) return {message: "No modification required."};
        return {message: "Nice"};
    }
}