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
        if (!data || data.event !== "list_addition" || !data.list_id || !data.emails) return {error: "Bad event."};
        let count = 0;
        const list_ids = data.list_id.filter(id => status.filters.brevo.includes(id)).map((id) => status.status.find((s) => s.id_brevo === id))
        for (const email of data.emails) {
            const userID = await qomon.getID(email);
            if (userID === "0") continue; //créer le contact ?
            const userData = await qomon.get(`contacts/${userID}`);
            console.log("#########");
            console.log(userID);
            console.log(userData);
            console.log("#########");
            for (const list of list_ids) {
                const r = await qomon.upsertContact({//`contacts/${userID}`,
                    //contact: {
                        ...(userData.contact),
                        //firstname: "Test_liste",
                        status:
                            [{
                                label: "Niveau de soutien",
                                value: list.id_qomon
                            }]
                    //}
                });
                console.log(r)
            }
            count++;
        }
        if (count === 0) return {message: "No modification required."};
        return {message: "Nice"};
    }
}