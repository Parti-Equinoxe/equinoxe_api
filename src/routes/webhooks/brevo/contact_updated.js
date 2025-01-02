const mapping = require("../../../api/mapping.json");
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
        const content = [data.content].flat();
        console.log(content);
        for (const atr of content) {
            /*const atrAsTab = Object.keys(atr).map((f)=>{
                return {
                    name: f,
                    value: atr[f]
                }
            });
            console.log(atrAsTab);*/
            const fiels = mapping.filter((key) => callFromString(atr, key.brevo));
            let newData = {};
            for (const field of fiels) {
                newData[field.qomon] = callFromString(atr, field.brevo);
            }
            console.log(newData);
            const r = await qomon.updateContact(atr.email, newData);
            if (r.error) {
                console.log(r);
            }
            done=true;
        }
        if (!done) return {message: "No modification required."};
        return {message: "Contact updated"};
    }
}

function callFromString(object, path) {
    const keys = path.split(".");
    let val = object;
    for (const key of keys) {
        if (!val[key]) return undefined;
        val = val[key];
    }
    return val;
}