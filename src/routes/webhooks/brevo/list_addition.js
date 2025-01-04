const status = require("../../../api/status.json");
const qomon = require("../../../api/qomon");
const {redBright} = require("cli-color");
//const form_NS_id = 82467;
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
        if (!data || data.event !== "list_addition" || !data.list_id || (!data.emails && !data.email)) return {error: "Bad event."};
        let count = 0;
        const list_ids = data.list_id.filter(id => status.filters.brevo.includes(id)).map((id) => status.status.find((s) => s.id_brevo === id))
        for (const email of (data.emails ?? [data.email])) {
            //code pour verif les niveaux, mit en pause pour le moment
            /*const userNS = (await qomon.getContact(email)).formdatas.find(f => f.form_id === form_NS_id) ?? {data: "None"};
            const NS = status.status.find(s => s.id_qomon.toLowerCase() === userNS.data) ?? {
                "name": "None",
                "rank": 10
            };
            console.log(userNS);
            console.log(NS);*/
            /*for (const list of list_ids) {
                const r = await qomon.updateContact(email,{
                        status:
                            [{
                                label: "Niveau de soutien",
                                value: list.id_qomon
                            }]
                });
                if (r.error === "Contact not found") {
                    console.log(email);
                    //const rc = await qomon.createContact(email);
                    //if (rc.error) console.log(redBright(`Error creating contact ${email}: ${JSON.stringify(rc)}`));
                } else if (r.error) console.log(redBright(`Error updating contact ${email}: ${JSON.stringify(r)}`));
            }*/
            const r = await qomon.updateContact(email,{
                status: list_ids.map((list) => {
                    return {
                        label: "Niveau de soutien",
                        value: list.id_qomon
                    }
                })
            });
            if (r.error === "Contact not found") {
                console.log(email);
                const rc = await qomon.createContact(email);
                if (rc.error) console.log(redBright(`Error creating contact ${email}: ${JSON.stringify(rc)}`));
            } else if (r.error) console.log(redBright(`Error updating contact ${email}: ${JSON.stringify(r)}`));
            count++;
        }
        if (count === 0) return {message: "No modification required."};
        return {message: "List updated"};
    }
}