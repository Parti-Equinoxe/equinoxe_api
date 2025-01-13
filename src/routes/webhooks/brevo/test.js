module.exports = {
    methode: "POST",
    token: true,
    exec: (req, res) => {
        console.log(req.body);
        return {message: "Test"}
    }
}