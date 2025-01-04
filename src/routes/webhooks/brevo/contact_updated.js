const mapping = require("../../../api/mapping.js");
const qomon = require("../../../api/qomon");
const {callFromString, setFromString} = require("../../../api/utils");
const {redBright} = require("cli-color");
const {getContact} = require("../../../api/brevo");
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
        const content = [data.content].flat();
        for (const atr of content) {
            const fiels = mapping.filter((key) => callFromString(atr, key.brevo));
            let newData = {};
            for (const field of fiels) {
                //transforme les donnees de brevo en qomon
                newData = setFromString(newData, field.qomon, callFromString(atr, field.brevo));
            }
            const r = await qomon.updateContact(atr.email, newData);
            if (r.error === "Contact not found") {
                console.log(atr.email);
                const rc = await qomon.createContact(atr.email);
                if (rc.error) console.log(redBright(`Error creating contact ${atr.email}: ${JSON.stringify(rc)}`));
            } else if (r.error) console.log(redBright(`Error updating contact ${atr.email}: ${JSON.stringify(r)}`));
            done = true;
        }
        if (!done) return {message: "No modification required."};
        return {message: "Contact updated"};
    }
}
