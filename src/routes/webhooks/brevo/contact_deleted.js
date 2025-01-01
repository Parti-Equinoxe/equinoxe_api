module.exports = {
    method: "POST",
    /**
     * @param {Request} req
     * @param {Response} res
     * @return {{message: string}}
     */
    async exec(req, res) {
        const data = req.body;
        if (!data || data.event !== "contact_deleted") return {error: "Bad event."};
        if (!data.email || data.email.length === 0) return {error: "No email."};
        for (const email of data.email) {
            //code pour sup sur qomon a rajouter
        } // mieux si on peut groupper
        return {message: "Contact deleted"};
    }
}