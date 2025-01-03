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
        //const emails = [data.email ?? data.emails ?? []].flat();
        if (!data || data.event !== "contact_deleted") return {error: "Bad event."};
        if (!data.email || data.email.length === 0) return {error: "No email."};
        for (const email of data.email) {
            console.log(email);
            //await qomon.deleteContact(email);
            //désactiver par sécurité pour le moment
        }
        return {message: "Contact deleted"};
    }
}