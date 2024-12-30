module.exports = {
    method: "POST",
    /**
     * @param {Request} req
     * @param {Response} res
     * @return {{message: string}}
     */
    exec(req, res) {
        console.log(req.body);
        //penser à ajouter verif ip
        return {message: "Nice"};
    }
}