const {getContact} = require("../../../brevo");
module.exports = {
    method: "POST",
    /**
     * @param {Request} req
     * @param {Response} res
     * @return {{message: string}}
     */
    async exec(req, res) {
        const data = req.body;
        console.log(data);
        if (data.event === "list_addition") {
            console.log(await getContact(data.content.emails[0]));
        }
        //penser à ajouter verif ip
        return {message: "Nice"};
    }
}