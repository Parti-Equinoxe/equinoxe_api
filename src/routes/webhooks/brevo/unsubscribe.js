const {getContact} = require("../../../api/brevo");
const {getToken, pushMetaData, saveToken} = require("../../../api/discord");
const status = require("../../../api/lists_brevo.json");
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
        if (!data || data.event !== "unsubscribe" || !data.list_id || !data.email) return {error: "Bad event."};
        // @TODO data storage à ameliorer
        if (!data.list_id.includes(16)) return {message: "Nothing to update"}
        //DISCORD
        let token = await getToken({email: data.email});
        if (!token) return {message: "Cannot get user Discord account"};
        const userData = await getContact(data.email);
        //console.log(userData);
        const result = await pushMetaData(userData.attributes.DISCORD_ID, token, {
            adh: 0,
            symp: 1
        });
        await saveToken(userData.attributes.DISCORD_ID, data.email, result.token);
        //FIN DISCORD
        return {message: "List updated"};
    }
}