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
        if (!data || data.event !== "contact_updated") return {error: "Bad event."};
        if (data.content.hasOwnProperty("link_list_ids")) {

        }
        return {message: "Nice"};
    }
}