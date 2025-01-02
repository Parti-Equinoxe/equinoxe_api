const status = require("../../../api/status.json");
const qomon = require("../../../api/qomon");
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
                ajout: (data.content["link_list_ids"] ?? []).filter(id => status.filters.brevo.includes(id)).map((id) => status.status.find((s) => s.id_brevo === id)),
                suppression: (data.content["unlink_list_ids"] ?? []).filter(id => status.filters.brevo.includes(id)).map((id) => status.status.find((s) => s.id_brevo === id))
            };//filtrage des id des list pour avoir seulement les lists que l'on veut mettre a jour
            console.log(type);
            for (const email of data.content.emails) {
                const userID = await qomon.getID(email);
                if (userID === "0") continue; //créer le contact
                console.log(userID);
                const r = await qomon.patch(`contacts/${userID}`,{
                    //firstname: "Test_liste",
                    status: type.ajout.map((s) => {
                        return {
                            label: "Niveau de soutien",
                            value: s.id_qomon
                        }
                    })
                });
                console.log(r)
                for (const list of type.ajout) {
                    //code pour ajouter le status sur qomon
                    console.log(`Ajout de ${email} sur la list ${list.name}`);
                    done = true;
                }
                for (const list of type.suppression) {
                    //code pour supprimer le status sur qomon
                    console.log(`Suppression de ${email} sur la list ${list.name}`);
                    done = true;
                }
            }
        }
        //console.log(data.content.length);
        //console.log(data.content[0]);
        /*if (typeof data.content === "object") {
            const userID = getID()
        }*/
        if (!done) return {message: "No modification required."};
        return {message: "Nice"};
    }
}